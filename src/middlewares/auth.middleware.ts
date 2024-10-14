import { NextFunction, Request, Response } from 'express';
import { IVerify } from '../interfaces/token.interface';
import { serverMessage, statusMessage } from '../utils/message.util';
import { Token } from '../utils/token.util';

export async function auth(
  req: Request,
  res: Response<
    { error: string | null; data: Record<string, string> },
    { user: { id: number; role: string } }
  >,
  next: NextFunction
) {
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

    res.locals.user = { id, role };

    next();
  } catch (e) {
    next(e);
  }
}
