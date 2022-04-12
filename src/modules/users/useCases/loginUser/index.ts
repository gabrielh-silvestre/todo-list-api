import { Auth } from '../../../../midleware/auth';
import { UserRepository } from '../../../../modules/users/repository/UsersRepository';
import { LoginUserUseCase } from '../../../../modules/users/useCases/loginUser/LoginUserUseCase';
import { LoginUserController } from '../../../../modules/users/useCases/loginUser/LoginUserController';

const authService = new Auth();
const userRepository = new UserRepository();
const loginUserUseCase = new LoginUserUseCase(userRepository, authService);
const loginUserController = new LoginUserController(loginUserUseCase);

export { loginUserController };
