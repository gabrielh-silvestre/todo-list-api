import type { TaskIdentifierById, SuccessCase } from "@projectTypes/types";

import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "restify-errors";

import type { ITaskRepository } from "@domain/task/repository/Task.repository.interface";

class DeleteTaskUseCase {
  constructor(private tasksRepository: ITaskRepository) {}

  private async taskExists(userId: string, id: string): Promise<void | never> {
    const task = await this.tasksRepository.find(userId, id);

    if (!task) {
      throw new NotFoundError("Task not found");
    }
  }

  async execute({
    userId,
    id,
  }: TaskIdentifierById): Promise<SuccessCase<null> | never> {
    await this.taskExists(userId, id);
    await this.tasksRepository.delete(userId, id);

    return {
      statusCode: StatusCodes.NO_CONTENT,
      data: null,
    };
  }
}

export { DeleteTaskUseCase };
