interface IAuthService<T> {
  createToken(id: string): string;
  verifyToken(token: string): T | null;
}

interface IEncryptService {
  encrypt(value: string): Promise<string>;
  verify(value: string, hash: string): Promise<boolean>;
}

export { IAuthService, IEncryptService };
