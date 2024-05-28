class CustomError extends Error {
  constructor(originalError, message) {
    super(message);
    this.name = this.constructor.name;
    this.originalError = originalError;
  }

  handle() {
    throw new Error(
      `${this.name}: ${this.message}\nOriginal Error: ${this.originalError.message}`,
    );
  }
}

class StorageError extends CustomError {
  handle() {
    throw new Error(
      `Storage Error: ${this.message}\nOriginal Error: ${this.originalError.message}`,
    );
  }
}

class NotFoundError extends CustomError {
  handle() {
    throw new Error(
      `Not Found Error: ${this.message}\nOriginal Error: ${this.originalError.message}`,
    );
  }
}

class ValidationError extends CustomError {
  handle() {
    throw new Error(
      `Validation Error: ${this.message}\nOriginal Error: ${this.originalError.message}`,
    );
  }
}

class AuthenticationError extends CustomError {
  handle() {
    throw new Error(
      `Authentication Error: ${this.message}\nOriginal Error: ${this.originalError.message}`,
    );
  }
}

class AuthorizationError extends CustomError {
  handle() {
    throw new Error(
      `Authorization Error: ${this.message}\nOriginal Error: ${this.originalError.message}`,
    );
  }
}

class APIError extends CustomError {
  handle() {
    throw new Error(
      `API Error: ${this.message}\nOriginal Error: ${this.originalError.message}`,
    );
  }
}

class ServerError extends CustomError {
  handle() {
    throw new Error(
      `Server Error: ${this.message}\nOriginal Error: ${this.originalError.message}`,
    );
  }
}

export {
  CustomError,
  StorageError,
  NotFoundError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  APIError,
  ServerError,
};
