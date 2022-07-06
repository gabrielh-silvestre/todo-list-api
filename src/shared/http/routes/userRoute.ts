import express from "express";

import { createUserController } from "../../../modules/users/useCases/createUser";
import { loginUserController } from "../../../modules/users/useCases/loginUser";
import { UserValidator } from "../middleware/Validators/UserValidator";

const userRouter = express.Router();

userRouter.post(
  "/create",
  UserValidator.createValidation,
  createUserController.handle
);

userRouter.post(
  "/login",
  UserValidator.loginValidation,
  loginUserController.handle
);

export { userRouter };
