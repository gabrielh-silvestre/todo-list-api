import type { ITasksRepository } from "@projectTypes/interfaces";
import type {
  TaskUpdateAttributes,
  TaskReturn,
  SuccessCase,
} from "@projectTypes/types";
import { StatusCodes } from "http-status-codes";
import { ConflictError, NotFoundError } from "restify-errors";

class UpdateTaskUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  private async taskExists(userId: string, id: string): Promise<void | never> {
    const task = await this.tasksRepository.findById({ userId, id });

    if (!task) {
      throw new NotFoundError("Task not found");
    }
  }

  private async isTaskUnique(
    userId: string,
    id: string,
    title: string
  ): Promise<void | never> {
    const existingTask = await this.tasksRepository.findById({ userId, id });
    const [task] = await this.tasksRepository.findByExactTitle({ title, userId });

    if (task && task.id !== existingTask!.id) {
      throw new ConflictError("Task with this title already exists");
    }
  }

  async execute(
    taskData: TaskUpdateAttributes
  ): Promise<SuccessCase<TaskReturn> | never> {
    await this.taskExists(taskData.userId, taskData.id);
    await this.isTaskUnique(taskData.userId, taskData.id, taskData.title);

    const updatedTask = await this.tasksRepository.update(taskData);

    return {
      statusCode: StatusCodes.OK,
      data: updatedTask,
    };
  }
}

export { UpdateTaskUseCase };
