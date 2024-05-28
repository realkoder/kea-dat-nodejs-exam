import {
  APIError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ServerError,
  StorageError,
  ValidationError,
} from './CustomErrorClasses.js';

class ErrorFactory {
  constructor() {
    this.errorTypes = new Map();
  }

  registerError(type, errorClass) {
    this.errorTypes.set(type, errorClass);
  }

  createError(type, message, originalError) {
    const ErrorClass = this.errorTypes.get(type);
    if (!ErrorClass) {
      throw new Error(`Error type "${type}" is not registered.`);
    }
    return new ErrorClass(originalError, message);
  }
}

const errorFactory = new ErrorFactory();
errorFactory.registerError('NotFoundError', NotFoundError);
errorFactory.registerError('ValidationError', ValidationError);
errorFactory.registerError('AuthenticationError', AuthenticationError);
errorFactory.registerError('AuthorizationError', AuthorizationError);
errorFactory.registerError('ServerError', ServerError);
errorFactory.registerError('StorageError', StorageError);
errorFactory.registerError('APIError', APIError);

export default errorFactory;
