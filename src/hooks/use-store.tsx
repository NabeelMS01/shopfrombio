'use client';

import { createContext, useContext, ReactNode } from 'react';

type Store = {
  id: string;
  name: string;
  subdomain: string;
  currency: string;
  // Add other store fields as needed
};

type StoreContextType = {
  store: Store | null;
  currencySymbol: string;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ 
  children, 
  store 
}: { 
  children: ReactNode;
  store: Store;
}) {
  const currencySymbol = new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: store.currency || 'USD' 
  })
    .formatToParts(0)
    .find(p => p.type === 'currency')?.value || '$';

  return (
    <StoreContext.Provider value={{ store, currencySymbol }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
} 