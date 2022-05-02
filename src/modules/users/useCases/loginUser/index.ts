import { EncryptService } from '../../../../services/Encrypt';
import { AuthService } from '../../../../services/Auth';
import { UserRepository } from '../../../../modules/users/repository/UsersRepository';
import { LoginUserUseCase } from '../../../../modules/users/useCases/loginUser/LoginUserUseCase';
import { LoginUserController } from '../../../../modules/users/useCases/loginUser/LoginUserController';

const authService = new AuthService();
const encryptService = new EncryptService();
const userRepository = new UserRepository();
const loginUserUseCase = new LoginUserUseCase(
  userRepository,
  authService,
  encryptService
);
const loginUserController = new LoginUserController(loginUserUseCase);

export { loginUserController };
