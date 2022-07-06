import { StatusCodes } from "http-status-codes";

import type { ITasksRepository } from "@projectTypes/interfaces";
import type { TaskIdentifierById, SuccessCase } from "@projectTypes/types";

import { IsTaskValid, IsTaskExists } from "../../decorators";

class DeleteTaskUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  @IsTaskValid(IsTaskExists)
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
