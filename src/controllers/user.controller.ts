import { NextFunction, Response } from 'express';
import { userService } from '../services/user.service';

class UserController {
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
