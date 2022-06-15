import { EncryptService } from '../../../../services/Encrypt';
import { AuthService } from '../../../../services/Auth';

import { UserRepository } from '../../../../modules/users/repository/UsersRepository';
import { LoginUserUseCase } from '../../../../modules/users/useCases/loginUser/LoginUserUseCase';
import { LoginUserController } from '../../../../modules/users/useCases/loginUser/LoginUserController';

const userRepository = new UserRepository();
const loginUserUseCase = new LoginUserUseCase(
  userRepository,
  AuthService,
  EncryptService
);
const loginUserController = new LoginUserController(loginUserUseCase);

export { loginUserController, loginUserUseCase };
