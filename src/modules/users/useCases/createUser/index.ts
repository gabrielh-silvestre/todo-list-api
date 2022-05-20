import { AuthService } from '../../../../services/Auth';
import { EncryptService } from '../../../../services/Encrypt';
import { UserRepository } from '../../repository/UsersRepository';
import { CreateUserUseCase } from './CreateUserUseCase';
import { CreateUserController } from './CreateUserController';

const encryptService = new EncryptService();
const userRepository = new UserRepository();
const createUserUseCase = new CreateUserUseCase(
  userRepository,
  AuthService,
  encryptService
);
const createUserController = new CreateUserController(createUserUseCase);

export { createUserController };
