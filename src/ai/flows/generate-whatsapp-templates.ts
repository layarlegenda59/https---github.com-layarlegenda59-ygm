'use server';

/**
 * @fileOverview AI-powered WhatsApp message template generator.
 *
 * - generateWhatsAppTemplate - A function that generates customized WhatsApp message templates.
 * - GenerateWhatsAppTemplateInput - The input type for the generateWhatsAppTemplate function.
 * - GenerateWhatsAppTemplateOutput - The return type for the generateWhatsAppTemplate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWhatsAppTemplateInputSchema = z.object({
  scenario: z
    .string()
    .describe(
      'The payment scenario (upcoming, due, overdue) for which the message template is being created.'
    ),
  variableData: z
    .string()
    .describe(
      'Example of variable data to be inserted into the template (e.g., customer name, amount due, due date).'
    ),
  customerProvidedContent: z
    .string()
    .optional()
    .describe(
      'Any customer-provided content or special instructions for the message.'
    ),
});
export type GenerateWhatsAppTemplateInput = z.infer<
  typeof GenerateWhatsAppTemplateInputSchema
>;

const GenerateWhatsAppTemplateOutputSchema = z.object({
  template: z
    .string()
    .describe('The generated WhatsApp message template.'),
});
export type GenerateWhatsAppTemplateOutput = z.infer<
  typeof GenerateWhatsAppTemplateOutputSchema
>;

export async function generateWhatsAppTemplate(
  input: GenerateWhatsAppTemplateInput
): Promise<GenerateWhatsAppTemplateOutput> {
  return generateWhatsAppTemplateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWhatsAppTemplatePrompt',
  input: {schema: GenerateWhatsAppTemplateInputSchema},
  output: {schema: GenerateWhatsAppTemplateOutputSchema},
  prompt: `You are an AI assistant designed to generate effective WhatsApp message templates for payment notifications.

  Based on the given payment scenario, example variable data, and any customer-provided content, create a clear, concise, and professional message template.

  Payment Scenario: {{{scenario}}}
  Variable Data Example: {{{variableData}}}
  Customer Content: {{{customerProvidedContent}}}

  Template:`, // Removed the handlebars comment.
});

const generateWhatsAppTemplateFlow = ai.defineFlow(
  {
    name: 'generateWhatsAppTemplateFlow',
    inputSchema: GenerateWhatsAppTemplateInputSchema,
    outputSchema: GenerateWhatsAppTemplateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
