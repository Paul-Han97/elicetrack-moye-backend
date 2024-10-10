import jwt from 'jsonwebtoken';
import config from '../config';
import { IGenerate, IVerify } from '../interface/token.interface';
import { serverMessage, statusMessage } from './message.util';

export class Token {
  static #key = config.jwt.key;
  static BEARER = 'Bearer';
  static ACCESS = 'Access';
  static REFRESH = 'Refresh';

  static generate({ type, id, role }: IGenerate) {
    const payload = {
      id,
      role,
      exp: Math.floor(Date.now() / 1000) + 60 * 30,
      jti: this.ACCESS,
    };

    if (type === this.REFRESH) {
      payload.exp = Math.floor(Date.now() / 1000) + 60 * 60;
      payload.jti = this.REFRESH;
    }

    return jwt.sign(payload, this.#key!);
  }

  static #decode(token: string) {
    let decoded: any;

    try {
      decoded = jwt.verify(token, this.#key!);
    } catch (e) {
      return false;
    }

    return decoded;
  }

  static verify({ type, authorization }: IVerify) {
    if (!authorization) {
      const msg = `${statusMessage.UNAUTHORIZED}+${serverMessage.E002}`
      throw new Error(msg)
    }

    const [tokenType, credential] = authorization.split(' ');

    if (tokenType !== Token.BEARER) {
      const msg = `${statusMessage.UNAUTHORIZED}+${serverMessage.E002}`
      throw new Error(msg)
    }

    const decoded = this.#decode(credential);

    const isValid = decoded
                 && decoded.id
                 && decoded.exp
                 && decoded.jti === type
                 && decoded.role;

    if (!isValid) {
      const msg = `${statusMessage.UNAUTHORIZED}+${serverMessage.E002}`
      throw new Error(msg)
    }

    return decoded;
  }
}
