'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { updateStore } from '@/app/actions/store';
import { useToast } from '@/hooks/use-toast';

const initialState = {
  message: '',
  errors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending}>
      {pending ? 'Saving...' : 'Save'}
    </Button>
  );
}

// In a real app, this would be fetched for the user
const mockStoreData = {
  name: "My Awesome Store",
  subdomain: "my-store",
  razorpayKeyId: "",
  theme: "blue",
};

export default function SettingsPage() {
  const [state, formAction] = useActionState(updateStore, initialState);
  const { toast } = useToast();
  const [storeData, setStoreData] = useState(mockStoreData);

  // In a real app, you'd fetch the store data here with useEffect and set it.
  // For now, we'll use mock data.

  useEffect(() => {
    if (state?.message && !state.errors) {
       toast({
        title: "Success",
        description: state.message,
      });
    } else if (state?.message && state.errors) {
       toast({
        title: "Error",
        description: state.message,
        variant: "destructive"
      });
    }
  }, [state, toast]);

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>Store Settings</CardTitle>
          <CardDescription>
            Manage your store settings and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid gap-3">
            <Label htmlFor="name">Store Name</Label>
            <Input id="name" name="name" type="text" defaultValue={storeData.name} />
            {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
          </div>
          <div className="grid gap-3">
            <Label htmlFor="subdomain">Subdomain</Label>
            <div className="flex items-center">
              <Input id="subdomain" name="subdomain" type="text" defaultValue={storeData.subdomain} />
              <span className="ml-2 text-muted-foreground">.shopfrombio.com</span>
            </div>
             {state.errors?.subdomain && <p className="text-sm text-destructive">{state.errors.subdomain[0]}</p>}
          </div>
          <div className="grid gap-3">
            <Label htmlFor="razorpay-key">Razorpay Key ID</Label>
            <Input id="razorpay-key" name="razorpayKeyId" type="text" defaultValue={storeData.razorpayKeyId} placeholder="rzp_test_123..." />
            <p className="text-sm text-muted-foreground">
              Enter your Razorpay Key ID to accept payments.
            </p>
          </div>
          <div className="grid gap-3">
            <Label>Store Theme</Label>
            <RadioGroup name="theme" defaultValue={storeData.theme} className="flex flex-wrap gap-4">
              <div>
                <RadioGroupItem value="blue" id="theme-blue" className="peer sr-only" />
                <Label
                  htmlFor="theme-blue"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500 mb-2"></div>
                  Blue
                </Label>
              </div>
              <div>
                <RadioGroupItem value="green" id="theme-green" className="peer sr-only" />
                <Label
                  htmlFor="theme-green"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="w-8 h-8 rounded-full bg-green-500 mb-2"></div>
                  Green
                </Label>
              </div>
              <div>
                <RadioGroupItem value="red" id="theme-red" className="peer sr-only" />
                <Label
                  htmlFor="theme-red"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="w-8 h-8 rounded-full bg-red-500 mb-2"></div>
                  Red
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}
