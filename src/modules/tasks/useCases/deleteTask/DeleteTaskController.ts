import type { Handler, NextFunction, Request, Response } from 'express';

import type { DeleteTaskUseCase } from './DeleteTaskUseCase';

class DeleteTaskController {
  constructor(private deleteTaskUseCase: DeleteTaskUseCase) {}

  handle: Handler = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { userId } = req.body;

    try {
      const { statusCode } = await this.deleteTaskUseCase.execute({
        userId,
        id,
      });

      return res.status(statusCode).end();
    } catch (err) {
      next(err);
    }
  };
}

export { DeleteTaskController };
