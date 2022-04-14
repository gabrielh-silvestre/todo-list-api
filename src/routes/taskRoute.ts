import express from 'express';

import { authMiddleware } from '../midleware/auth';
import { taskValidator } from '../midleware/validate/TaskValidator';

import { uniqueTaskController } from '../modules/tasks/useCases/uniqueTask';
import { createTaskController } from '../modules/tasks/useCases/createTask';
import { verifyTaskController } from '../modules/tasks/useCases/verifyTask';
import { deleteTaskController } from '../modules/tasks/useCases/deleteTask';

const taskRouter = express.Router();

taskRouter.use(authMiddleware.handle);

taskRouter.post(
  '/create',
  taskValidator.createValidation,
  uniqueTaskController.handle,
  createTaskController.handle
);

taskRouter.delete(
  '/:id',
  verifyTaskController.handle,
  deleteTaskController.handle
);

export { taskRouter };
