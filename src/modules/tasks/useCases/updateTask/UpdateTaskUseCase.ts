import type { ITasksRepository } from "@projectTypes/interfaces";
import type {
  TaskUpdateAttributes,
  TaskReturn,
  SuccessCase,
} from "@projectTypes/types";
import { StatusCodes } from "http-status-codes";

import { IsTaskValid, IsTaskExists } from "../../decorators";

class UpdateTaskUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  @IsTaskValid(IsTaskExists)
  async execute(
    taskData: TaskUpdateAttributes
  ): Promise<SuccessCase<TaskReturn> | never> {
    const updatedTask = await this.tasksRepository.update(taskData);

    return {
      statusCode: StatusCodes.OK,
      data: updatedTask,
    };
  }
}

export { UpdateTaskUseCase };
