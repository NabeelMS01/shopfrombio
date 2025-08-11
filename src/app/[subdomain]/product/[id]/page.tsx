import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { StoreProvider } from "@/hooks/use-store";
import ProductDetails from "@/components/ProductDetails";

export const dynamic = 'force-dynamic';

async function getStore(subdomain: string) {
  const { data: store, error } = await supabase
    .from('stores')
    .select('*')
    .ilike('subdomain', subdomain)
    .single();
  
  if (error || !store) return null;
  return store;
}

async function getProduct(productId: string, storeId: string) {
  console.log('Fetching product:', { productId, storeId });
  
  // First try to get the product without store_id constraint to see if it exists
  const { data: productCheck, error: checkError } = await supabase
    .from('products')
    .select('id, store_id, title')
    .eq('id', productId)
    .single();

  if (checkError) {
    console.error('Product check error:', checkError);
    return null;
  }

  console.log('Product check result:', productCheck);

  if (productCheck.store_id !== storeId) {
    console.error('Product store mismatch:', { 
      productStoreId: productCheck.store_id, 
      requestedStoreId: storeId 
    });
    return null;
  }

  // Now get the full product with variants
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      product_variants (
        id,
        variant_type,
        variant_name,
        stock
      )
    `)
    .eq('id', productId)
    .eq('store_id', storeId)
    .single();

  if (error) {
    console.error('Product fetch error:', error);
    return null;
  }
  
  console.log('Product found:', product);
  return product;
}

type ProductPageParams = { 
  params: { 
    subdomain: string;
    id: string;
  } 
};

export default async function ProductPage({ params }: ProductPageParams) {
  const { subdomain, id } = await params;
  const store = await getStore(subdomain);
  if (!store) notFound();

  const product = await getProduct(id, store.id);
  if (!product) notFound();

  return (
    <StoreProvider store={store}>
      <div className="bg-background min-h-screen">
        <ProductDetails product={product} />
      </div>
    </StoreProvider>
  );
} 