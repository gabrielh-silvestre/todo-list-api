import { User } from "@supabase/supabase-js";

interface ISignUpRequest {
  username: string;
  email: string;
  password: string;
}

interface ISignResponse {
  token: string;
  user: User | null;
}

interface IAuthService {
  signUp(data: ISignUpRequest): Promise<ISignResponse | never>;
  signIn(data: Omit<ISignUpRequest, 'username'>): Promise<ISignResponse | never>;
  getUser(token: string): Promise<User | null>;
}

interface IEncryptService {
  encrypt(value: string): Promise<string>;
  verify(value: string, hash: string): Promise<boolean>;
}

export { IAuthService, IEncryptService, ISignUpRequest, ISignResponse };
