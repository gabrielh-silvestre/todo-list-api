import { Handler } from "express";

import { UserAttributes, UserCreateAttributes } from "../types";

export interface IUsersRepository {
  create(newUserCredentials: UserCreateAttributes): Promise<void>;
  findById(id: string): Promise<UserAttributes | null>;
  findByEmail(email: string): Promise<UserAttributes | null>;
}

export interface IUserValidator {
  createValidation: Handler;
  loginValidation: Handler;
}
