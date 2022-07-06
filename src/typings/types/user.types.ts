import { User } from '@supabase/supabase-js';

type Attributes = {
  id: string;
  username: string;
  email: string;
};

type CreateAttributes = Attributes;

type Token = {
  token: string;
}

type CreateUseCase = Omit<Attributes, 'id'> & {
  password: string;
};

type LoginUseCase = Omit<CreateUseCase, 'username'>;

export type UserAttributes = Attributes;
export type UserCreateAttributes = CreateAttributes;
export type AuthUser = User;
export type TokenReturn = Token;
export type LoginUserUseCaseDTO = LoginUseCase;
export type CreateUserUseCaseDTO = CreateUseCase;
