import { TasksRepository } from "../../repository/TasksRepository";
import { GetAllTasksController } from "./GetAllTasksController";
import { GetAllTasksUseCase } from "./GetAllTasksUseCase";

const tasksRepository = new TasksRepository();
const getAllTasksUseCase = new GetAllTasksUseCase(tasksRepository);
const getAllTasksController = new GetAllTasksController(getAllTasksUseCase);

export { getAllTasksUseCase, getAllTasksController };
