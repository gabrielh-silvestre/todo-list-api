import { UserRepository } from "../../repository/UsersRepository";
import { VerifyUserController } from "./VerifyUserController";
import { VerifyUserUseCase } from "./VerifyUserUseUseCase";

const userRepository = new UserRepository();
const verifyUserUseCase = new VerifyUserUseCase(userRepository);
const verifyUserController = new VerifyUserController(verifyUserUseCase);

export { verifyUserUseCase, verifyUserController };
