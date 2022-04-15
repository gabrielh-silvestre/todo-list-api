import { NextFunction, Request, Response } from 'express';

import { UniqueTaskUseCase } from './UniqueTaskUseCase';

class UniqueTaskController {
  constructor(private uniqueTaskUseCase: UniqueTaskUseCase) {}

  handle = async (req: Request, _res: Response, next: NextFunction) => {
    const { title, userId } = req.body;

    try {
      await this.uniqueTaskUseCase.execute(userId, title);
      next();
    } catch (err) {
      next(err);
    }
  };
}

export { UniqueTaskController };
