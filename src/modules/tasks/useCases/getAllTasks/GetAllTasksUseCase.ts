import { ISuccess } from '../../../../@types/interfaces';
import { TaskReturn } from '../../../../@types/types';
import { CustomError } from '../../../../utils/CustomError';
import { ITasksRepository } from '../../repository/ITasksRepository';

class GetAllTasksUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async execute(userId: string): Promise<ISuccess<TaskReturn[]>> {
    try {
      const findedTasks = await this.tasksRepository.findAll(userId);

      return {
        statusCode: 'OK',
        data: findedTasks,
      };
    } catch (err) {
      throw new CustomError(
        'INTERNAL_SERVER_ERROR',
        'Unexpected error while finding all tasks'
      );
    }
  }
}

export { GetAllTasksUseCase };
