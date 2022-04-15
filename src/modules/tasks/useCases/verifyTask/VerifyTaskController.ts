import { NextFunction, Request, Response } from 'express';

import { VerifyTaskUseCase } from './VerifyTaskUseCase';

class VerifyTaskController {
  constructor(private verifyTaskUseCase: VerifyTaskUseCase) {}

  handle = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { userId } = req.body;

    try {
      await this.verifyTaskUseCase.execute(userId, id);
      next();
    } catch (err) {
      next(err);
    }
  };
}

export { VerifyTaskController };
