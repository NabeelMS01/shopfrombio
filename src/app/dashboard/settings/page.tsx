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

export default function SettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Store Settings</CardTitle>
        <CardDescription>
          Manage your store settings and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid gap-3">
          <Label htmlFor="store-name">Store Name</Label>
          <Input id="store-name" type="text" placeholder="My Awesome Store" />
          <p className="text-sm text-muted-foreground">
            This is the name of your store.
          </p>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="subdomain">Subdomain</Label>
          <div className="flex items-center">
            <Input id="subdomain" type="text" placeholder="my-store" />
            <span className="ml-2 text-muted-foreground">.bioshop.com</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Your store will be available at this subdomain.
          </p>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="razorpay-key">Razorpay Key ID</Label>
          <Input id="razorpay-key" type="text" placeholder="rzp_test_123..." />
          <p className="text-sm text-muted-foreground">
            Enter your Razorpay Key ID to accept payments.
          </p>
        </div>
        <div className="grid gap-3">
          <Label>Store Theme</Label>
          <RadioGroup defaultValue="blue" className="flex flex-wrap gap-4">
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
        <Button>Save</Button>
      </CardFooter>
    </Card>
  );
}
