import { ITasksRepository } from '../../repository/ITasksRepository';
import { ISuccess } from '../../../../@types/interfaces';
import { TaskReturn } from '../../../../@types/types';

import { CustomError } from '../../../../utils/CustomError';

class UniqueTaskUseCase {
  constructor(private taskRepository: ITasksRepository) {}

  async execute(userId: string, title: string): Promise<ISuccess<null> | void> {
    let findedTasks: TaskReturn[] = [];

    try {
      findedTasks = await this.taskRepository.findByExactTitle(userId, title);
    } catch (err) {
      throw new CustomError(
        'INTERNAL_SERVER_ERROR',
        'Unexpected error while checking task uniqueness'
      );
    }

    if (findedTasks.length > 0) {
      throw new CustomError('CONFLICT', 'Task with this title already exists');
    }

    return {
      statusCode: 'OK',
      data: null,
    };
  }
}

export { UniqueTaskUseCase };
