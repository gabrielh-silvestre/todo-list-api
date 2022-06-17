import { AdminUserAttributes, User } from '@supabase/supabase-js';

import { IAuthRepository } from './IAuthRepository';

import { supabase } from '..';

class AuthRepository implements IAuthRepository {
  private readonly client = supabase.auth.api;

  async findUser(id: string): Promise<User | null> {
    const { data } = await this.client.getUserById(id);

    return data;
  }

  async createUser(attributes: AdminUserAttributes): Promise<User> {
    const { data } = await this.client.createUser(attributes);

    return data as User;
  }

  async updateUser(id: string, attributes: AdminUserAttributes): Promise<User> {
    const { data } = await this.client.updateUser(id, attributes);

    return data as User;
  }

  async deleteUser(id: string): Promise<void> {
    await this.client.deleteUser(id);
  }
}

export { AuthRepository };
