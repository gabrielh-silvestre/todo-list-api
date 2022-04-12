import bcrypt from 'bcrypt';

interface IEncriptService {
  encript(value: string): Promise<string>;
  verify(value: string, hash: string): Promise<boolean>;
}

class EncriptService implements IEncriptService {
  async encript(value: string) {
    return await bcrypt.hash(value, 10);
  }

  async verify(value: string, hash: string) {
    return await bcrypt.compare(value, hash);
  }
}

export { IEncriptService, EncriptService };
