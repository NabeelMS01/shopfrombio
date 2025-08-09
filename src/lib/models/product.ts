import { BaseModel } from './base';
import { supabaseAdmin } from '@/lib/supabase';

export interface ProductVariant {
  variant_type: string;
  variant_name: string;
  stock?: number;
}

export class ProductModel extends BaseModel<'products'> {
  constructor() {
    super('products', supabaseAdmin);
  }

  // Get products by store ID
  async getByStoreId(storeId: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        product_variants (*)
      `)
      .eq('store_id', storeId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Get product with variants
  async getWithVariants(productId: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        product_variants (*)
      `)
      .eq('id', productId)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Create product with variants
  async createWithVariants(productData: {
    store_id: string;
    title: string;
    description?: string;
    price: number;
    cost?: number;
    discount_type?: 'percentage' | 'amount';
    discount_value?: number;
    stock: number;
    product_type: 'product' | 'service';
    images?: string[];
  }, variants?: ProductVariant[]) {
    // Create product first
    const product = await this.create(productData);
    
    // Create variants if provided
    if (variants && variants.length > 0) {
      const variantData = variants.map(variant => ({
        product_id: product.id,
        variant_type: variant.variant_type,
        variant_name: variant.variant_name,
        stock: variant.stock,
      }));

      const { error: variantError } = await this.supabase
        .from('product_variants')
        .insert(variantData);

      if (variantError) {
        // If variant creation fails, delete the product
        await this.delete(product.id);
        throw variantError;
      }
    }
    
    return this.getWithVariants(product.id);
  }

  // Update product with variants
  async updateWithVariants(productId: string, productData: {
    title?: string;
    description?: string;
    price?: number;
    cost?: number;
    discount_type?: 'percentage' | 'amount';
    discount_value?: number;
    stock?: number;
    product_type?: 'product' | 'service';
    images?: string[];
  }, variants?: ProductVariant[]) {
    // Update product
    await this.update(productId, productData);
    
    // Update variants if provided
    if (variants !== undefined) {
      // Delete existing variants
      await this.supabase
        .from('product_variants')
        .delete()
        .eq('product_id', productId);

      // Insert new variants
      if (variants.length > 0) {
        const variantData = variants.map(variant => ({
          product_id: productId,
          variant_type: variant.variant_type,
          variant_name: variant.variant_name,
          stock: variant.stock,
        }));

        const { error: variantError } = await this.supabase
          .from('product_variants')
          .insert(variantData);

        if (variantError) throw variantError;
      }
    }
    
    return this.getWithVariants(productId);
  }

  // Search products in store
  async searchInStore(storeId: string, searchTerm: string) {
    const { data, error } = await this.supabase
      .rpc('search_products', {
        search_term: searchTerm,
        store_uuid: storeId
      });
    
    if (error) throw error;
    return data;
  }

  // Get products by type
  async getByType(storeId: string, productType: 'product' | 'service') {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        product_variants (*)
      `)
      .eq('store_id', storeId)
      .eq('product_type', productType)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Get low stock products
  async getLowStockProducts(storeId: string, threshold: number = 10) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('store_id', storeId)
      .lt('stock', threshold)
      .order('stock', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  // Update stock
  async updateStock(productId: string, newStock: number) {
    return this.update(productId, { stock: newStock });
  }

  // Get product statistics for store
  async getProductStats(storeId: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
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
    const totalValue = data.reduce((sum, product) => sum + (Number(product.price) * product.stock), 0);
    const averagePrice = totalProducts > 0 ? data.reduce((sum, product) => sum + Number(product.price), 0) / totalProducts : 0;
    const lowStockCount = data.filter(product => product.stock < 10).length;
    
    const productTypes = data.reduce((acc, product) => {
      acc[product.product_type] = (acc[product.product_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalProducts,
      totalValue,
      averagePrice,
      lowStockCount,
      productTypes,
      recentProducts: data.slice(-5) // Last 5 products
    };
  }

  // Get products with pagination
  async getProductsPaginated(storeId: string, page: number = 1, limit: number = 10) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        product_variants (*)
      `, { count: 'exact' })
      .eq('store_id', storeId)
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (error) throw error;
    
    return {
      data,
      count: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    };
  }

  // Delete product and its variants
  async deleteWithVariants(productId: string) {
    // Delete variants first (due to foreign key constraint)
    await this.supabase
      .from('product_variants')
      .delete()
      .eq('product_id', productId);
    
    // Delete product
    return this.delete(productId);
  }
}

// Export singleton instance
export const productModel = new ProductModel(); 