"use client";

import { useState } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CreateStorePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [currency, setCurrency] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setErrors({});

    const formData = new FormData(e.currentTarget);
    formData.set('currency', currency);

    try {
      const response = await fetch('/api/create-store', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        window.location.href = '/dashboard';
      } else {
        setMessage(result.message || 'Something went wrong');
        setErrors(result.errors || {});
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Store Name</Label>
              <Input id="name" name="name" placeholder="My Awesome Store" required />
              {errors?.name && <p className="text-sm text-destructive">{errors.name[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="subdomain">Subdomain</Label>
              <div className="flex items-center">
                <Input id="subdomain" name="subdomain" type="text" placeholder="my-store" />
                <span className="ml-2 text-muted-foreground">.shopfrombio.com</span>
              </div>
              {errors?.subdomain && <p className="text-sm text-destructive">{errors.subdomain[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Store Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
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
              {errors?.currency && <p className="text-sm text-destructive">{errors.currency[0]}</p>}
            </div>

            {message && <p className="text-sm text-destructive text-center">{message}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating Store...' : 'Create Store'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 