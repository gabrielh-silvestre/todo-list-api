import express from 'express';

import { createUserController } from '../modules/users/useCases/createUser';
import { userValidator } from '../middleware/validate/UserValidator';
import { loginUserController } from '../modules/users/useCases/loginUser';

const userRouter = express.Router();

userRouter.post(
  '/create',
  userValidator.createValidation,
  createUserController.handle
);

userRouter.post(
  '/login',
  userValidator.loginValidation,
  loginUserController.handle
);

export { userRouter };
