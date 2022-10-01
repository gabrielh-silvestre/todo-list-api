import type { ITasksRepository } from "@projectTypes/interfaces";
import type {
  SuccessCase,
  TaskCreateAttributes,
  TaskReturn,
} from "@projectTypes/types";
import { StatusCodes } from "http-status-codes";
import { ConflictError } from "restify-errors";

class CreateTaskUseCase {
  constructor(private taskRepository: ITasksRepository) {}

  private async isTaskUnique(
    userId: string,
    title: string
  ): Promise<void | never> {
    const task = await this.taskRepository.findByExactTitle({ title, userId });

    if (task.length > 0) {
      throw new ConflictError("Task with this title already exists");
    }
  }

  async execute({
    title,
    description,
    userId,
  }: TaskCreateAttributes): Promise<SuccessCase<TaskReturn> | never> {
    await this.isTaskUnique(userId, title);

    const newTask = await this.taskRepository.create({
      title,
      description,
      userId,
    });

    return {
      statusCode: StatusCodes.CREATED,
      data: newTask,
    };
  }
}

export { CreateTaskUseCase };
