import { CompositeMetadata, WellKnownMimeType } from 'rsocket-composite-metadata';
import { RSocketServer } from 'rsocket-core';
import { WebsocketServerTransport } from 'rsocket-websocket-server';
import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import prefixedLogger from '../utils/logger.js';

const rsocketLogger = prefixedLogger('⚡ [RSocketServer]: ');

const MESSAGE_RSOCKET_ROUTING = WellKnownMimeType.MESSAGE_RSOCKET_ROUTING;

class CustomRSocketServer {
  constructor() {
    //this.chatroomSinks = new Map();
    this.connectionsToChatroomsMap = new Map(); // Key: chatroomId / value: set<{userId, connection}>
    this.chunkStream = new Map();
    this.initializeServer();
  }

  initializeServer() {
    this.server = new RSocketServer({
      transport: new WebsocketServerTransport({
        wsCreator: options => {
          return new WebSocketServer({
            port: process.env.RSOCKET_PORT || 8085,
          });
        },
      }),
      fragmentation: {
        maxOutboundFragmentSize: 65536, // Set the maximum outbound fragment size
      },
      resume: {
        cacheSize: 65536, // Size of the cache for resuming, can be adjusted
        tokenGenerator: () => {
          return Buffer.from(uuidv4().toString());
        },
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
            fireAndForget: payload => {
              if (!payload.metadata) {
                rsocketLogger.error('Payload metadata is undefined');
                return {
                  cancel: () => {},
                  request: _n => {},
                  onExtension: () => {},
                };
              }

              const compositeMetadata = new CompositeMetadata(payload.metadata);

              let routingMetadata;
              for (const entry of compositeMetadata) {
                if (entry.mimeType && entry.mimeType === MESSAGE_RSOCKET_ROUTING.toString()) {
                  routingMetadata = entry.content.toString();
                  break;
                }
              }

              if (!routingMetadata) {
                rsocketLogger.error('Routing metadata not found');
                return {
                  cancel: () => {},
                  request: _n => {},
                  onExtension: () => {},
                };
              }

              rsocketLogger.info(`Routing metadata: ${routingMetadata}`);

              if (routingMetadata.substring(1).startsWith('send.message.')) {
                const data = routingMetadata.split('.');
                const userId = data[2];
                const chatroomId = data[3];

                console.log(payload.data.toString('utf8'));

                if (payload.data) {
                  const messages = JSON.parse(payload.data.toString());

                  rsocketLogger.info(`RequestStream received: ${messages}`);

                  this.connectionsToChatroomsMap.get(chatroomId).forEach(userConnection => {
                    userConnection.connection.onNext({ data: payload.data });
                  });
                }
              } else {
                rsocketLogger.error(`No handler for route: ${routingMetadata}`);
                return {
                  cancel: () => {
                    this.subscribers.get(chatroomId).delete(userId);
                  },
                  request: _n => {},
                  onExtension: () => {},
                };
              }
            },

            requestStream: (payload, initialRequestN, responderStream) => {
              if (!payload.metadata) {
                rsocketLogger.error('Payload metadata is undefined');
                return {
                  cancel: () => {},
                  request: _n => {},
                  onExtension: () => {},
                };
              }

              const compositeMetadata = new CompositeMetadata(payload.metadata);

              let routingMetadata;
              for (const entry of compositeMetadata) {
                if (entry.mimeType && entry.mimeType === MESSAGE_RSOCKET_ROUTING.toString()) {
                  routingMetadata = entry.content.toString();
                  break;
                }
              }

              if (!routingMetadata) {
                rsocketLogger.error('Routing metadata not found');
                return {
                  cancel: () => {},
                  request: _n => {},
                  onExtension: () => {},
                };
              }

              rsocketLogger.info(`Routing metadata: ${routingMetadata}`);

              if (routingMetadata.substring(1).startsWith('chatroom.stream.')) {
                const data = routingMetadata.split('.');
                const userId = data[2];
                const chatroomId = data[3];

                // if (!this.chatroomSinks.has(chatroomId)) {
                //   this.chatroomSinks.set(chatroomId, new Map());
                // }
                // this.chatroomSinks.get(chatroomId).set(userId, responderStream);

                this.addUserToChatroom(chatroomId, userId, responderStream);

                if (payload.data) {
                  const messages = JSON.parse(payload.data.toString());

                  rsocketLogger.info(`RequestStream received: ${messages}`);
                }
              } else {
                rsocketLogger.error(`No handler for route: ${routingMetadata}`);
                return {
                  cancel: () => {
                    this.subscribers.get(chatroomId).delete(userId);
                  },
                  request: _n => {},
                  onExtension: () => {},
                };
              }

              let requestedResponses = Number.MAX_SAFE_INTEGER;
              return {
                cancel() {
                  rsocketLogger.info('stream cancelled by client');
                },
                request(n) {
                  requestedResponses += n;
                  rsocketLogger.info(`request n: ${n}, requestedResponses: ${requestedResponses}`);
                },
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

  getConnectionByChatroomId(userId) {
    return this.connections.get(userId);
  }

  addUserToChatroom(chatroomId, userId, connection) {
    if (!this.connectionsToChatroomsMap.has(chatroomId)) {
      this.connectionsToChatroomsMap.set(chatroomId, new Set());
    }
    this.connectionsToChatroomsMap.get(chatroomId).add({ userId: userId, connection: connection });
  }

  removeUserFromChatroom(chatroomId, userId) {
    if (this.connectionToChatroomMap.has(chatroomId)) {
      this.connectionToChatroomMap.get(chatroomId).delete(userId);
      if (this.connectionToChatroomMap.get(chatroomId).size === 0) {
        this.connectionToChatroomMap.delete(chatroomId);
      }
      if (this.chatroomSinks.has(chatroomId)) {
        this.chatroomSinks.get(chatroomId).delete(userId);
        if (this.chatroomSinks.get(chatroomId).size === 0) {
          this.chatroomSinks.delete(chatroomId);
        }
      }
    }
  }

  emitReceivedMessage(chatMessage) {
    const chatroomId = chatMessage.chatroomId;
    const sinks = this.chatroomSinks.get(chatroomId);
    if (sinks) {
      sinks.forEach(sink => {
        sink.onNext({ data: Buffer.from(JSON.stringify(chatMessage)) });
      });
    }
  }
}

export default CustomRSocketServer;
