import { Request, Response, NextFunction } from 'express';

import { CreateUserUseCase } from './CreateUserUseCase';

class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  handle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
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
