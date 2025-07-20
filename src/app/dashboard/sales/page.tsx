import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import SalesSummary from "@/components/SalesSummary";

const mockSales = [
    {
        id: "1",
        customer: "Liam Johnson",
        email: "liam@example.com",
        product: "Classic T-Shirt",
        price: "$25.00",
        date: "2023-06-23",
        status: "Fulfilled"
    },
    {
        id: "2",
        customer: "Olivia Smith",
        email: "olivia@example.com",
        product: "Modern Hoodie",
        price: "$55.00",
        date: "2023-06-24",
        status: "Fulfilled"
    },
    {
        id: "3",
        customer: "Noah Williams",
        email: "noah@example.com",
        product: "Designer Jeans",
        price: "$120.00",
        date: "2023-06-25",
        status: "Pending"
    },
    {
        id: "4",
        customer: "Emma Brown",
        email: "emma@example.com",
        product: "Classic T-Shirt",
        price: "$25.00",
        date: "2023-06-26",
        status: "Fulfilled"
    },
];

export default function SalesPage() {
    const salesDataForAI = JSON.stringify(mockSales.map(s => ({
        productName: s.product,
        quantitySold: 1, // Mocking quantity
        price: parseFloat(s.price.replace('$', '')),
        date: s.date
    })));

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <SalesSummary salesData={salesDataForAI} />
      <Card>
        <CardHeader className="px-7">
          <CardTitle>Orders</CardTitle>
          <CardDescription>Recent orders from your store.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden sm:table-cell">Product</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>
                    <div className="font-medium">{sale.customer}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {sale.email}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{sale.product}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge className="text-xs" variant={sale.status === "Fulfilled" ? "default" : "secondary"}>
                      {sale.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{sale.date}</TableCell>
                  <TableCell className="text-right">{sale.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
