import { ITasksRepository } from '../../repository/ITasksRepository';
import { ISuccess } from '../../../../@types/interfaces';
import { TaskReturn } from '../../../../@types/types';

import { InternalError } from '../../../../utils/Errors';

class GetAllTasksUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async execute(userId: string): Promise<ISuccess<TaskReturn[]>> {
    const findedTasks = await this.tasksRepository.findAll(userId);

    return {
      statusCode: 'OK',
      data: findedTasks,
    };
  }
}

export { GetAllTasksUseCase };
