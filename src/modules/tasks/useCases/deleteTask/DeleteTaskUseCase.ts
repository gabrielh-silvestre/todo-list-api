import { NotFoundError } from 'restify-errors';

import { ITasksRepository } from '../../repository/ITasksRepository';
import { ISuccess, ITaskIdentifierByUser } from '../../../../@types/interfaces';

interface IRequest extends ITaskIdentifierByUser {}

class DeleteTaskUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async taskExists(userId: string, id: string): Promise<void> {
    const foundTask = await this.tasksRepository.findById({ userId, id });

    if (!foundTask) {
      throw new NotFoundError('Task not found');
    }
  }

  async execute({ userId, id }: IRequest): Promise<ISuccess<null>> {
    await this.taskExists(userId, id);

    await this.tasksRepository.delete({ userId, id });

    return {
      statusCode: 'NO_CONTENT',
      data: null,
    };
  }
}

export { DeleteTaskUseCase };
