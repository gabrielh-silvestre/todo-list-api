import { StatusCodes } from "http-status-codes";

import type { ITasksRepository } from "../../../../@types/interfaces";
import type { TaskIdentifierById, SuccessCase } from "../../../../@types/types";

import { IsTaskExists } from "../../decorators/TaskExists.decorator";

class DeleteTaskUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  @IsTaskExists()
  async execute({
    userId,
    id,
  }: TaskIdentifierById): Promise<SuccessCase<null> | never> {
    await this.tasksRepository.delete({ userId, id });

    return {
      statusCode: StatusCodes.NO_CONTENT,
      data: null,
    };
  }
}

export { DeleteTaskUseCase };
