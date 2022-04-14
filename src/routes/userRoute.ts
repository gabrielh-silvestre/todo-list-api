import express from 'express';

import { uniqueUserController } from '../modules/users/useCases/uniqueUser';
import { createUserController } from '../modules/users/useCases/createUser';
import { userValidator } from '../midleware/validate/UserValidator';
import { loginUserController } from '../modules/users/useCases/loginUser';

const userRouter = express.Router();

userRouter.post(
  '/create',
  userValidator.createValidation,
  uniqueUserController.handle,
  createUserController.handle
);

userRouter.post(
  '/login',
  userValidator.loginValidation,
  loginUserController.handle
);

export { userRouter };
