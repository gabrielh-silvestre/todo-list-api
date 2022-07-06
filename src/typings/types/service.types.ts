import { AuthUser } from "./user.types";

type SignUp = {
  username: string;
  email: string;
  password: string;
}

type SignIn = Omit<SignUp, 'username'>;

type AuthReturn = {
  token: string;
  user: AuthUser | null;
}

export type SignReturn = AuthReturn;
export type SignUpData = SignUp;
export type SignInData = SignIn;
