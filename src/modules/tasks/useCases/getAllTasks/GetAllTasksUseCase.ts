import { StatusCodes } from 'http-status-codes';

import { ITasksRepository } from '../../repository/ITasksRepository';
import { ISuccess, ITaskUserIdentifier } from '../../../../@types/interfaces';
import { TaskReturn } from '../../../../@types/types';

interface IRequest extends ITaskUserIdentifier {}

class GetAllTasksUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async execute({ userId }: IRequest): Promise<ISuccess<TaskReturn[]>> {
    const foundTasks = await this.tasksRepository.findAll({ userId });

    return {
      statusCode: StatusCodes.OK,
      data: foundTasks,
    };
  }
}

export { GetAllTasksUseCase };
