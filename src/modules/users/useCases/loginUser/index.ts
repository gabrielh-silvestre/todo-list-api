import { Encript } from '../../../../services/Encript';
import { Auth } from '../../../../services/Auth';
import { UserRepository } from '../../../../modules/users/repository/UsersRepository';
import { LoginUserUseCase } from '../../../../modules/users/useCases/loginUser/LoginUserUseCase';
import { LoginUserController } from '../../../../modules/users/useCases/loginUser/LoginUserController';

const authService = new Auth();
const encriptService = new Encript();
const userRepository = new UserRepository();
const loginUserUseCase = new LoginUserUseCase(
  userRepository,
  authService,
  encriptService
);
const loginUserController = new LoginUserController(loginUserUseCase);

export { loginUserController };
