import { CompositeMetadata, WellKnownMimeType } from 'rsocket-composite-metadata';
import { RSocketServer } from 'rsocket-core';
import { WebsocketServerTransport } from 'rsocket-websocket-server';
import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import prefixedLogger from '../utils/logger.js';
import messageService from '../domains/messages/service/messageService.js';
import fs from 'fs';
import https from 'https';

import aiFactory from '../ai/providers/RegisterProviders.js';

const rsocketLogger = prefixedLogger('⚡ [RSocketServer]: ');

const MESSAGE_RSOCKET_ROUTING = WellKnownMimeType.MESSAGE_RSOCKET_ROUTING;

class CustomRSocketServer {
  constructor() {
    this.connectionsToChatroomsMap = new Map(); // Key: chatroomId / value: set<{userId, connection}>
    this.chunkStream = new Map(); // Currently not used, but for future used to split messages up into chunks
    this.initializeServer();
  }

  initializeServer() {
    const serverOptions = {
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('cert.pem'),
    };

    this.server = new RSocketServer({
      transport: new WebsocketServerTransport({
        wsCreator: () => {
          return new WebSocketServer({
            // port: process.env.RSOCKET_PORT || 8085,
            server: https.createServer(serverOptions),
          });
        },
      }),
      fragmentation: {
        maxOutboundFragmentSize: 65536, // Set the maximum outbound fragment size
      },
      resume: {
        cacheSize: 65536, // Size of the cache for resuming, can be adjusted
        tokenGenerator: () => Buffer.from(uuidv4().toString()),
        reconnectFunction: attempt => {
          let delay = Math.pow(2, attempt) * 1000; // Exponential backoff starting from 1 second
          delay = Math.min(delay, 60000); // Cap the delay to 1 minute (60000 milliseconds)
          return new Promise(resolve => {
            setTimeout(resolve, delay);
          });
        },
      },
      acceptor: {
        accept: async (payload, remotePeer) => {
          return {
            fireAndForget: async payload => {
              if (!payload.metadata) {
                rsocketLogger.error('Payload metadata is undefined');
                this.createEmptyResponse();
              }

              const compositeMetadata = new CompositeMetadata(payload.metadata);
              const routingMetadata = this.getRoutingMetadata(compositeMetadata);

              if (!routingMetadata) {
                rsocketLogger.error('Routing metadata not found');
                return this.createEmptyResponse();
              }

              rsocketLogger.info(`Routing metadata: ${routingMetadata}`);
              let chatroomId;

              switch (true) {
                case routingMetadata.substring(1).startsWith('send.message.'):
                  chatroomId = this.getIdsMessageRouting(routingMetadata).chatroomId;
                  await this.handleSendMessage(payload, chatroomId);
                  break;

                case routingMetadata.substring(1).startsWith('delete.message.'):
                  chatroomId = this.getIdsMessageRouting(routingMetadata).chatroomId;
                  await this.handleDeleteMessage(payload, chatroomId);
                  break;

                case routingMetadata.substring(1).startsWith('close.message.'):
                  chatroomId = this.getIdsMessageRouting(routingMetadata).chatroomId;
                  await this.handleCloseConnection(payload, chatroomId);
                  break;

                case routingMetadata.substring(1).startsWith('ai.stream.'):
                  chatroomId = this.getIdsMessageRouting(routingMetadata).chatroomId;
                  const payloadData = JSON.parse(payload.data.toString());
                  const { provider, messages } = payloadData.data;
                  await this.handleAIStream(chatroomId, provider, messages);
                  break;

                default:
                  rsocketLogger.error(`No handler for route: ${routingMetadata}`);
                  return this.createEmptyResponse();
              }
            },

            requestStream: (payload, initialRequestN, responderStream) => {
              if (!payload.metadata) {
                rsocketLogger.error('Payload metadata is undefined');
                return this.createEmptyResponse();
              }

              const compositeMetadata = new CompositeMetadata(payload.metadata);
              const routingMetadata = this.getRoutingMetadata(compositeMetadata);

              if (!routingMetadata) {
                rsocketLogger.error('Routing metadata not found');
                return this.createEmptyResponse();
              }

              rsocketLogger.info(`Routing metadata: ${routingMetadata}`);

              if (routingMetadata.substring(1).startsWith('chatroom.stream.')) {
                const data = routingMetadata.split('.');
                // data[2] is userId if needed for future implementations
                const chatroomId = data[3];
                this.handleChatroomStream(payload, chatroomId, responderStream);
              } else {
                rsocketLogger.error(`No handler for route: ${routingMetadata}`);
                return this.createEmptyResponse();
              }

              return {
                cancel: () => rsocketLogger.info('stream cancelled by client'),
                request: n => rsocketLogger.info(`request n: ${n}`),
                onExtension: () => {},
              };
            },
            requestResponse: (payload, responderStream) => {
              responderStream.onNext({ data: Buffer.from('Hello from server') }, true);
              responderStream.onComplete(); // Complete the stream
              return {
                cancel: () => {
                  // Implement cancel logic here
                },
                onExtension: () => {
                  // Implement onExtension logic here
                },
              };
            },
          };
        },
      },
    });
  }

