import { StatusCodes } from "http-status-codes";

import type { ITasksRepository } from "@projectTypes/interfaces";
import type {
  TaskReturn,
  SuccessCase,
  TaskIdentifierByUser,
} from "@projectTypes/types";

class GetAllTasksUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async execute({
    userId,
  }: TaskIdentifierByUser): Promise<SuccessCase<TaskReturn[]>> {
    const foundTasks = await this.tasksRepository.findAll({ userId });

    return {
      statusCode: StatusCodes.OK,
      data: foundTasks,
    };
  }
}

export { GetAllTasksUseCase };
