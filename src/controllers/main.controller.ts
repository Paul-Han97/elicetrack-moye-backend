import { NextFunction, Response } from 'express';
import { userService } from '../services/user.service';
import { Encrypt } from '../utils/encrypt.util';

class MainController {
  async login(req: any, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;

      const result = await userService.loadUserByUsername(username, password);

      res.status(200).send({ body: result });
    } catch (e) {
      next(e);
    }
  }
}

export const mainController = new MainController();
