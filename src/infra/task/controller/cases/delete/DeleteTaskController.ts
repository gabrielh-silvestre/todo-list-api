import type { Handler, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import type { DeleteTaskUseCase } from "@useCases/task/delete/DeleteTaskUseCase";

class DeleteTaskController {
  constructor(private deleteTaskUseCase: DeleteTaskUseCase) {}

  handle: Handler = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { userId } = req.body;

    try {
      await this.deleteTaskUseCase.execute({
        userId,
        id,
      });

      res.status(StatusCodes.NO_CONTENT).end();
    } catch (err) {
      next(err);
    }
  };
}

export { DeleteTaskController };
