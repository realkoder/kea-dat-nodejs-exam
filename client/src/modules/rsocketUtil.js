import {
  WellKnownMimeType,
  encodeCompositeMetadata,
  encodeRoute,
} from 'rsocket-composite-metadata';

export function createRoute(route) {
  let compositeMetaData = undefined;
  if (route) {
    const encodedRoute = encodeRoute(route);

    const map = new Map();
    map.set(WellKnownMimeType.MESSAGE_RSOCKET_ROUTING, encodedRoute);
    compositeMetaData = encodeCompositeMetadata(map);
  }
  return compositeMetaData;
}
