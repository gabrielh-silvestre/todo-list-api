import type { Handler, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import type { CreateTaskUseCase } from "./CreateTaskUseCase";

class CreateTaskController {
  constructor(private createTaskUseCase: CreateTaskUseCase) {}

  handle: Handler = async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, userId } = req.body;
    const newTask = { title, description: description || null, userId };

    try {
      const data = await this.createTaskUseCase.execute(newTask);

      res.status(StatusCodes.CREATED).json(data);
    } catch (err) {
      next(err);
    }
  };
}

export { CreateTaskController };
