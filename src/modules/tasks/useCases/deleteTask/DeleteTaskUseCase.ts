import { ITasksRepository } from '../../repository/ITasksRepository';
import { ISuccess } from '../../../../@types/interfaces';

class DeleteTaskUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async execute(userId: string, id: string): Promise<ISuccess<null>> {
    await this.tasksRepository.delete(userId, id);

    return {
      statusCode: 'DELETED',
      data: null,
    };
  }
}

export { DeleteTaskUseCase };
