import React from "react";
import { getUserFromSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function StoreCheckoutLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { subdomain: string };
}) {
  const user = await getUserFromSession();
  if (!user) {
    redirect(`/${params.subdomain}/login?next=/${params.subdomain}/checkout`);
  }
  return <>{children}</>;
} 