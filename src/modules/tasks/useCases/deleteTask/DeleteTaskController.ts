import { NextFunction, Request, Response } from 'express';

import { DeleteTaskUseCase } from './DeleteTaskUseCase';

import { successStatusCode } from '../../../../utils/successCode';

class DeleteTaskController {
  constructor(private deleteTaskUseCase: DeleteTaskUseCase) {}

  handle = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { userId } = req.body;

    try {
      const { statusCode } = await this.deleteTaskUseCase.execute(userId, id);
      return res.status(successStatusCode[statusCode]).end();
    } catch (err) {
      next(err);
    }
  };
}

export { DeleteTaskController };
