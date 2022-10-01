import type { ITaskRepository } from "@domain/task/repository/Task.repository.interface";
import type {
  TaskReturn,
  SuccessCase,
  TaskIdentifierByUser,
} from "@projectTypes/types";

import { StatusCodes } from "http-status-codes";

class GetAllTasksUseCase {
  constructor(private tasksRepository: ITaskRepository) {}

  async execute({
    userId,
  }: TaskIdentifierByUser): Promise<SuccessCase<TaskReturn[]>> {
    const foundTasks = await this.tasksRepository.findAll(userId);

    return {
      statusCode: StatusCodes.OK,
      data: foundTasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        updatedAt: task.updatedAt,
      })),
    };
  }
}

export { GetAllTasksUseCase };
