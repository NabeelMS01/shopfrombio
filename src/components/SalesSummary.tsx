'use client';

import { useState } from 'react';
import { summarizeSalesData } from '@/ai/flows/summarize-sales-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from './ui/skeleton';

interface SalesSummaryProps {
  salesData: string;
}

export default function SalesSummary({ salesData }: SalesSummaryProps) {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = async () => {
    setIsLoading(true);
    setError('');
    setSummary('');
    try {
      const result = await summarizeSalesData({ salesData });
      setSummary(result.summary);
    } catch (e) {
      setError('Failed to generate summary. Please try again.');
      console.error(e);
    }
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Summary</CardTitle>
        <CardDescription>
          Get an AI-powered summary of your sales trends and key insights.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : summary ? (
          <p className="text-sm text-muted-foreground">{summary}</p>
        ) : (
            <p className="text-sm text-muted-foreground">Click the button below to generate your sales summary.</p>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSummarize} disabled={isLoading}>
          <Wand2 className="mr-2 h-4 w-4" />
          {isLoading ? 'Generating...' : 'Generate Summary'}
        </Button>
      </CardFooter>
    </Card>
  );
}
