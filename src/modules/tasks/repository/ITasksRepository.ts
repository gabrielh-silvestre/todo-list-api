import { TaskStatus } from '@prisma/client';
import { TaskReturn } from '../../../@types/types';

interface ITasksRepositoryDTO {
  title: string;
  description: string | null;
  status?: TaskStatus;
  userId: string;
}

type ITasksRepositoryUpdateDTO = Omit<ITasksRepositoryDTO, 'userId'>;

interface ITasksRepository {
  create({
    title,
    description,
    userId,
  }: ITasksRepositoryDTO): Promise<TaskReturn>;
  update(
    userId: string,
    id: string,
    taskData: ITasksRepositoryUpdateDTO
  ): Promise<TaskReturn>;
  findAll(userId: string): Promise<TaskReturn[]>;
  findById(userId: string, id: string): Promise<TaskReturn | null>;
  findByTitle(userId: string, title: string): Promise<TaskReturn[]>;
  delete(userId: string, id: string): Promise<void>;
}

export { ITasksRepository, ITasksRepositoryDTO, ITasksRepositoryUpdateDTO };
