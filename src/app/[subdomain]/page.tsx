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

// Mock data, in a real app this would come from a database
const stores = {
  "my-store": {
    name: "My Awesome Store",
    products: [
      { id: 1, name: "Cool T-Shirt", price: "$29.99", image: "https://placehold.co/600x400.png", hint: "tshirt fashion" },
      { id: 2, name: "Awesome Hoodie", price: "$59.99", image: "https://placehold.co/600x400.png", hint: "hoodie fashion" },
      { id: 3, name: "Stylish Cap", price: "$19.99", image: "https://placehold.co/600x400.png", hint: "cap fashion" },
      { id: 4, name: "Comfy Socks", price: "$9.99", image: "https://placehold.co/600x400.png", hint: "socks fashion" },
    ],
  },
  "another-shop": {
    name: "Another Fine Shop",
    products: [
      { id: 1, name: "Handmade Mug", price: "$15.00", image: "https://placehold.co/600x400.png", hint: "mug coffee" },
      { id: 2, name: "Artisan Coffee Beans", price: "$22.00", image: "https://placehold.co/600x400.png", hint: "coffee beans" },
    ],
  },
};

type StorePageParams = {
  params: {
    subdomain: string;
  };
};

export default function StorePage({ params }: StorePageParams) {
  const store = stores[params.subdomain as keyof typeof stores];

  if (!store) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl font-headline">{store.name}</h1>
        <p className="text-muted-foreground mt-2">Welcome to our store!</p>
      </header>
      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {store.products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={600}
                  height={400}
                  className="object-cover w-full h-48"
                  data-ai-hint={product.hint}
                />
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription className="text-primary font-semibold mt-1">{product.price}</CardDescription>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full">Buy Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
      <footer className="text-center mt-16 py-6 border-t">
        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} {store.name}</p>
      </footer>
    </div>
  );
}
