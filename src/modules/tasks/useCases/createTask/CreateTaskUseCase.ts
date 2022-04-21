import {
  ITasksRepository,
  ITasksRepositoryDTO,
} from '../../repository/ITasksRepository';
import { ISuccess } from '../../../../@types/interfaces';
import { TaskReturn } from '../../../../@types/types';

import { ConflictError } from '../../../../utils/Errors';

class CreateTaskUseCase {
  constructor(private taskRepository: ITasksRepository) {}

  async isUnique(userId: string, title: string): Promise<void> {
    const findedTasks = await this.taskRepository.findByExactTitle(
      userId,
      title
    );

    if (findedTasks.length > 0) {
      throw new ConflictError('Task with this title already exists');
    }
  }

  async execute({
    title,
    description,
    userId,
  }: ITasksRepositoryDTO): Promise<ISuccess<TaskReturn>> {
    await this.isUnique(userId, title);

    const newTask = await this.taskRepository.create({
      title,
      description: description || null,
      userId,
    });

    return { statusCode: 'CREATED', data: newTask };
  }
}

export { CreateTaskUseCase };
