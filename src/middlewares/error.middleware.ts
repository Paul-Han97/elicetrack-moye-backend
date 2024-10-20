import { NextFunction, Request, Response } from 'express';
import { errorName } from '../utils/message.util';

const messageMap = new Map<string, number>();

// Successful responses
messageMap.set(errorName.OK, 200);
messageMap.set(errorName.CREATED, 201);
messageMap.set(errorName.ACCEPTED, 202);
messageMap.set(errorName.NO_CONTENT, 204);

// Client error responses
messageMap.set(errorName.BAD_REQUEST, 400);
messageMap.set(errorName.UNAUTHORIZED, 401);
messageMap.set(errorName.FORBIDDEN, 403);
messageMap.set(errorName.NOT_FOUND, 404);
messageMap.set(errorName.UNSUPPORTED_MEDIA_TYPE, 415);

// Server error responses
messageMap.set(errorName.INTERNAL_SERVER_ERROR, 500);
messageMap.set(errorName.HTTP_VERSION_NOT_SUPPORTED, 505);

export function errorHandler(
  e: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const error = e.name;
  const message = e.message;
  const isOperational = e.isOperational;
  const statusCode = messageMap.get(error) ?? 500;
  
  if (!isOperational || statusCode === 500) {
    console.error(e.message);
    console.error(e.stack);
  }

  const result = {
    error,
    message,
  };

  res.status(statusCode).send(result);
}

export class AppError extends Error {
  public readonly name: string;
  public readonly message: string;
  public readonly isOperational: boolean;

  constructor(name: string, message: string, isOperational: boolean) {
    super(message);

    this.name = name;
    this.message = message;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}
