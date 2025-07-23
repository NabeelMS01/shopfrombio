import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, ShoppingBag, Users } from "lucide-react";
import dbConnect from "@/lib/mongoose";
import { getUserFromSession } from "@/lib/session";
import Store from "@/models/Store";

// In a real app, you would fetch real data based on the store.
async function getDashboardData(storeId: string) {
  await dbConnect();
  
  // const totalRevenue = await Order.aggregate([...]);
  // const salesCount = await Order.countDocuments({...});
  // const productCount = await Product.countDocuments({ storeId });

  return {
    totalRevenue: 0,
    salesCount: 0,
    productCount: 0,
  };
}

async function getStore(userId: string) {
    await dbConnect();
    const store = await Store.findOne({ userId }).lean();
    return store ? JSON.parse(JSON.stringify(store)) : null;
}

export default async function DashboardPage() {
  const user = await getUserFromSession();

  if (!user) {
    // This should ideally be handled by middleware, but as a fallback
    return (
      <Card>
        <CardHeader>
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>Could not retrieve user session. Please log in again.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const store = await getStore(user._id);
  
  if (!store) {
    // This case should be handled by the layout redirecting to create-store
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Could not load store data. Please create a store first.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const data = await getDashboardData(store._id);
  
  const storeName = store.name || "Your Store";
  const currency = store.currency || 'USD';
  
  const currencySymbol = new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).formatToParts(0).find(p => p.type === 'currency')?.value || '$';

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currencySymbol}{data.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Based on completed sales
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{data.salesCount}</div>
            <p className="text-xs text-muted-foreground">
              Total sales this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.productCount}</div>
            <p className="text-xs text-muted-foreground">
              Total products in store
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Welcome to {storeName}!</CardTitle>
          <CardDescription>
            Here you can manage your products, view sales, and customize your
            store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Use the navigation on the left to get started.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
