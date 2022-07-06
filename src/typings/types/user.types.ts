import { User } from "@supabase/supabase-js";

export type UserAttributes = {
  id: string;
  username: string;
  email: string;
};

export type UserCreateAttributes = UserAttributes;

export type TokenReturn = {
  token: string;
};

export type CreateUserUseCaseDTO = Omit<UserAttributes, "id"> & {
  password: string;
};

export type LoginUserUseCaseDTO = Omit<CreateUserUseCaseDTO, "username">;

export type AuthUser = User;
