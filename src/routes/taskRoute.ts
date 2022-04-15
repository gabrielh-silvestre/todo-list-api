import express from 'express';

import { authMiddleware } from '../middleware/auth';
import { taskValidator } from '../middleware/validate/TaskValidator';

import { uniqueTaskController } from '../modules/tasks/useCases/uniqueTask';
import { createTaskController } from '../modules/tasks/useCases/createTask';
import { verifyTaskController } from '../modules/tasks/useCases/verifyTask';
import { deleteTaskController } from '../modules/tasks/useCases/deleteTask';
import { updateTaskController } from '../modules/tasks/useCases/updateTask';

const taskRouter = express.Router();

taskRouter.use(authMiddleware.handle);

taskRouter.post(
  '/',
  taskValidator.createValidation,
  uniqueTaskController.handle,
  createTaskController.handle
);

taskRouter.delete(
  '/:id',
  verifyTaskController.handle,
  deleteTaskController.handle
);

taskRouter.put(
  '/:id',
  taskValidator.updateValidation,
  verifyTaskController.handle,
  updateTaskController.handle
);

export { taskRouter };
