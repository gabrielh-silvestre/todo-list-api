import { StatusCodes } from 'http-status-codes';
import { NotFoundError } from 'restify-errors';

import type { ITasksRepository } from '../../repository/ITasksRepository';
import type { TaskIdentifierById, SuccessCase } from '../../../../@types/types';

class DeleteTaskUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  private async taskExists(userId: string, id: string): Promise<void | never> {
    const foundTask = await this.tasksRepository.findById({ userId, id });

    if (!foundTask) {
      throw new NotFoundError('Task not found');
    }
  }

  async execute({
    userId,
    id,
  }: TaskIdentifierById): Promise<SuccessCase<null> | never> {
    await this.taskExists(userId, id);

    await this.tasksRepository.delete({ userId, id });

    return {
      statusCode: StatusCodes.NO_CONTENT,
      data: null,
    };
  }
}

export { DeleteTaskUseCase };
