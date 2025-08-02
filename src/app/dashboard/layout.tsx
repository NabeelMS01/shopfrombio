import React from "react";
import Link from "next/link";
import { Briefcase, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import UserNav from "@/components/UserNav";
import dbConnect from "@/lib/mongoose";
import StoreModel from "@/models/Store";
import UserModel, { IUser } from "@/models/User";
import DashboardNav from "@/components/DashboardNav";
import { getUserFromSession } from "@/lib/session";
import { redirect } from "next/navigation";
import CreateStorePage from "./create-store/page";

async function getStore(userId: string) {
    if (!userId) return null;
    await dbConnect();
    const store = await StoreModel.findOne({ userId }).lean();
    return store ? JSON.parse(JSON.stringify(store)) : null;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromSession();
  if (!user) {
    redirect('/login');
  }
  
  const store = await getStore(user._id);
  
  // This is a way to check the type of the child component being rendered.
  // It's not the most robust method, but it works for this use case.
  const isCreateStorePage = (children as React.ReactElement).type === CreateStorePage;

  if (!store && !isCreateStorePage) {
    redirect('/dashboard/create-store');
  }

  if (store && isCreateStorePage) {
    redirect('/dashboard');
  }

  // If the user is authenticated but has no store, they must create one.
  // We only render the create store page in this case.
  if (!store) {
     return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            {children}
        </div>
     );
  }
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/dashboard"
            className="group flex h-9 w-full items-center justify-start rounded-lg px-3 text-lg font-semibold text-primary-foreground transition-colors md:h-8"
          >
            <Briefcase className="h-6 w-6 text-primary transition-all group-hover:scale-110" />
            <span className="ml-2 text-foreground">ShopFromBio</span>
          </Link>
          <DashboardNav />
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-60">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
             <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="/dashboard"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <Briefcase className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">ShopFromBio</span>
                </Link>
                <DashboardNav isMobile={true} />
              </nav>
            </SheetContent>
          </Sheet>
          <div className="ml-auto flex items-center gap-4">
            <UserNav />
          </div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
