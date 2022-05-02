import bcrypt from 'bcrypt';

import { IEncryptService } from '../../@types/interfaces';

class EncryptService implements IEncryptService {
  async encrypt(value: string) {
    return await bcrypt.hash(value, 10);
  }

  async verify(value: string, hash: string) {
    return await bcrypt.compare(value, hash);
  }
}

export { EncryptService };
