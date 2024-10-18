import { NextFunction, Request, Response } from 'express';
import { COOKIE_MAX_AGE } from '../constants';
import { userService } from '../services/user.service';
import { serverMessage } from '../utils/message.util';
import { Token } from '../utils/token.util';

class MainController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const { access, refresh } = await userService.loadUserByEmail(
        email,
        password
      );

      res.cookie(Token.ACCESS, access, {
        httpOnly: true,
        maxAge: COOKIE_MAX_AGE,
      });

      res.cookie(Token.REFRESH, refresh, {
        httpOnly: true,
        maxAge: COOKIE_MAX_AGE,
      });

      res.status(200).send({ body: serverMessage.S004 });
    } catch (e) {
      next(e);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie(Token.ACCESS);
      res.clearCookie(Token.REFRESH);

      res.status(200).send({ body: serverMessage.S005 });
    } catch (e) {
      next(e);
    }
  }
}

export const mainController = new MainController();
