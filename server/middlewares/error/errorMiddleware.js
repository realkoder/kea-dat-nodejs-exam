import { StatusCodes } from 'http-status-codes';
import { ApiError } from './ApiError.js';

async function errorHandlerMiddleware(err, req, res, next) {
  // Check if the error is an instance of ApiError (Since we want to call AI models with different API-Keys)
  if (err instanceof ApiError) {
    const displayedError = {
      statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: err.message,
      // Provide error stack trace only in development
      stack: process.env.NODE_ENV === 'development' ? err.stack : {},
    };
    res.setHeader('Content-Type', 'application/json');
    return res.status(displayedError.statusCode).json(displayedError);
  }

  // If the error is not an instance of ApiError, proceed with generic error handling
  next(err);
}

export default errorHandlerMiddleware;
