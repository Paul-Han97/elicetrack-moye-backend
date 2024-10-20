import { NextFunction, Request, Response } from 'express';
import { userService } from '../services/user.service';
import { IUser } from '../interfaces/user.interface';
import { serverMessage, errorName } from '../utils/message.util';
import { STATIC_PATH, USER_PATH } from '../constants';
import { fileUtil } from '../utils/file.util';
import { AppError } from '../middlewares/error.middleware';

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

  async updateImage(req: any, res: Response, next: NextFunction) {
    try {
      const files = req.files;

      if (files.length >= 2) {
        for (let i = 0; i < files.length; i++) {
          const dir = fileUtil.join(fileUtil.cwd, USER_PATH);
          const file = fileUtil.join(dir, files[i].filename);
          fileUtil.remove(file);

          throw new AppError(errorName.BAD_REQUEST, serverMessage.E001, true);
        }
      }

      if (files.length !== 1) {
        throw new AppError(errorName.BAD_REQUEST, serverMessage.E001, true);
      }

      const { id } = req.params;

      const userDto = {
        id,
        imageUrl: files[0].filename
      }

      const result = await userService.deleteAndInsertImage(<IUser>userDto);

      res.status(201).send({ body: result });
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
