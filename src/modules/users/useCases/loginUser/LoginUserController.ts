import type { Handler, NextFunction, Request, Response } from 'express';

import type { LoginUserUseCase } from './LoginUserUseCase';

class LoginUserController {
  constructor(private loginUserUseCase: LoginUserUseCase) {}

  handle: Handler = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
      const { statusCode, data } = await this.loginUserUseCase.execute({
        email,
        password,
      });

      return res.status(statusCode).json(data);
    } catch (err) {
      next(err);
    }
  };
}

export { LoginUserController };
