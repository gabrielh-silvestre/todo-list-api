import { Auth } from '../../../../midleware/auth';
import { UserRepository } from '../../repository/UsersRepository';
import { CreateUserUseCase } from './CreateUserUseCase';
import { CreateUserController } from './CreateUserController';

const auth = new Auth();
const userRepository = new UserRepository();
const createUserUseCase = new CreateUserUseCase(userRepository, auth);
const createUserController = new CreateUserController(createUserUseCase);

export { createUserController };
