import { UserRepository } from '../../repository/UsersRepository';
import { VerifyUserUseCase } from './VerifyUserUseUseCase';
import { VerifyUserController } from './VerifyUserController';

const userRepository = new UserRepository();
const verifyUserUseCase = new VerifyUserUseCase(userRepository);
const verifyUserController = new VerifyUserController(verifyUserUseCase);

export { verifyUserUseCase, verifyUserController };
