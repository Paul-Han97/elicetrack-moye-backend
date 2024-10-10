import { NextFunction, Response } from 'express';
import { userService } from '../services/user.service';

class UserController {
  async findByEmail(req: any, res: Response, next: NextFunction) {
    try {
      const { email } = req.query;
      
      const result = await userService.findByEmail(email);

      res.status(200).send({ body: result });
    } catch (e) {
      next(e);
    }
  }

  async findByIdWithRole(req: any, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const result = await userService.findByIdWithRole(id);

      res.status(200).send({ body: result });
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
