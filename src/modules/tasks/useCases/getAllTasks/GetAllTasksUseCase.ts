import { ITasksRepository } from '../../repository/ITasksRepository';
import { ISuccess } from '../../../../@types/interfaces';
import { TaskReturn } from '../../../../@types/types';

interface IRequest {
  userId: string;
}

class GetAllTasksUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async execute({ userId }: IRequest): Promise<ISuccess<TaskReturn[]>> {
    const foundTasks = await this.tasksRepository.findAll({ userId });

    return {
      statusCode: 'OK',
      data: foundTasks,
    };
  }
}

export { GetAllTasksUseCase };
