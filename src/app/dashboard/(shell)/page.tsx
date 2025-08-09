import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, ShoppingBag, Users } from "lucide-react";
import { getUserFromSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";
import { redirect } from "next/navigation";

async function getStore(userId: string) {
  if (!userId) return null;
  const { data: store } = await supabaseAdmin
    .from('stores')
    .select('*')
    .eq('user_id', userId)
    .single();
  return store;
}

async function getProducts(storeId: string) {
  const { data: products } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('store_id', storeId)
    .order('created_at', { ascending: false })
    .limit(5);
  return products || [];
}

export default async function OverviewPage() {
  const user = await getUserFromSession();
  if (!user) redirect('/login');

  const store = await getStore(user.id);
  if (!store) redirect('/dashboard/create-store');

  // Basic KPIs (placeholder values for revenue/sales; real app would compute)
  const { count: productCount } = await supabaseAdmin
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('store_id', store.id);

  const totalRevenue = 0;
  const salesCount = 0;
  const recentProducts = await getProducts(store.id);

  const currency = store.currency || 'USD';
  const currencySymbol = new Intl.NumberFormat('en-US', { style: 'currency', currency }).formatToParts(0).find(p => p.type === 'currency')?.value || '$';

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currencySymbol}{totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Based on completed sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{salesCount}</div>
            <p className="text-xs text-muted-foreground">Total sales this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productCount || 0}</div>
            <p className="text-xs text-muted-foreground">Total products in store</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome to {store.name}!</CardTitle>
          <CardDescription>Here you can manage products, view sales, and customize your store.</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Products</CardTitle>
          <CardDescription>Last 5 added products</CardDescription>
        </CardHeader>
        <CardContent>
          {recentProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No products yet.</p>
          ) : (
            <ul className="space-y-2">
              {recentProducts.map((p: any) => (
                <li key={p.id} className="flex items-center justify-between">
                  <span className="font-medium">{p.title}</span>
                  <span className="text-muted-foreground">{currencySymbol}{Number(p.price).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </>
  );
} 