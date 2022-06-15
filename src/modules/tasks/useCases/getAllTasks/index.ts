import { TasksRepository } from '../../repository/TasksRepository';
import { GetAllTasksUseCase } from './GetAllTasksUseCase';
import { GetAllTasksController } from './GetAllTasksController';

const tasksRepository = new TasksRepository();
const getAllTasksUseCase = new GetAllTasksUseCase(tasksRepository);
const getAllTasksController = new GetAllTasksController(getAllTasksUseCase);

export { getAllTasksUseCase, getAllTasksController };
