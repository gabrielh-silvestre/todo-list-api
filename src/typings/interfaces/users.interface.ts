import { Handler } from 'express';

import { UserAttributes, UserCreateAttributes } from '../types';

interface UsersRepository {
  create(newUserCredentials: UserCreateAttributes): Promise<void>;
  findById(id: string): Promise<UserAttributes | null>;
  findByEmail(email: string): Promise<UserAttributes | null>;
}

interface UserValidator {
  createValidation: Handler;
  loginValidation: Handler;
}

export type IUsersRepository = UsersRepository;
export type IUserValidator = UserValidator;
