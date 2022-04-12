import { UserRepository } from '../../repository/UsersRepository';
import { UniqueUserUseCase } from './UniqueUserUseCase';
import { UniqueUserController } from './UniqueUserController';

const userRepository = new UserRepository();
const uniqueUserUseCase = new UniqueUserUseCase(userRepository);
const uniqueUserController = new UniqueUserController(uniqueUserUseCase);

export { uniqueUserController };
