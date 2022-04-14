import { NextFunction, Request, Response } from 'express';

import { UniqueUserUseCase } from './UniqueUserUseCase';

class UniqueUserController {
  constructor(private uniqueUserUseCase: UniqueUserUseCase) {}

  handle = async (request: Request, response: Response, next: NextFunction) => {
    const { email } = request.body;

    try {
      await this.uniqueUserUseCase.execute(email);

      next();
    } catch (err) {
      next(err);
    }
  };
}

export { UniqueUserController };
