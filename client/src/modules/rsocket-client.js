// import {
//   RSocketClient,
//   BufferEncoders,
//   encodeAndAddWellKnownMetadata,
//   MESSAGE_RSOCKET_COMPOSITE_METADATA,
//   APPLICATION_JSON,
//   MESSAGE_RSOCKET_ROUTING,
// } from 'rsocket-core';

// import {
//   WellKnownMimeType,
//   encodeCompositeMetadata,
//   encodeRoute,
// } from 'rsocket-composite-metadata';

// import RSocketWebSocketClient from 'rsocket-websocket-client';
// import { Observable } from 'rxjs';

// function connect(wsUrl) {
//   const client = new RSocketClient({
//     setup: {
//       keepAlive: 1000000, // avoid sending during test
//       lifetime: 100000,
//       dataMimeType: APPLICATION_JSON.string,
//       metadataMimeType: MESSAGE_RSOCKET_COMPOSITE_METADATA.string,
//     },
//     transport: new RSocketWebSocketClient(
//       { url: wsUrl, debug: true },
//       BufferEncoders,
//     ),
//   });
//   return client.connect();
// }

// export async function initRSocket() {
//   return await connect('ws://localhost:8085/rsocket');
// }

// export function requestResponse(rsocket, routing, data) {
//   return new Promise((resolve, reject) => {
//     rsocket
//       .requestResponse({
//         data: convertToBuffer(data),
//         metadata: encodeAndAddWellKnownMetadata(
//           Buffer.alloc(0),
//           MESSAGE_RSOCKET_ROUTING,
//           Buffer.from(String.fromCharCode(routing.length) + routing),
//         ),
//       })
//       .subscribe({
//         onComplete: (payload) => {
//           resolve(payload.data);
//         },
//         onError: (error) => {
//           reject(error);
//         },
//       });
//   });
// }

// export function fireAndForget(rsocket, routing, data) {
//   rsocket.fireAndForget({
//     data: convertToBuffer(data),
//     metadata: encodeAndAddWellKnownMetadata(
//       Buffer.alloc(0),
//       MESSAGE_RSOCKET_ROUTING,
//       Buffer.from(String.fromCharCode(routing.length) + routing),
//     ),
//   });
// }

// // export async function requestStream(rsocket, routing, data) {
// //   return new Observable(observer => {
// //           rsocket.requestStream({
// //             data: convertToBuffer(data),
// //                     metadata: encodeAndAddWellKnownMetadata(
// //                       Buffer.alloc(0),
// //                       MESSAGE_RSOCKET_ROUTING,
// //                       Buffer.from(String.fromCharCode(routing.length) + routing),
// //                     ),
// //                   },
// //                   2147483647
// //           ).subscribe({
// //               onComplete: () => observer.complete(),
// //               onError: error => observer.error(error),
// //               onNext: payload => observer.next(payload.data)
// //           });
// //       });
// // }

// export function requestStream(rsocket, routing, data) {
//   return new Promise((resolve, reject) => {
//     const connector = rsocket.requestStream(
//       {
//         data: Buffer.from(data),
//         metadata: createRoute(routing),
//       },
//       2147483647,
//       {
//         onError: (error) => {
//           console.error('Error in chatroom stream connection', error);
//           reject(error);
//         },
//         onNext: async (payload, isComplete) => {
//           console.log(payload);
//         },
//         onComplete: () => {
//           resolve();
//         },
//         onExtension: () => {},
//       },
//     );
//     connector.request(2147483647);
//     resolve(connector);
//   });
// }

// function createRoute(route) {
//   let compositeMetaData = undefined;
//   if (route) {
//       const encodedRoute = encodeRoute(route);

//       const map = new Map();
//       map.set(MESSAGE_RSOCKET_ROUTING, encodedRoute);
//       compositeMetaData = encodeCompositeMetadata(map);
//   }
//   return compositeMetaData;
// };

// // export function requestStream(rsocket, routing, data) {

// //   return new Observable((observer) => {
// //     rsocket
// //       .requestStream({
// //         data: convertToBuffer(data),
// //         metadata: encodeAndAddWellKnownMetadata(
// //           Buffer.alloc(0),
// //           MESSAGE_RSOCKET_ROUTING,
// //           Buffer.from(String.fromCharCode(routing.length) + routing),
// //         ),
// //       })
// //       .subscribe({
// //         onComplete: () => {
// //           console.log("completed")
// //           return observer.complete();
// //         },
// //         onError: (error) => {
// //           console.log('error');
// //           return observer.error(error);
// //         },
// //         onNext: (payload) => {
// //           console.log("nexting")
// //           return observer.next(payload.data)
// //         },
// //       });
// //   });
// // }

// function convertToBuffer(data) {
//   if (data === null) {
//     return null;
//   } else if (Buffer.isBuffer(data)) {
//     return data;
//   } else if (typeof data === 'string' || data instanceof String) {
//     return Buffer.from(data);
//   } else {
//     return Buffer.from(JSON.stringify(data));
//   }
// }
