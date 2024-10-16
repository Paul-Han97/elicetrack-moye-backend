import { NextFunction, Request, Response } from 'express';
import { userService } from '../services/user.service';
import { IUser } from '../interfaces/user.interface';

class UserController {
  async findByEmail(
    req: Request<{}, {}, {}, { email: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email } = req.query;

      const result = await userService.findByEmail(email);

      res.status(200).send({ body: result });
    } catch (e) {
      next(e);
    }
  }

  async findByIdWithRole(
    req: Request<{ id: number }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const result = await userService.findByIdWithRole(id);

      res.status(200).send({ body: result });
    } catch (e) {
      next(e);
    }
  }

  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const userDto: IUser = req.body;

      const result = await userService.signup(userDto);

      res.status(201).send({ body: result });
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
