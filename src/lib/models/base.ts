import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../supabase';

export type TableName = keyof Database['public']['Tables'];
export type Row<T extends TableName> = Database['public']['Tables'][T]['Row'];
export type Insert<T extends TableName> = Database['public']['Tables'][T]['Insert'];
export type Update<T extends TableName> = Database['public']['Tables'][T]['Update'];

export abstract class BaseModel<T extends TableName> {
  protected tableName: T;
  protected supabase: SupabaseClient<Database>;

  constructor(tableName: T, supabase: SupabaseClient<Database>) {
    this.tableName = tableName;
    this.supabase = supabase;
  }

  // Get all records
  async getAll() {
    const { data, error } = await this.supabase
      .from(this.tableName as string)
      .select('*');
    
    if (error) throw error;
    return data as Row<T>[];
  }

  // Get by ID
  async getById(id: string) {
    const { data, error } = await this.supabase
      .from(this.tableName as string)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Row<T>;
  }

    // Create new record
  async create(data: Insert<T>) {
    try {
      console.log(`Creating record in ${this.tableName}:`, data);
      
      const { data: newRecord, error } = await this.supabase
        .from(this.tableName as string)
        .insert(data)
        .select()
        .single();

      if (error) {
        console.error(`Error creating record in ${this.tableName}:`, error);
        throw error;
      }
      
      console.log(`Record created successfully in ${this.tableName}:`, newRecord);
      return newRecord as Row<T>;
    } catch (error) {
      console.error(`Exception in create method for ${this.tableName}:`, error);
      throw error;
    }
  }

  // Update record
  async update(id: string, data: Update<T>) {
    const { data: updatedRecord, error } = await this.supabase
      .from(this.tableName as string)
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return updatedRecord as Row<T>;
  }

  // Delete record
  async delete(id: string) {
    const { error } = await this.supabase
      .from(this.tableName as string)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  // Get count
  async count() {
    const { count, error } = await this.supabase
      .from(this.tableName as string)
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    return count || 0;
  }

  // Get with pagination
  async getPaginated(page: number = 1, limit: number = 10) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await this.supabase
      .from(this.tableName as string)
      .select('*', { count: 'exact' })
      .range(from, to);
    
    if (error) throw error;
    
    return {
      data: data as Row<T>[],
      count: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    };
  }
} 