  static getInstance() {
    if (!CustomRSocketServer.instance) {
      CustomRSocketServer.instance = new CustomRSocketServer();
    }
    return CustomRSocketServer.instance;
  }

  async start() {
    try {
      this.closeable = await this.server.bind();
      rsocketLogger.info(`RSocket Source is being initialized!`);
      rsocketLogger.info(`Server listening on port ${process.env.RSOCKET_PORT || 3060}`);
      return this.server;
    } catch (error) {
      rsocketLogger.error(`Error starting server: ${error}`);
      throw error;
    }
  }

  close() {
    if (this.closeable) {
      this.closeable.close();
    }
  }

  createEmptyResponse() {
    return {
      cancel: () => {},
      request: _n => {},
      onExtension: () => {},
    };
  }

  getRoutingMetadata(compositeMetadata) {
    for (const entry of compositeMetadata) {
      if (entry.mimeType && entry.mimeType === MESSAGE_RSOCKET_ROUTING.toString()) {
        return entry.content.toString();
      }
    }
    return null;
  }

  getIdsMessageRouting(routingMetadata) {
    const data = routingMetadata.split('.');
    const userId = data[2]; // UserId is keept if neeeded for future updates
    const chatroomId = data[3];
    return { userId, chatroomId };
  }

  async handleSendMessage(payload, chatroomId) {
    if (payload.data) {
      const message = JSON.parse(payload.data.toString());
      rsocketLogger.info(`FireAndForget received: ${message}`);

      const newMessage = await messageService.createNewMessage(message.data);
      const buffer = Buffer.from(JSON.stringify({ data: newMessage }));

      this.connectionsToChatroomsMap.get(chatroomId).forEach(userConnection => {
        userConnection.connection.onNext({ data: buffer });
      });
    }
  }

  async handleDeleteMessage(payload, chatroomId) {
    if (payload.data) {
      const payloadData = JSON.parse(payload.data.toString());
      rsocketLogger.info(`FireAndForget delete message received: ${payloadData.data.deleteMessageId}`);

      await messageService.deleteMessageById(payloadData.data.deleteMessageId);
      this.connectionsToChatroomsMap.get(chatroomId).forEach(userConnection => {
        userConnection.connection.onNext({ data: payload.data });
      });
    }
  }

  async handleCloseConnection(payload, chatroomId) {
    if (payload.data) {
      const rsocketConnectionId = JSON.parse(payload.data.toString());
      rsocketLogger.info(`FireAndForget closing received: ${rsocketConnectionId.data}`);
      this.removeUserFromChatroom(chatroomId, rsocketConnectionId.data);
    }
  }

  handleChatroomStream(payload, chatroomId, responderStream) {
    if (payload.data) {
      const rsocketConnectionId = JSON.parse(payload.data.toString());
      rsocketLogger.info(`RequestStream received: ${rsocketConnectionId.data}`);

      this.addUserToChatroom(chatroomId, rsocketConnectionId.data, responderStream);
    }
  }

  async handleAIStream(chatroomId, provider, payload) {
    const newMessage = await messageService.createNewMessage(payload[payload.length - 1]);
    const buffer = Buffer.from(JSON.stringify({ data: newMessage }));
    this.connectionsToChatroomsMap.get(chatroomId).forEach(userConnection => {
      userConnection.connection.onNext({ data: buffer });
    });
    setTimeout(async () => {
      try {
        const aiInstance = aiFactory.getProvider(provider);
        const aiAnswer = await aiInstance.streamChat(payload, this.connectionsToChatroomsMap.get(chatroomId));

        // Important that messageService will get aiMessage without _id param
        if (aiAnswer._id) {
          delete aiAnswer._id;
        }
        await messageService.createNewMessage(aiAnswer);
      } catch (error) {
        rsocketLogger.error(`Error in AI stream: ${error.message}`);
        // responderStream.onError(error);
      }
    }, 1000);
  }

  getConnectionByChatroomId(userId) {
    return this.connections.get(userId);
  }

  addUserToChatroom(chatroomId, rsocketConnectionId, connection) {
    if (!this.connectionsToChatroomsMap.has(chatroomId)) {
      this.connectionsToChatroomsMap.set(chatroomId, []);
    }
    this.connectionsToChatroomsMap
      .get(chatroomId)
      .push({ rsocketConnectionId: rsocketConnectionId, connection: connection });
  }

  removeUserFromChatroom(chatroomId, rsocketConnectionId) {
    if (this.connectionsToChatroomsMap.has(chatroomId)) {
      this.connectionsToChatroomsMap.set(
        chatroomId,
        this.connectionsToChatroomsMap.get(chatroomId).filter(user => user.rsocketConnectionId != rsocketConnectionId),
      );
      rsocketLogger.info('Deleted user from connectionsToChatroomsMap');
      if (this.connectionsToChatroomsMap.get(chatroomId).length === 0) {
        this.connectionsToChatroomsMap.delete(chatroomId);
        rsocketLogger.info('Deleted connection map from connectionsToChatroomsMap');
      }
    }
  }
}

export default CustomRSocketServer;
