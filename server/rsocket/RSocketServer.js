import { CompositeMetadata, WellKnownMimeType } from 'rsocket-composite-metadata';
import { RSocketServer } from 'rsocket-core';
import RSocketWebSocketServer from 'rsocket-websocket-server';

import prefixedLogger from "../utils/logger.js"

const rsocketLogger = prefixedLogger('⚡ [RSocketServer]: ');

const MESSAGE_RSOCKET_ROUTING = WellKnownMimeType.MESSAGE_RSOCKET_ROUTING;

class CustomRSocketServer {
    constructor(serverApp) {
        this.rsocket = new RSocketServer({
            transport: new RSocketWebSocketServer({
                listenOptions: {
                    port: parseInt(process.env.RSOCKET_PORT || '', 10) || 3060,
                    host: serverApp.app.get('host') || ''
                }
            }),
            acceptor: {
                accept: async (payload, remotePeer) => {
                    return {
                        requestStream: (
                            payload,
                            initialRequestN,
                            responderStream
                        ) => {
                            if (!payload.metadata) {
                                rsocketLogger.error('Payload metadata is undefined');
                                return {
                                    cancel: () => {},
                                    request: (_n) => {},
                                    onExtension: () => {}
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
                                    request: (_n) => {},
                                    onExtension: () => {}
                                };
                            }

                            rsocketLogger.info(`Routing metadata: ${routingMetadata}`);

                            if (routingMetadata.substring(1).startsWith('flowise.process.chartflow.')) {
                                const data = routingMetadata.split('.');
                                const chartflowId = data[3];
                                const chatroomId = data[4];

                                if (payload.data) {
                                    const messages = JSON.parse(payload.data.toString());
                                    const buildConversationQuestion = messages
                                        .map((message) => {
                                            const createdDate = message.chunk.createdDate
                                                ? new Date(message.chunk.createdDate * 1000)
                                                : new Date();
                                            const dateString = `${createdDate.toLocaleDateString()} ${createdDate.toLocaleTimeString()}`;

                                            return `[userId: ${message.chunk.userId} | textMessage: ${message.chunk.textMessage} | createdDate: ${dateString}]\n`;
                                        })
                                        .join('');

                                    rsocketLogger.info(`RequestStream received: ${messages}`);
                                    fetch(`http://localhost:3010/api/v1/rsocket-prediction/${chartflowId}`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ question: buildConversationQuestion, rsocketChatroomId: chatroomId })
                                    }).catch((error) => {
                                        rsocketLogger.error(`Error: ${error.message}`);
                                    });
                                } else {
                                    rsocketLogger.error('Payload data is undefined');
                                }
                            } else {
                                rsocketLogger.error(`No handler for route: ${routingMetadata}`);
                                return {
                                    cancel: () => {},
                                    request: (_n) => {},
                                    onExtension: () => {}
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
                                onExtension: () => {}
                            };
                        },
                        requestResponse: (
                            payload,
                            responderStream
                        ) => {
                            responderStream.onNext({ data: Buffer.from('Hello from server') }, true);
                            responderStream.onComplete(); // Complete the stream
                            return {
                                cancel: () => {
                                    // Implement cancel logic here
                                },
                                onExtension: () => {
                                    // Implement onExtension logic here
                                }
                            };
                        }
                    };
                }
            }
        });
        this.connections = new Map();
    }

    async start() {
        try {
            this.closeable = await this.rsocket.bind();
            rsocketLogger.info(`RSocket Source is being initialized!`);
            rsocketLogger.info(`Server listening on port ${process.env.RSOCKET_PORT || 3060}`);
            return this.rsocket;
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