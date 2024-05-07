// RSOCKET
import {
    RSocketClient,
    BufferEncoders,
    encodeAndAddWellKnownMetadata,
    MESSAGE_RSOCKET_COMPOSITE_METADATA,
    APPLICATION_JSON,
    MESSAGE_RSOCKET_ROUTING,
  } from 'rsocket-core';
  import RSocketWebSocketClient from 'rsocket-websocket-client';
  import { Observable } from 'rxjs';

class CustomRSocket {
    rsocketConnection;

    // Method to create a new RSocket client
    async getRSocketConnection() { 
        const connectorConnectionOptions = {
            url: 'ws://localhost:8085/rsocket',
        };

        const client = new RSocketConnector({
            setup: {
                metadataMimeType:
                    WellKnownMimeType.MESSAGE_RSOCKET_COMPOSITE_METADATA.string,
                dataMimeType: 'application/json', // Set the data MIME type for JSON
                lifetime: 1800000,
                keepAlive: 500,
            },
            transport: new WebsocketClientTransport(connectorConnectionOptions),
            fragmentation: {
                maxOutboundFragmentSize: 65536, // Set the maximum outbound fragment size
            },
            resume: {
                cacheSize: 65536, // Size of the cache for resuming, can be adjusted
                // tokenGenerator: () => {
                //     return Buffer.from(uuidv4().toString());
                // },
                tokenGenerator: () => {
                    const encoder = new TextEncoder();
                    const uint8Array = encoder.encode(uuidv4().toString());
                    return Buffer.from(uint8Array.buffer);
                },
                reconnectFunction: attempt => {
                    let delay = Math.pow(2, attempt) * 1000; // Exponential backoff starting from 1 second
                    delay = Math.min(delay, 60000); // Cap the delay to 1 minute (60000 milliseconds)
                    return new Promise(resolve => {
                        setTimeout(resolve, delay);
                    });
                },
            },
        });

        return await client.connect();
    }

    createRoute = (route) => {
        let compositeMetaData = undefined;
        if (route) {
            const encodedRoute = encodeRoute(route);

            const map = new Map();
            map.set(WellKnownMimeType.MESSAGE_RSOCKET_ROUTING, encodedRoute);
            compositeMetaData = encodeCompositeMetadata(map);
        }
        return compositeMetaData;
    };

    // Method to create a new instance of CustomRSocketClient
    static CreateAsync = async () => {
        const client = new CustomRSocket();
        client.rsocketConnection = await client.getRSocketConnection();
        return client;
    };

    close() {
        if (this.rsocketConnection) {
            this.rsocketConnection.close();
        }
    }

    requestOnlineStream = async (
        route,
        setOnlineUsers,
        userId
    ) => {
        return new Promise((resolve, reject) => {
            const connector = this.rsocketConnection.requestStream(
                {
                    data: Buffer.from(JSON.stringify(userId)),
                    metadata: this.createRoute(route),
                },
                2147483647,
                {
                    onError: reject,
                    onNext: async (payload, isComplete) => {
                        setOnlineUsers(curr => {
                            const newMessage = payload.data
                                ? JSON.parse(payload.data.toString())
                                : undefined;

                            if (!curr.includes(newMessage.chunk.userId)) {
                                return [...curr, newMessage.chunk.userId];
                            } else {
                                return curr;
                            }
                        });
                    },
                    onComplete: () => {
                        resolve(null);
                    },
                    onExtension: () => {},
                }
            );
            connector.request(2147483647);
        });
    };

    fireAndForgetMessage = async (route, chatMessage) => {
        return new Promise((resolve, reject) => {
            this.rsocketConnection.fireAndForget(
                {
                    data: Buffer.from(JSON.stringify(chatMessage)),
                    metadata: this.createRoute(route),
                },
                {
                    onError: e => reject(e),
                    onComplete: () => {
                        resolve(null);
                    },
                }
            );
        });
    };

    fireAndForgetStableDiffusionMessage = async (
        route,
        stableDiffusionRequest
    ) => {
        return new Promise((resolve, reject) => {
            this.rsocketConnection.fireAndForget(
                {
                    data: Buffer.from(JSON.stringify(stableDiffusionRequest)),
                    metadata: this.createRoute(route),
                },
                {
                    onError: e => reject(e),
                    onComplete: () => {
                        resolve(null);
                    },
                }
            );
        });
    };

    requestReponseSummary = async (
        route,
        summaryRequest
    ) => {
        return new Promise((resolve, reject) => {
            this.rsocketConnection.requestResponse(
                {
                    data: Buffer.from(JSON.stringify(summaryRequest)),
                    metadata: this.createRoute(route),
                },
                {
                    onError: e => reject(e),
                    onNext: payload => {
                        console.log(
                            'Response from AI:',
                            payload.data?.toString()
                        );
                        // Use resolve to return the data instead of return
                        resolve(
                            payload.data
                                ? (JSON.parse(
                                      payload.data.toString()
                                  ))
                                : null
                        );
                    },
                    onComplete: () => {
                        // If onComplete is called without onNext, resolve with null
                        resolve(null);
                    },
                    onExtension: () => {},
                }
            );
        });
    };

    fireAndForgetLeaveChatroom = async (route, userId) => {
        return new Promise((resolve, reject) => {
            this.rsocketConnection.fireAndForget(
                {
                    data: Buffer.from(userId),
                    metadata: this.createRoute(route),
                },
                {
                    onError: e => reject(e),
                    onComplete: () => {
                        resolve(null);
                    },
                }
            );
        });
    };

    requestChatStream = async (
        route,
        userId,        
    ) => {
        return new Promise((resolve, reject) => {
            if (!this.rsocketConnection) return;

            const connector = this.rsocketConnection.requestStream(
                {
                    data: Buffer.from(userId),
                    metadata: this.createRoute(route),
                },
                2147483647,
                {
                    onError: error => {
                        console.error(
                            'Error in chatroom stream connection',
                            error
                        );
                        reject(error);
                    },
                    onNext: async (payload, isComplete) => {
                        const newMessage = payload.data
                            ? { ...JSON.parse(payload.data.toString()) }
                            : undefined;

                        if (
                            newMessage?.chunk.textMessage ===
                            'Gpt Finished message'
                        ) {
                            return;
                        }

                    },
                    onComplete: () => {
                        resolve(connector);
                    },
                    onExtension: () => {},
                }
            );
            connector.request(2147483647);
            resolve(connector);
        });
    };

    leaveChatroom = async (route, userId) => {
        if (this.rsocketConnection) {
            await this.fireAndForgetLeaveChatroom(route, userId);
            this.rsocketConnection.close();
            this.rsocketConnection = null;
        }
    };
}

export { CustomRSocket };