// RSOCKET
import { WellKnownMimeType } from 'rsocket-composite-metadata';

import { RSocketConnector } from 'rsocket-core';
import { WebsocketClientTransport } from 'rsocket-websocket-client';

//UUID
import { v4 as uuidv4 } from 'uuid';
import { createRoute } from './rsocketUtil';

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
        tokenGenerator: () => {
          return Buffer.from(uuidv4().toString());
        },
        reconnectFunction: (attempt) => {
          let delay = Math.pow(2, attempt) * 1000; // Exponential backoff starting from 1 second
          delay = Math.min(delay, 60000); // Cap the delay to 1 minute (60000 milliseconds)
          return new Promise((resolve) => {
            setTimeout(resolve, delay);
          });
        },
      },
    });

    return await client.connect();
  }

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

  fireAndForget = async (route, data) => {
    return new Promise((resolve, reject) => {
      this.rsocketConnection.fireAndForget(
        {
          data: Buffer.from(JSON.stringify(data)),
          metadata: createRoute(route),
        },
        {
          onError: (e) => reject(e),
          onComplete: () => {
            resolve(null);
          },
        },
      );
    });
  };

  fireAndForgetCloseConnection = async (route, data) => {
    return new Promise((resolve, reject) => {
      this.rsocketConnection.fireAndForget(
        {
          data: Buffer.from(JSON.stringify(data)),
          metadata: createRoute(route),
        },
        {
          onError: (e) => reject(e),
          onComplete: () => {
            resolve(null);
          },
        },
      );
    });
  };

  requestStream = async (route, data, setChatMessages, removeChatMessage) => {
    return new Promise((resolve, reject) => {
      if (!this.rsocketConnection) return;

      const connector = this.rsocketConnection.requestStream(
        {
          data: Buffer.from(JSON.stringify(data)),
          metadata: createRoute(route),
        },
        2147483647,
        {
          onError: (error) => {
            console.error('Error in chatroom stream connection', error);
            reject(error);
          },
          onNext: async (payload, isComplete) => {
            const data = payload.data
              ? { ...JSON.parse(payload.data).data }
              : undefined;

            console.log(payload);

            if (data?.chunk?.textMessage === 'Gpt Finished message') {
              return;
            }
            if (data.deleteMessageId) {
              removeChatMessage(data.deleteMessageId);
            } else {
              setChatMessages(data);
            }
          },
          onComplete: () => {
            resolve(connector);
          },
          onExtension: () => {},
        },
      );
      connector.request(2147483647);
      resolve(connector);
    });
  };
}

export { CustomRSocket };
