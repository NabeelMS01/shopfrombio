import { BaseModel } from './base';
import { supabaseAdmin } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export class UserModel extends BaseModel<'users'> {
  constructor() {
    super('users', supabaseAdmin);
  }

  // Get user by email
  async getByEmail(email: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Check if user exists by email
  async existsByEmail(email: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('id')
      .eq('email', email)
      .single();
    
    return !error && !!data;
  }

  // Create user with password hashing
  async createWithPassword(userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }) {
    try {
      console.log('Creating user with data:', { ...userData, password: '[HIDDEN]' });
      
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      console.log('Password hashed successfully');
      
      const userDataToInsert = {
        ...userData,
        password: hashedPassword,
      };
      
      console.log('Inserting user data:', { ...userDataToInsert, password: '[HIDDEN]' });
      
      const result = await this.create(userDataToInsert);
      console.log('User created successfully:', result);
      
      return result;
    } catch (error) {
      console.error('Error in createWithPassword:', error);
      throw error;
    }
  }

  // Verify password
  async verifyPassword(email: string, password: string) {
    const user = await this.getByEmail(email);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  // Get user with store
  async getUserWithStore(userId: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        stores (*)
      `)
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Update user profile (without password)
  async updateProfile(userId: string, data: {
    first_name?: string;
    last_name?: string;
    email?: string;
  }) {
    return this.update(userId, data);
  }

  // Change password
  async changePassword(userId: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return this.update(userId, { password: hashedPassword });
  }

  // Get user statistics
  async getUserStats(userId: string) {
    const { data, error } = await this.supabase
      .from('stores')
      .select(`
        id,
        products (count)
      `)
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    
    return {
      storeId: data?.id,
      productCount: data?.products?.[0]?.count || 0,
    };
  }
}

// Export singleton instance
export const userModel = new UserModel(); 