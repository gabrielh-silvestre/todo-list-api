import type {
  TaskCreateAttributes,
  TaskIdentifierById,
  TaskIdentifierByTitle,
  TaskIdentifierByUser,
  TaskReturn,
  TaskUpdateAttributes,
} from '../../../@types/types';

interface ITasksRepository {
  create(newTaskAttributes: TaskCreateAttributes): Promise<TaskReturn>;
  update(taskToUpdate: TaskUpdateAttributes): Promise<TaskReturn>;
  findAll(userIdentifier: TaskIdentifierByUser): Promise<TaskReturn[]>;
  findById(taskIdentifier: TaskIdentifierById): Promise<TaskReturn | null>;
  findByExactTitle(
    taskIdentByTitle: TaskIdentifierByTitle
  ): Promise<TaskReturn[]>;
  delete(taskIdentifier: TaskIdentifierById): Promise<void>;
}

export { ITasksRepository };
