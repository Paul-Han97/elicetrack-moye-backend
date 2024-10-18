import { NextFunction, Request, Response } from 'express';
import { IGenerate, IVerify } from '../interfaces/token.interface';
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
    const access = req.cookies.Access;
    const refresh = req.cookies.Refresh;

    if (!access || !refresh) {
      const msg = `${statusMessage.BAD_REQUEST}+${serverMessage.E001}`;
      throw new Error(msg);
    }

    const verifyDto: IVerify = {
      type: Token.ACCESS,
      token: access,
    };

    const decodedAccess = Token.verify(verifyDto);

    if (decodedAccess.isValid) {
      const { id, role } = decodedAccess;
      res.locals.user = { id, role };
      next();
      return;
    }

    // refresh 인증 이후 access 발급 로직
    verifyDto.type = Token.REFRESH;
    verifyDto.token = refresh;

    const decodedRefresh = Token.verify(verifyDto);

    const generateDto: IGenerate = {
      type: Token.REFRESH,
      id: decodedRefresh.id,
      role: decodedRefresh.role,
    };

    const newAccess = Token.generate(generateDto);

    const { id, role } = decodedRefresh;
    res.locals.user = { id, role };

    res.cookie(Token.ACCESS, newAccess);
    next();
  } catch (e) {
    next(e);
  }
}
