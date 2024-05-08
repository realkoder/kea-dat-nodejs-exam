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
    this.connections = new Map();
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
              console.log(payload);
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

              if (routingMetadata.substring(1).startsWith('test')) {
                const data = routingMetadata.split('.');
                const chartflowId = data[3];
                const chatroomId = data[4];

                if (payload.data) {
                  const messages = JSON.parse(payload.data.toString());
                  const buildConversationQuestion = messages
                    .map(message => {
                      const createdDate = message.chunk.createdDate
                        ? new Date(message.chunk.createdDate * 1000)
                        : new Date();
                      const dateString = `${createdDate.toLocaleDateString()} ${createdDate.toLocaleTimeString()}`;

                      return `[userId: ${message.chunk.userId} | textMessage: ${message.chunk.textMessage} | createdDate: ${dateString}]\n`;
                    })
                    .join('');

                  rsocketLogger.info(`RequestStream received: ${messages}`);
                }
              } else {
                rsocketLogger.error(`No handler for route: ${routingMetadata}`);
                return {
                  cancel: () => {},
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
}

export default CustomRSocketServer;
