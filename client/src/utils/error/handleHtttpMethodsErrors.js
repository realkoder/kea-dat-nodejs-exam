import errorFactory from './ErrorFactory.js';

export function handleFetchError(error) {
  if (error.message.includes('HTTP status')) {
    const status = parseInt(error.message.split(' ')[2], 10);

    switch (status) {
      case 400:
        throw errorFactory.createError(
          'ValidationError',
          'Validation failed',
          error,
        );
      case 401:
        throw errorFactory.createError(
          'AuthenticationError',
          'Authentication failed',
          error,
        );
      case 403:
        throw errorFactory.createError(
          'AuthorizationError',
          'Authorization failed',
          error,
        );
      case 404:
        throw errorFactory.createError('NotFoundError', 'Not found', error);
      case 500:
        throw errorFactory.createError(
          'ServerError',
          'Internal server error',
          error,
        );
      default:
        throw errorFactory.createError('APIError', 'API error', error);
    }
  } else {
    throw errorFactory.createError('APIError', 'Fetch error', error);
  }
}
