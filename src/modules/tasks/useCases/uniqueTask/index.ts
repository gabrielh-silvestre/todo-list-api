import { TasksRepository } from '../../repository/TasksRepository';
import { UniqueTaskUseCase } from './UniqueTaskUseCase';
import { UniqueTaskController } from './UniqueTaskController';

const taskRepository = new TasksRepository();
const uniqueTaskUseCase = new UniqueTaskUseCase(taskRepository);
const uniqueTaskController = new UniqueTaskController(uniqueTaskUseCase);

export { uniqueTaskController };
