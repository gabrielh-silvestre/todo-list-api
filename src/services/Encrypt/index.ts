import bcrypt from 'bcrypt';

class EncryptService {
  public static async encrypt(value: string) {
    return await bcrypt.hash(value, 10);
  }

  public static async verify(value: string, hash: string) {
    return await bcrypt.compare(value, hash);
  }
}

export { EncryptService };
