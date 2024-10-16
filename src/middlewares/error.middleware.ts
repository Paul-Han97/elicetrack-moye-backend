import { NextFunction, Request, Response } from 'express';
import { statusMessage } from '../utils/message.util';

const messageMap = new Map<string, number>();

// Successful responses
messageMap.set(statusMessage.OK, 200);
messageMap.set(statusMessage.CREATED, 201);
messageMap.set(statusMessage.ACCEPTED, 202);
messageMap.set(statusMessage.NO_CONTENT, 204);

// Client error responses
messageMap.set(statusMessage.BAD_REQUEST, 400);
messageMap.set(statusMessage.UNAUTHORIZED, 401);
messageMap.set(statusMessage.FORBIDDEN, 403);
messageMap.set(statusMessage.NOT_FOUND, 404);

// Server error responses
messageMap.set(statusMessage.INTERNAL_SERVER_ERROR, 500);
messageMap.set(statusMessage.HTTP_VERSION_NOT_SUPPORTED, 505);

export function errorHandler(
  e: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const [statusMsg, errorMsg] = e.message.split('+');
  const statusCode = messageMap.get(statusMsg) ?? 500;

  if (statusCode === 500) {
    console.error(e.message);
    console.error(e.stack);
  }

  const status = {
    error: statusMsg,
    message: errorMsg,
  };

  res.status(statusCode).send(status);
}