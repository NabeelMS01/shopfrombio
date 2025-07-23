import dbConnect from "@/lib/mongoose";
import Product from "@/models/Product";
import Store from "@/models/Store";
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

// This is a placeholder for getting the current user's ID
async function getUserId() {
  const User = (await import('@/models/User')).default;
  await dbConnect();
  const user = await User.findOne().sort({_id: -1});
  return user?._id;
}


async function getProducts() {
  const userId = await getUserId();
  if (!userId) return { products: [], storeCurrency: 'USD' };

  await dbConnect();
  const store = await Store.findOne({ userId }).lean();
  if (!store) return { products: [], storeCurrency: 'USD' };

  const products = await Product.find({ storeId: store._id }).lean();

  return { 
    products: JSON.parse(JSON.stringify(products)),
    storeCurrency: store.currency || 'USD'
  };
}


export default async function ProductsPage() {
  const { products, storeCurrency } = await getProducts();
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
