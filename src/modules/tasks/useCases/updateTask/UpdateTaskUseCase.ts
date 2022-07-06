import { StatusCodes } from "http-status-codes";

import type { ITasksRepository } from "../../../../@types/interfaces";
import type {
  TaskUpdateAttributes,
  TaskReturn,
  SuccessCase,
} from "../../../../@types/types";
import { IsTaskExists } from "../../decorators/TaskExists.decorator";

class UpdateTaskUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  @IsTaskExists()
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
