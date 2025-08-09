import { BaseModel } from './base';
import { supabaseAdmin } from '@/lib/supabase';

export class StoreModel extends BaseModel<'stores'> {
  constructor() {
    super('stores', supabaseAdmin);
  }

  // Get store by subdomain
  async getBySubdomain(subdomain: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('subdomain', subdomain)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Get store by user ID
  async getByUserId(userId: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Check if subdomain exists
  async subdomainExists(subdomain: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('id')
      .eq('subdomain', subdomain)
      .single();
    
    return !error && !!data;
  }

  // Check if subdomain exists for other users
  async subdomainExistsForOtherUser(subdomain: string, excludeUserId: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('id')
      .eq('subdomain', subdomain)
      .neq('user_id', excludeUserId)
      .single();
    
    return !error && !!data;
  }

  // Get store with products
  async getStoreWithProducts(storeId: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        products (
          *,
          product_variants (*)
        )
      `)
      .eq('id', storeId)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Get store with products by subdomain
  async getStoreWithProductsBySubdomain(subdomain: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        products (
          *,
          product_variants (*)
        )
      `)
      .eq('subdomain', subdomain)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Get store statistics
  async getStoreStats(storeId: string) {
    const { data, error } = await this.supabase
      .rpc('get_store_stats', { store_uuid: storeId });
    
    if (error) throw error;
    return data?.[0] || { total_products: 0, total_revenue: 0, total_sales: 0 };
  }

  // Update store settings
  async updateSettings(storeId: string, settings: {
    name?: string;
    subdomain?: string;
    currency?: string;
    razorpay_key_id?: string;
    theme?: string;
  }) {
    return this.update(storeId, settings);
  }

  // Get stores with user info
  async getStoresWithUsers() {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        users (
          id,
          first_name,
          last_name,
          email
        )
      `);
    
    if (error) throw error;
    return data;
  }

  // Search stores
  async searchStores(searchTerm: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .or(`name.ilike.%${searchTerm}%,subdomain.ilike.%${searchTerm}%`)
      .limit(10);
    
    if (error) throw error;
    return data;
  }

  // Get store analytics
  async getStoreAnalytics(storeId: string) {
    const { data, error } = await this.supabase
      .from('products')
      .select(`
        id,
        price,
        stock,
        product_type,
        created_at
      `)
      .eq('store_id', storeId);
    
    if (error) throw error;
    
    const totalProducts = data.length;
    const totalRevenue = data.reduce((sum, product) => sum + Number(product.price), 0);
    const lowStockProducts = data.filter(product => product.stock < 10).length;
    const productTypes = data.reduce((acc, product) => {
      acc[product.product_type] = (acc[product.product_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalProducts,
      totalRevenue,
      lowStockProducts,
      productTypes,
      recentProducts: data.slice(-5) // Last 5 products
    };
  }
}

// Export singleton instance
export const storeModel = new StoreModel(); 