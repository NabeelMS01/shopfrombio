import { CartProvider } from '@/hooks/use-cart';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="bg-background min-h-screen">{children}</div>
    </CartProvider>
  );
}
