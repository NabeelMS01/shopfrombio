import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongoose";
import Store from "@/models/Store";
// Assuming a Product model exists
// import Product from "@/models/Product";

// Helper function to get store data
async function getStore(subdomain: string) {
  await dbConnect();
  const store = await Store.findOne({ subdomain }).lean();
  if (!store) {
    return null;
  }
  // In a real app, you'd fetch actual products for the store
  // const products = await Product.find({ storeId: store._id }).lean();
  const products: any[] = []; // Using empty array as we don't have a product model yet.
  
  return { ...store, products };
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
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl font-headline">{store.name}</h1>
        <p className="text-muted-foreground mt-2">Welcome to our store!</p>
      </header>
      <main>
        {store.products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {store.products.map((product: any) => (
              <Card key={product.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  <Image
                    src={product.image || "https://placehold.co/600x400.png"}
                    alt={product.name}
                    width={600}
                    height={400}
                    className="object-cover w-full h-48"
                    data-ai-hint="product fashion"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="text-primary font-semibold mt-1">
                    {currencySymbol}{product.price}
                  </CardDescription>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full">Buy Now</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border rounded-lg">
            <h2 className="text-2xl font-semibold">No products yet</h2>
            <p className="text-muted-foreground mt-2">Check back soon to see what we have in store!</p>
          </div>
        )}
      </main>
      <footer className="text-center mt-16 py-6 border-t">
        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} {store.name}</p>
      </footer>
    </div>
  );
}
