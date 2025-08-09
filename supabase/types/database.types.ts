// Types: database.types.ts
// Description: TypeScript types for database schema
// Date: 2024-01-01

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          password: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          email: string;
          password: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          password?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      stores: {
        Row: {
          id: string;
          name: string;
          subdomain: string;
          user_id: string;
          currency: string;
          razorpay_key_id: string | null;
          theme: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          subdomain: string;
          user_id: string;
          currency?: string;
          razorpay_key_id?: string | null;
          theme?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          subdomain?: string;
          user_id?: string;
          currency?: string;
          razorpay_key_id?: string | null;
          theme?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          store_id: string;
          title: string;
          description: string | null;
          price: number;
          cost: number | null;
          discount_type: 'percentage' | 'amount' | null;
          discount_value: number | null;
          stock: number;
          product_type: 'product' | 'service';
          images: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          store_id: string;
          title: string;
          description?: string | null;
          price: number;
          cost?: number | null;
          discount_type?: 'percentage' | 'amount' | null;
          discount_value?: number | null;
          stock: number;
          product_type: 'product' | 'service';
          images?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          store_id?: string;
          title?: string;
          description?: string | null;
          price?: number;
          cost?: number | null;
          discount_type?: 'percentage' | 'amount' | null;
          discount_value?: number | null;
          stock?: number;
          product_type?: 'product' | 'service';
          images?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          variant_type: string;
          variant_name: string;
          stock: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          variant_type: string;
          variant_name: string;
          stock?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          variant_type?: string;
          variant_name?: string;
          stock?: number | null;
          created_at?: string;
        };
      };
    };
    Functions: {
      get_store_stats: {
        Args: {
          store_uuid: string;
        };
        Returns: {
          total_products: number;
          total_revenue: number;
          total_sales: number;
        }[];
      };
      search_products: {
        Args: {
          search_term: string;
          store_uuid: string;
        };
        Returns: {
          id: string;
          title: string;
          description: string;
          price: number;
          product_type: string;
        }[];
      };
    };
  };
} 