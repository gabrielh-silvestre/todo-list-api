import { ITasksRepository } from '../../repository/ITasksRepository';
import { ISuccess } from '../../../../@types/interfaces';
import { TaskReturn } from '../../../../@types/types';

import { InternalError, NotFoundError } from '../../../../utils/Errors';

class VerifyTaskUseCase {
  constructor(private taskRepository: ITasksRepository) {}

  async execute(userId: string, id: string): Promise<ISuccess<null>> {
    let findedTask: TaskReturn | null = null;

    try {
      findedTask = await this.taskRepository.findById(userId, id);
    } catch (err) {
      throw new InternalError(
        'Unexpected error while checking if task exist',
        err
      );
    }

    if (!findedTask) {
      throw new NotFoundError('Task not found');
    }

    return {
      statusCode: 'OK',
      data: null,
    };
  }
}

export { VerifyTaskUseCase };
