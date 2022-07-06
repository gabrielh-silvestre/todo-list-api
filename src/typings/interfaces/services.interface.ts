import type { AuthUser, SignInData, SignReturn, SignUpData } from '../types';

interface IAuthService {
  signUp(data: SignUpData): Promise<SignReturn | never>;
  signIn(data: SignInData): Promise<SignReturn | never>;
  getUser(token: string): Promise<AuthUser | null>;
}

interface IEncryptService {
  encrypt(value: string): Promise<string>;
  verify(value: string, hash: string): Promise<boolean>;
}

export { IAuthService, IEncryptService };
