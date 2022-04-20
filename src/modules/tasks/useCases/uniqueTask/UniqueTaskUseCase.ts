import { ITasksRepository } from '../../repository/ITasksRepository';
import { ISuccess } from '../../../../@types/interfaces';
import { TaskReturn } from '../../../../@types/types';

import { ConflictError, InternalError } from '../../../../utils/Errors';

class UniqueTaskUseCase {
  constructor(private taskRepository: ITasksRepository) {}

  async execute(userId: string, title: string): Promise<ISuccess<null> | void> {
    let findedTasks: TaskReturn[] = [];

    try {
      findedTasks = await this.taskRepository.findByExactTitle(userId, title);
    } catch (err) {
      throw new InternalError(
        'Unexpected error while checking task uniqueness',
        err
      );
    }

    if (findedTasks.length > 0) {
      throw new ConflictError('Task with this title already exists');
    }

    return {
      statusCode: 'OK',
      data: null,
    };
  }
}

export { UniqueTaskUseCase };
