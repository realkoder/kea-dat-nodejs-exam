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

function connect(wsUrl) {
  const client = new RSocketClient({
    setup: {
      keepAlive: 1000000, // avoid sending during test
      lifetime: 100000,
      dataMimeType: APPLICATION_JSON.string,
      metadataMimeType: MESSAGE_RSOCKET_COMPOSITE_METADATA.string,
    },
    transport: new RSocketWebSocketClient(
      { url: wsUrl, debug: true },
      BufferEncoders,
    ),
  });
  return client.connect();
}

export async function initRSocket() {
  return await connect('ws://localhost:8085/rsocket');
}

export function requestResponse(rsocket, routing, data) {
  return new Promise((resolve, reject) => {
    rsocket
      .requestResponse({
        data: convertToBuffer(data),
        metadata: encodeAndAddWellKnownMetadata(
          Buffer.alloc(0),
          MESSAGE_RSOCKET_ROUTING,
          Buffer.from(String.fromCharCode(routing.length) + routing),
        ),
      })
      .subscribe({
        onComplete: (payload) => {
          resolve(payload.data);
        },
        onError: (error) => {
          reject(error);
        },
      });
  });
}

export function fireAndForget(rsocket, routing, data) {
  rsocket.fireAndForget({
    data: convertToBuffer(data),
    metadata: encodeAndAddWellKnownMetadata(
      Buffer.alloc(0),
      MESSAGE_RSOCKET_ROUTING,
      Buffer.from(String.fromCharCode(routing.length) + routing),
    ),
  });
}

export function requestStream(rsocket, routing, data) {  
  return new Observable((observer) => {
    rsocket
      .requestStream({
        data: convertToBuffer(data),
        metadata: encodeAndAddWellKnownMetadata(
          Buffer.alloc(0),
          MESSAGE_RSOCKET_ROUTING,
          Buffer.from(String.fromCharCode(routing.length) + routing),
        ),
      })
      .subscribe({
        onComplete: () => observer.complete(),
        onError: (error) => observer.error(error),
        onNext: (payload) => observer.next(payload.data),
      });
  });
}

function convertToBuffer(data) {
  if (data === null) {
    return null;
  } else if (Buffer.isBuffer(data)) {
    return data;
  } else if (typeof data === 'string' || data instanceof String) {
    return Buffer.from(data);
  } else {
    return Buffer.from(JSON.stringify(data));
  }
}
