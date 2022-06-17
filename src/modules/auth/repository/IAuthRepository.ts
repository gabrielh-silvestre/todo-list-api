import { User, AdminUserAttributes } from '@supabase/supabase-js';

interface IAuthRepository {
  findUser(id: string): Promise<User | null>;
  createUser(attributes: AdminUserAttributes): Promise<User>;
  updateUser(id: string, attributes: AdminUserAttributes): Promise<User>;
  deleteUser(id: string): Promise<void>;
}

export { IAuthRepository };
