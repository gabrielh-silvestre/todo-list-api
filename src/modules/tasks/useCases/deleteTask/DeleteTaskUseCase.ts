import { ITasksRepository } from '../../repository/ITasksRepository';
import { ISuccess } from '../../../../@types/interfaces';
import { ErrorStatusCode } from '../../../../@types/types';

import { CustomError } from '../../../../utils/CustomError';

class DeleteTaskUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async execute(userId: string, id: string): Promise<ISuccess<null>> {
    try {
      await this.tasksRepository.delete(userId, id);
    } catch (err) {
      throw new CustomError(
        ErrorStatusCode.INTERNAL_SERVER_ERROR,
        'Unexpected error while deleting task'
      );
    }

    return {
      statusCode: 'DELETED',
      data: null,
    };
  }
}

export { DeleteTaskUseCase };
