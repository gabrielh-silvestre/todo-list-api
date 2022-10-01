import type { ITaskRepository } from "@domain/task/repository/Task.repository.interface";
import type {
  TaskUpdateAttributes,
  TaskReturn,
  SuccessCase,
} from "@projectTypes/types";

import { StatusCodes } from "http-status-codes";
import { ConflictError, NotFoundError } from "restify-errors";

class UpdateTaskUseCase {
  constructor(private tasksRepository: ITaskRepository) {}

  private async taskExists(userId: string, id: string): Promise<void | never> {
    const task = await this.tasksRepository.find(userId, id);

    if (!task) {
      throw new NotFoundError("Task not found");
    }
  }

  private async isTaskUnique(
    userId: string,
    id: string,
    title: string
  ): Promise<void | never> {
    const foundTaskById = await this.tasksRepository.find(userId, id);
    const foundTaskByTitle = await this.tasksRepository.findByTitle(
      userId,
      title
    );

    const isTheSameTask = foundTaskById?.id === foundTaskByTitle?.id;

    if (foundTaskByTitle && !isTheSameTask) {
      throw new ConflictError("Task with this title already exists");
    }
  }

  async execute(
    taskData: TaskUpdateAttributes
  ): Promise<SuccessCase<TaskReturn> | never> {
    await this.taskExists(taskData.userId, taskData.id);
    await this.isTaskUnique(taskData.userId, taskData.id, taskData.title);

    const task = await this.tasksRepository.find(taskData.userId, taskData.id);

    task!.changeTitle(taskData.title);
    task!.changeDescription(taskData.description || "");
    task!.changeStatus(taskData.status);

    await this.tasksRepository.update(task!);

    return {
      statusCode: StatusCodes.OK,
      data: {
        id: task!.id,
        title: task!.title,
        description: task!.description,
        status: task!.status,
        updatedAt: task!.updatedAt,
      },
    };
  }
}

export { UpdateTaskUseCase };
