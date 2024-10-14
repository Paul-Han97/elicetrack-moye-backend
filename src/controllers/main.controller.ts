import { NextFunction, Request, Response } from 'express';
import { IGenerate, IVerify } from '../interfaces/token.interface';
import { userService } from '../services/user.service';
import { Token } from '../utils/token.util';

class MainController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const result = await userService.loadUserByEmail(email, password);

      res.status(200).send({ body: result });
    } catch (e) {
      next(e);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const authorization = req.headers.authorization;

      const header: IVerify = {
        type: Token.REFRESH,
        authorization,
      };

      const decoded = Token.verify(header);

      const payload: IGenerate = {
        type: Token.ACCESS,
        id: decoded.id,
        role: decoded.role,
      };

      const result = Token.generate(payload);

      res.status(200).send({ body: result });
    } catch (e) {
      next(e);
    }
  }
}

export const mainController = new MainController();
