import jwt from 'jsonwebtoken';
import config from '../config';
import { IGenerate, IDecodeJwt, IVerify } from '../interfaces/token.interface';
import { serverMessage, statusMessage } from './message.util';
import { COOKIE_MAX_AGE } from '../constants';

export class Token {
  private static key = config.jwt.key;
  public static BEARER = 'Bearer';
  public static ACCESS = 'Access';
  public static REFRESH = 'Refresh';

  // 60 * 60 = 1시간
  private static ACCESS_EXPIRED = 3600;
  private static REFRESH_EXPIRED = COOKIE_MAX_AGE;

  public static generate({ type, id, role }: IGenerate) {
    const payload = {
      id,
      role,
      exp: Math.floor(Date.now() / 1000) + this.ACCESS_EXPIRED,
      jti: this.ACCESS,
    };

    if (type === this.REFRESH) {
      payload.exp = Math.floor(Date.now() / 1000) + this.REFRESH_EXPIRED;
      payload.jti = this.REFRESH;
    }

    return jwt.sign(payload, this.key!);
  }

  private static decode(token: string): IDecodeJwt {
    let decoded = <IDecodeJwt>{};

    try {
      decoded = <IDecodeJwt>jwt.verify(token, this.key!);
      decoded.isValid = true;
    } catch (e) {
      decoded.isValid = false;
    }

    return decoded;
  }

  public static verify({ type, token }: IVerify): IDecodeJwt {
    const decoded = this.decode(token);

    if (type === this.REFRESH && !decoded.isValid) {
      const msg = `${statusMessage.UNAUTHORIZED}+${serverMessage.E002}`;
      throw new Error(msg);
    }

    return decoded;
  }
}
