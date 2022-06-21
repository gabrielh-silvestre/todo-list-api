import type { Request, Response, NextFunction, Handler } from 'express';

import type { CreateUserUseCase } from './CreateUserUseCase';

class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  handle: Handler = async (req: Request, res: Response, next: NextFunction) => {
    const { email, username, password } = req.body;

    try {
      const { statusCode, data } = await this.createUserUseCase.execute({
        email,
        username,
        password,
      });

      return res.status(statusCode).json(data);
    } catch (err) {
      next(err);
    }
  };
}

export { CreateUserController };
