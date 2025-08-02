import dbConnect from "@/lib/mongoose";
import Product from "@/models/Product";
import Store from "@/models/Store";
import { getUserFromSession } from "@/lib/session";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProductFormDialog from "@/components/ProductFormDialog";
import { redirect } from "next/navigation";

async function getProducts(storeId: string) {
  if (!storeId) return [];
  await dbConnect();
  const products = await Product.find({ storeId }).lean();
  return JSON.parse(JSON.stringify(products));
}

async function getStore(userId: string) {
    if (!userId) return null;
    await dbConnect();
    const store = await Store.findOne({ userId }).lean();
    return store ? JSON.parse(JSON.stringify(store)) : null;
}

export default async function ProductsPage() {
  const user = await getUserFromSession();
  
  if (!user) {
    redirect('/login');
  }

  const store = await getStore(user._id);
  
  if (!store) {
    // This case should be handled by the layout redirecting to create-store, but as a safeguard.
    return (
      <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Could not load store data. Ensure a store is created.</CardDescription>
          </CardHeader>
      </Card>
    );
  }

  const products = await getProducts(store._id);
  const storeCurrency = store.currency || 'USD';
  const currencySymbol = new Intl.NumberFormat('en-US', { style: 'currency', currency: storeCurrency }).formatToParts(0).find(p => p.type === 'currency')?.value || '$';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Products</CardTitle>
            <CardDescription>
              Manage your products and view their sales performance.
            </CardDescription>
          </div>
          <ProductFormDialog />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="hidden md:table-cell">Price</TableHead>
              <TableHead className="hidden md:table-cell">
                Stock
              </TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? products.map((product: any) => (
              <TableRow key={product._id}>
                <TableCell className="hidden sm:table-cell">
                  <Image
                    alt="Product image"
                    className="aspect-square rounded-md object-cover"
                    height="48"
                    src={product.images?.[0] || 'https://placehold.co/48x48.png'}
                    width="48"
                    data-ai-hint="product clothing"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.title}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {product.productType}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {currencySymbol}{product.price}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {product.stock}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <ProductFormDialog product={product}>
                         <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                           Edit
                         </DropdownMenuItem>
                      </ProductFormDialog>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No products found. Start by adding a new product.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
