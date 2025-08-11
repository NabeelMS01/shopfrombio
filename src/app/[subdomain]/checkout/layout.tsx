import React from "react";
import { getUserFromSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { StoreProvider } from "@/hooks/use-store";

async function getStore(subdomain: string) {
  const { data: store, error } = await supabaseAdmin
    .from('stores')
    .select('*')
    .ilike('subdomain', subdomain)
    .single();
  
  if (error || !store) return null;
  return store;
}

export default async function StoreCheckoutLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { subdomain: string };
}) {
  const { subdomain } = await params;
  const user = await getUserFromSession();
  if (!user) {
    redirect(`/${subdomain}/login?next=/${subdomain}/checkout`);
  }

  const store = await getStore(subdomain);
  if (!store) {
    redirect(`/${subdomain}`);
  }

  return (
    <StoreProvider store={store}>
      {children}
    </StoreProvider>
  );
} 