import { authService } from "../../../../shared/services/Auth";
import { UserRepository } from "../../repository/UsersRepository";
import { LoginUserController } from "./LoginUserController";
import { LoginUserUseCase } from "./LoginUserUseCase";

const userRepository = new UserRepository();
const loginUserUseCase = new LoginUserUseCase(userRepository, authService);
const loginUserController = new LoginUserController(loginUserUseCase);

export { loginUserController, loginUserUseCase };
