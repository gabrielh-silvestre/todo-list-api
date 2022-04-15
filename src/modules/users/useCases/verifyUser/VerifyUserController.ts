import { NextFunction, Request, Response } from 'express';
import { VerifyUserUseCase } from './VerifyUserUseUseCase';

class VerifyUserController {
  constructor(private verifyUserUseCase: VerifyUserUseCase) {}

  handle = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.body;

    try {
      await this.verifyUserUseCase.execute(userId);

      return next();
    } catch (err) {
      next(err);
    }
  };
}

export { VerifyUserController };
