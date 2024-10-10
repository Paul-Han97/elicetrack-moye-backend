import { NextFunction, Response } from 'express';
import { IVerify } from '../interface/token.interface';
import { serverMessage, statusMessage } from '../utils/message.util';
import { Token } from '../utils/token.util';

export async function auth(req: any, res: Response, next: NextFunction) {
  try {
    const authorization = req.headers.authorization;

    const verifyParam: IVerify = {
      type: Token.ACCESS,
      authorization,
    };

    const decoded = Token.verify(verifyParam);

    if (!decoded) {
      const message = `${statusMessage.UNAUTHORIZED}+${serverMessage.E002}`;
      throw new Error(message);
    }

    const { id, role } = decoded;

    req.user = { id, role };

    next();
  } catch (e) {
    next(e);
  }
}
