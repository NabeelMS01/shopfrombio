import Image from "next/image";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import StoreHeader from "@/components/StoreHeader";
import StoreFooter from "@/components/StoreFooter";
import ProductCard from "@/components/ProductCard";

async function getStore(subdomain: string) {
  // Get store by subdomain
  const { data: store } = await supabase
    .from('stores')
    .select('*')
    .eq('subdomain', subdomain)
    .single();
    
  if (!store) {
    return null;
  }
  
  // Get products for this store
  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      product_variants (
        variant_type,
        variant_name,
        stock
      )
    `)
    .eq('store_id', store.id);
  
  return { ...store, products: products || [] };
}

type StorePageParams = {
  params: {
    subdomain: string;
  };
};

export default async function StorePage({ params }: StorePageParams) {
  const store = await getStore(params.subdomain);

  if (!store) {
    notFound();
  }
  
  const currencySymbol = new Intl.NumberFormat('en-US', { style: 'currency', currency: store.currency || 'USD' }).formatToParts(0).find(p => p.type === 'currency')?.value || '$';

  return (
    <div className="flex flex-col min-h-screen">
      <StoreHeader storeName={store.name} />
      <main className="flex-1">
        <section className="w-full h-[50vh] bg-muted flex items-center justify-center">
            <div className="container px-4 md:px-6 text-center">
                <h1 className="text-4xl font-bold tracking-tight lg:text-6xl font-headline">{store.name}</h1>
                <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl mt-4">
                    Welcome! Discover our amazing collection of products.
                </p>
            </div>
        </section>
        <section className="py-12 md:py-20 lg:py-24">
            <div className="container px-4 md:px-6">
                 <h2 className="text-3xl font-bold tracking-tight text-center mb-10">Our Products</h2>
                {store.products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {store.products.map((product: any) => (
                        <ProductCard key={product.id} product={product} currencySymbol={currencySymbol} />
                    ))}
                </div>
                ) : (
                <div className="text-center py-16 border rounded-lg">
                    <h2 className="text-2xl font-semibold">No products yet</h2>
                    <p className="text-muted-foreground mt-2">Check back soon to see what we have in store!</p>
                </div>
                )}
            </div>
        </section>
      </main>
      <StoreFooter storeName={store.name} />
    </div>
  );
}
