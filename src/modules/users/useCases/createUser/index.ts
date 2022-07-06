import { authService } from "../../../../shared/services/Auth";
import { UserRepository } from "../../repository/UsersRepository";
import { CreateUserController } from "./CreateUserController";
import { CreateUserUseCase } from "./CreateUserUseCase";

const userRepository = new UserRepository();
const createUserUseCase = new CreateUserUseCase(userRepository, authService);
const createUserController = new CreateUserController(createUserUseCase);

export { createUserController, createUserUseCase };
