import { ITasksRepository } from '../../repository/ITasksRepository';
import { ISuccess } from '../../../../@types/interfaces';

import { NotFoundError } from '../../../../utils/Errors';

class DeleteTaskUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async taskExists(userId: string, id: string): Promise<void> {
    const foundTask = await this.tasksRepository.findById({ userId, id });

    if (!foundTask) {
      throw new NotFoundError('Task not found');
    }
  }

  async execute(userId: string, id: string): Promise<ISuccess<null>> {
    await this.taskExists(userId, id);

    await this.tasksRepository.delete({ userId, id });

    return {
      statusCode: 'DELETED',
      data: null,
    };
  }
}

export { DeleteTaskUseCase };
