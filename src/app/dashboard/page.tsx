import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, ShoppingBag, Users } from "lucide-react";
import dbConnect from "@/lib/mongoose";
import Store from "@/models/Store";

// Placeholder for getting user ID from session
async function getUserId() {
    const User = (await import('@/models/User')).default;
    await dbConnect();
    const user = await User.findOne().sort({_id: -1});
    return user?._id;
}

async function getDashboardData() {
  await dbConnect();
  const userId = await getUserId();
  if (!userId) return null;

  const store = await Store.findOne({ userId }).lean();
  
  // In a real app, you would fetch real data.
  // const totalRevenue = await Order.aggregate([...]);
  // const salesCount = await Order.countDocuments({...});
  // const productCount = await Product.countDocuments({...});

  return {
    store,
    totalRevenue: 0,
    salesCount: 0,
    productCount: 0,
  };
}


export default async function DashboardPage() {
  const data = await getDashboardData();
  
  // If there's no data or no store, we still render the page but maybe with a different message or zeros.
  const storeName = data?.store?.name || "Your Store";
  const currency = data?.store?.currency || 'USD';
  const totalRevenue = data?.totalRevenue || 0;
  const salesCount = data?.salesCount || 0;
  const productCount = data?.productCount || 0;
  
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
            <div className="text-2xl font-bold">{currencySymbol}{totalRevenue.toFixed(2)}</div>
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
            <div className="text-2xl font-bold">+{salesCount}</div>
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
            <div className="text-2xl font-bold">{productCount}</div>
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
