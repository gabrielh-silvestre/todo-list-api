import type { IUsersRepository } from "@projectTypes/interfaces";
import type { SuccessCase, UserAttributes } from "@projectTypes/types";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "restify-errors";

class VerifyUserUseCase {
  constructor(private userRepository: IUsersRepository) {}

  async execute({
    id,
  }: Pick<UserAttributes, "id">): Promise<SuccessCase<null> | never> {
    const foundUser = await this.userRepository.findById(id);

    if (!foundUser) {
      throw new NotFoundError("User does not exist");
    }

    return {
      statusCode: StatusCodes.OK,
      data: null,
    };
  }
}

export { VerifyUserUseCase };
