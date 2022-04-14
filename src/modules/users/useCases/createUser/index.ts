import { AuthService } from '../../../../services/Auth';
import { EncriptService } from '../../../../services/Encript';
import { UserRepository } from '../../repository/UsersRepository';
import { CreateUserUseCase } from './CreateUserUseCase';
import { CreateUserController } from './CreateUserController';

const authService = new AuthService();
const encriptService = new EncriptService();
const userRepository = new UserRepository();
const createUserUseCase = new CreateUserUseCase(
  userRepository,
  authService,
  encriptService
);
const createUserController = new CreateUserController(createUserUseCase);

export { createUserController };
