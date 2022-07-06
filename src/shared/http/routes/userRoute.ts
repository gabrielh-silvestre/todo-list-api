import express from "express";

import { createUserController } from "../../../modules/users/useCases/createUser";
import { UserValidator } from "../middleware/Validators/UserValidator";
import { loginUserController } from "../../../modules/users/useCases/loginUser";

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
