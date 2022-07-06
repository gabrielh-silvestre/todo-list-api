import { authService } from "../../../../shared/services/Auth";

import { UserRepository } from "../../repository/UsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { CreateUserController } from "./CreateUserController";

const userRepository = new UserRepository();
const createUserUseCase = new CreateUserUseCase(userRepository, authService);
const createUserController = new CreateUserController(createUserUseCase);

export { createUserController, createUserUseCase };
