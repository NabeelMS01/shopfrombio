import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Briefcase, Zap, Palette } from "lucide-react";
import ClientHeader from "@/components/ClientHeader";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  // If the request is for a subdomain host (like foo.localhost), redirect to /[subdomain]
  const host = (await headers()).get('host') || '';
  const h = host.split(':')[0];
  if ((h.endsWith('.localhost') && h !== 'localhost') || (h.endsWith('.lvh.me') && h !== 'lvh.me')) {
    const sub = h.split('.')[0];
    redirect(`/${sub}`);
  }


  return (
    <div className="flex flex-col min-h-screen">
      <ClientHeader />
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Build your store and start selling
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    This application helps you build your own store and start selling your products or services, like a shop from your bio link.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/signup">Get Started Now</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Briefcase className="h-48 w-48 text-primary/20" strokeWidth={1} />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  Everything You Need to Succeed
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From product management to sales insights, we've got you covered.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
              <div className="grid gap-1 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold font-headline">Custom Subdomains</h3>
                <p className="text-sm text-muted-foreground">
                  Get a unique address for your store and build your brand.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold font-headline">Direct Payments</h3>
                <p className="text-sm text-muted-foreground">
                  Connect your Razorpay account and get paid directly by customers.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Palette className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold font-headline">Theme Customization</h3>
                <p className="text-sm text-muted-foreground">
                  Customize the look and feel of your store to match your brand.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} ShopFromBio. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
