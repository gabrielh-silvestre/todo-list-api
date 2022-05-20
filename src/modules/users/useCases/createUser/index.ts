import { AuthService } from '../../../../services/Auth';
import { EncryptService } from '../../../../services/Encrypt';
import { UserRepository } from '../../repository/UsersRepository';
import { CreateUserUseCase } from './CreateUserUseCase';
import { CreateUserController } from './CreateUserController';

const userRepository = new UserRepository();
const createUserUseCase = new CreateUserUseCase(
  userRepository,
  AuthService,
  EncryptService
);
const createUserController = new CreateUserController(createUserUseCase);

export { createUserController };
