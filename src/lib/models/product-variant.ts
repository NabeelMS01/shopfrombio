import { BaseModel } from './base';
import { supabaseAdmin } from '@/lib/supabase';

export class ProductVariantModel extends BaseModel<'product_variants'> {
  constructor() {
    super('product_variants', supabaseAdmin);
  }

  // Get variants by product ID
  async getByProductId(productId: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('product_id', productId)
      .order('variant_type', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  // Get variants by type
  async getByType(productId: string, variantType: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('product_id', productId)
      .eq('variant_type', variantType)
      .order('variant_name', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  // Create multiple variants
  async createMany(variants: Array<{
    product_id: string;
    variant_type: string;
    variant_name: string;
    stock?: number;
  }>) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert(variants)
      .select();
    
    if (error) throw error;
    return data;
  }

  // Update variant stock
  async updateStock(variantId: string, newStock: number) {
    return this.update(variantId, { stock: newStock });
  }

  // Get low stock variants
  async getLowStockVariants(threshold: number = 5) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        products (
          id,
          title,
          store_id
        )
      `)
      .lt('stock', threshold)
      .order('stock', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  // Get variant statistics
  async getVariantStats(productId: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('product_id', productId);
    
    if (error) throw error;
    
    const totalVariants = data.length;
    const variantTypes = [...new Set(data.map(v => v.variant_type))];
    const totalStock = data.reduce((sum, variant) => sum + (variant.stock || 0), 0);
    const lowStockVariants = data.filter(variant => (variant.stock || 0) < 5).length;
    
    return {
      totalVariants,
      variantTypes,
      totalStock,
      lowStockVariants,
      variants: data
    };
  }

  // Delete variants by product ID
  async deleteByProductId(productId: string) {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('product_id', productId);
    
    if (error) throw error;
    return true;
  }

  // Check if variant exists
  async variantExists(productId: string, variantType: string, variantName: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('id')
      .eq('product_id', productId)
      .eq('variant_type', variantType)
      .eq('variant_name', variantName)
      .single();
    
    return !error && !!data;
  }
}

// Export singleton instance
export const productVariantModel = new ProductVariantModel(); 