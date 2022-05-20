import { EncryptService } from '../../../../services/Encrypt';
import { AuthService } from '../../../../services/Auth';
import { UserRepository } from '../../../../modules/users/repository/UsersRepository';
import { LoginUserUseCase } from '../../../../modules/users/useCases/loginUser/LoginUserUseCase';
import { LoginUserController } from '../../../../modules/users/useCases/loginUser/LoginUserController';

const encryptService = new EncryptService();
const userRepository = new UserRepository();
const loginUserUseCase = new LoginUserUseCase(
  userRepository,
  AuthService,
  encryptService
);
const loginUserController = new LoginUserController(loginUserUseCase);

export { loginUserController };
