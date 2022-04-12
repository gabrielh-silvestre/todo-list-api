import bcrypt from 'bcrypt';

interface IEncript {
  encript(value: string): Promise<string>;
  verify(value: string, hash: string): Promise<boolean>;
}

class Encript implements IEncript {
  async encript(value: string) {
    return await bcrypt.hash(value, 10);
  }

  async verify(value: string, hash: string) {
    return await bcrypt.compare(value, hash);
  }
}

export { IEncript, Encript };
