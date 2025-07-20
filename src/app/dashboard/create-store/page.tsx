'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createStore } from '@/app/actions/store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const initialState = {
  message: '',
  errors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" aria-disabled={pending}>
      {pending ? 'Creating Store...' : 'Create Store'}
    </Button>
  );
}


export default function CreateStorePage() {
  const [state, formAction] = useActionState(createStore, initialState);

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Create Your Store</CardTitle>
          <CardDescription>
            Let's get your store set up. Fill in the details below to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Store Name</Label>
              <Input id="name" name="name" placeholder="My Awesome Store" required />
              {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="subdomain">Subdomain</Label>
               <div className="flex items-center">
                <Input id="subdomain" name="subdomain" type="text" placeholder="my-store" />
                <span className="ml-2 text-muted-foreground">.shopfrombio.com</span>
              </div>
              {state.errors?.subdomain && <p className="text-sm text-destructive">{state.errors.subdomain[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Store Currency</Label>
               <Select name="currency" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - United States Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                  <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                </SelectContent>
              </Select>
               {state.errors?.currency && <p className="text-sm text-destructive">{state.errors.currency[0]}</p>}
            </div>

            {state.message && <p className="text-sm text-destructive text-center">{state.message}</p>}
            
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
