import type { Handler, NextFunction, Request, Response } from 'express';

import type { VerifyUserUseCase } from './VerifyUserUseUseCase';

class VerifyUserController {
  constructor(private verifyUserUseCase: VerifyUserUseCase) {}

  handle: Handler = async (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    const { userId: id } = req.body;

    try {
      await this.verifyUserUseCase.execute({ id });

      return next();
    } catch (err) {
      next(err);
    }
  };
}

export { VerifyUserController };
