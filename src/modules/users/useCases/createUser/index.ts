import { Encript } from '../../../../services/Encript';
import { UserRepository } from '../../repository/UsersRepository';
import { CreateUserUseCase } from './CreateUserUseCase';
import { CreateUserController } from './CreateUserController';

const encriptService = new Encript();
const userRepository = new UserRepository();
const createUserUseCase = new CreateUserUseCase(userRepository, encriptService);
const createUserController = new CreateUserController(createUserUseCase);

export { createUserController };
