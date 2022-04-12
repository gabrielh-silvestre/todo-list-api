import bcrypt from 'bcrypt';
import { IEncriptService } from '../../@types/interfaces';

class EncriptService implements IEncriptService {
  async encript(value: string) {
    return await bcrypt.hash(value, 10);
  }

  async verify(value: string, hash: string) {
    return await bcrypt.compare(value, hash);
  }
}

export { EncriptService };
