import type { ITaskRepository } from "@domain/task/repository/Task.repository.interface";
import type {
  SuccessCase,
  TaskCreateAttributes,
  TaskReturn,
} from "@projectTypes/types";

import { StatusCodes } from "http-status-codes";
import { ConflictError } from "restify-errors";

import { TaskFactory } from "@domain/task/factory/Task.factory";

class CreateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  private async isTaskUnique(
    userId: string,
    title: string
  ): Promise<void | never> {
    const task = await this.taskRepository.findByTitle(userId, title);

    if (task) {
      throw new ConflictError("Task with this title already exists");
    }
  }

  async execute({
    title,
    description,
    userId,
  }: TaskCreateAttributes): Promise<SuccessCase<TaskReturn> | never> {
    await this.isTaskUnique(userId, title);

    const newTask = description
      ? TaskFactory.createWithDescription(title, description, userId)
      : TaskFactory.create(title, userId);

    await this.taskRepository.create(newTask);

    return {
      statusCode: StatusCodes.CREATED,
      data: {
        id: newTask.id,
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
        updatedAt: newTask.updatedAt,
      },
    };
  }
}

export { CreateTaskUseCase };
