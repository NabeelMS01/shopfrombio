import React from "react";
import { getUserFromSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";

async function getStore(userId: string) {
  if (!userId) return null;
  const { data: store } = await supabaseAdmin
    .from('stores')
    .select('*')
    .eq('user_id', userId)
    .single();
  return store;
}

export default async function NoShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromSession();
  if (!user) {
    redirect('/login');
  }
  const store = await getStore(user.id);
  if (store) {
    redirect('/dashboard');
  }
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {children}
    </div>
  );
} 