import { AuthUser } from "./user.types";

export type SignUpData = {
  username: string;
  email: string;
  password: string;
};

export type SignInData = Omit<SignUpData, "username">;

export type SignReturn = {
  token: string;
  user: AuthUser | null;
};
