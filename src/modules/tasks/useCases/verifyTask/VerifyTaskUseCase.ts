import { ITasksRepository } from '../../repository/ITasksRepository';
import { ISuccess } from '../../../../@types/interfaces';
import { ErrorStatusCode, TaskReturn } from '../../../../@types/types';

import { CustomError } from '../../../../utils/CustomError';

class VerifyTaskUseCase {
  constructor(private taskRepository: ITasksRepository) {}

  async execute(userId: string, id: string): Promise<ISuccess<null>> {
    let findedTask: TaskReturn | null = null;

    try {
      findedTask = await this.taskRepository.findById(userId, id);
    } catch (err) {
      throw new CustomError(
        ErrorStatusCode.INTERNAL_SERVER_ERROR,
        'Unexpected error while checking if task exist'
      );
    }

    if (!findedTask) {
      throw new CustomError(ErrorStatusCode.NOT_FOUND, 'Task not found');
    }

    return {
      statusCode: 'OK',
      data: null,
    };
  }
}

export { VerifyTaskUseCase };
