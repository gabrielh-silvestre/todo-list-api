import { StatusCodes } from "http-status-codes";

import type { ITasksRepository } from "../../../../@types/interfaces";
import type {
  SuccessCase,
  TaskCreateAttributes,
  TaskReturn,
} from "../../../../@types/types";
import { IsTaskValid, IsTaskTitleUnique } from "../../decorators";

class CreateTaskUseCase {
  constructor(private taskRepository: ITasksRepository) {}

  @IsTaskValid(IsTaskTitleUnique)
  async execute({
    title,
    description,
    userId,
  }: TaskCreateAttributes): Promise<SuccessCase<TaskReturn> | never> {
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
