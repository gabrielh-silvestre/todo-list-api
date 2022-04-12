import express from 'express';

import { uniqueUserController } from '../modules/users/useCases/uniqueUser';
import { createUserController } from '../modules/users/useCases/createUser';
import { userValidation } from '../midleware/validate/UserValidation';
import { loginUserController } from '../modules/users/useCases/loginUser';

const userRouter = express.Router();

userRouter.post(
  '/create',
  userValidation.createValidation,
  uniqueUserController.handle,
  createUserController.handle
);

userRouter.post(
  '/login',
  userValidation.loginValidation,
  loginUserController.handle
);

export { userRouter };
