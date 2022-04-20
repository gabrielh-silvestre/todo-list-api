import { ITasksRepository } from '../../repository/ITasksRepository';
import { ISuccess } from '../../../../@types/interfaces';
import { TaskReturn } from '../../../../@types/types';

import { InternalError, NotFoundError } from '../../../../utils/Errors';

class VerifyTaskUseCase {
  constructor(private taskRepository: ITasksRepository) {}

  async execute(userId: string, id: string): Promise<ISuccess<null>> {
    const findedTask = await this.taskRepository.findById(userId, id);

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
