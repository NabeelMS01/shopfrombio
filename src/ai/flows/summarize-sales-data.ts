'use server';

/**
 * @fileOverview Summarizes sales data for store owners using GenAI.
 *
 * - summarizeSalesData - A function that summarizes sales data.
 * - SummarizeSalesDataInput - The input type for the summarizeSalesData function.
 * - SummarizeSalesDataOutput - The return type for the summarizeSalesData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeSalesDataInputSchema = z.object({
  salesData: z
    .string()
    .describe("The sales data to summarize, in JSON format.  Include fields such as product name, quantity sold, and price."),
});
export type SummarizeSalesDataInput = z.infer<typeof SummarizeSalesDataInputSchema>;

const SummarizeSalesDataOutputSchema = z.object({
  summary: z.string().describe('A summarized view of the sales data.'),
});
export type SummarizeSalesDataOutput = z.infer<typeof SummarizeSalesDataOutputSchema>;

export async function summarizeSalesData(input: SummarizeSalesDataInput): Promise<SummarizeSalesDataOutput> {
  return summarizeSalesDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeSalesDataPrompt',
  input: {schema: SummarizeSalesDataInputSchema},
  output: {schema: SummarizeSalesDataOutputSchema},
  prompt: `You are an expert sales data analyst.

You will receive sales data and provide a concise summary of the store\'s performance, identifying key trends and insights.

Sales Data: {{{salesData}}}

Summary:
`,
});

const summarizeSalesDataFlow = ai.defineFlow(
  {
    name: 'summarizeSalesDataFlow',
    inputSchema: SummarizeSalesDataInputSchema,
    outputSchema: SummarizeSalesDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
