import React from "react";
import Link from "next/link";
import {
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import UserNav from "@/components/UserNav";
import dbConnect from "@/lib/mongoose";
import StoreModel from "@/models/Store";
import DashboardNav from "@/components/DashboardNav";
import { getUserFromSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { PanelLeft } from "lucide-react";
import CreateStorePage from "./create-store/page";


async function getStore(userId: string) {
    if (!userId) return null;
    await dbConnect();
    const store = await StoreModel.findOne({ userId }).lean();
    return store ? JSON.parse(JSON.stringify(store)) : null;
}

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: any;
}) {
  const user = await getUserFromSession();
  if (!user) {
    redirect('/login');
  }
  
  const store = await getStore(user._id);

  if (!store) {
    // If the user has no store, render the Create Store page directly
    // within the context of the main layout, but don't render the dashboard itself.
    return <CreateStorePage />;
  }
  
  // Pass store data to child server components via props.
  // Next.js does this implicitly when pages are rendered inside a layout.
  // We modify the children to inject the prop.
   const childrenWithProps = React.cloneElement(children as React.ReactElement, { store });


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
          {childrenWithProps}
        </main>
      </div>
    </div>
  );
}
