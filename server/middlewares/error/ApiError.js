export class ApiError extends Error {
  statusCode = null;
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    // capture the stack trace of the error from anywhere in the application
    Error.captureStackTrace(this, this.constructor);
  }
}
