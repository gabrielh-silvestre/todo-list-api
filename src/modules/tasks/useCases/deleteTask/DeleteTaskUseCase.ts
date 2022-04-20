import { ITasksRepository } from '../../repository/ITasksRepository';
import { ISuccess } from '../../../../@types/interfaces';

import { InternalError } from '../../../../utils/Errors';

class DeleteTaskUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async execute(userId: string, id: string): Promise<ISuccess<null>> {
    try {
      await this.tasksRepository.delete(userId, id);
    } catch (err) {
      throw new InternalError('Unexpected error while deleting task', err);
    }

    return {
      statusCode: 'DELETED',
      data: null,
    };
  }
}

export { DeleteTaskUseCase };
