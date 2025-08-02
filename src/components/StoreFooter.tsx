import Link from "next/link";

export default function StoreFooter({ storeName }: { storeName: string }) {
  return (
    <footer className="bg-muted border-t">
        <div className="container mx-auto px-4 md:px-6 py-6 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} {storeName}. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 sm:mt-0">
                <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
                    Terms of Service
                </Link>
                <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
                    Privacy
                </Link>
            </div>
        </div>
    </footer>
  );
}
