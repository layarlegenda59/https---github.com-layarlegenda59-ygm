"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GenerateWhatsAppTemplateOutput } from "@/ai/flows/generate-whatsapp-templates";
import { Wand2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  scenario: z.enum(["upcoming", "due", "overdue"], {
    required_error: "You need to select a scenario.",
  }),
  variableData: z.string().min(10, "Please provide more example data."),
  customerProvidedContent: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export function TemplateGenerator() {
  const [generatedTemplate, setGeneratedTemplate] = useState<GenerateWhatsAppTemplateOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableData: "Customer Name: John Smith, Amount: $150.00, Due Date: August 25, 2024",
      customerProvidedContent: "",
    },
  });
  
  const onSubmit = async (values: FormSchema) => {
    setIsGenerating(true);
    setGeneratedTemplate(null);
    try {
        const response = await fetch('/api/genkit/flow/generateWhatsAppTemplateFlow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input: values }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Something went wrong");
        }
        
        const result = await response.json();
        setGeneratedTemplate(result.output);
        toast({ title: "Template Generated!", description: "The AI has created a new template for you." });

    } catch (error: any) {
        console.error(error);
        toast({ variant: 'destructive', title: "Generation Failed", description: error.message || "Could not generate template. Please try again." });
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <Wand2 className="text-primary"/>
            AI Template Generator
        </CardTitle>
        <CardDescription>
          Create customized message templates with variable data using AI.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="scenario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Scenario</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a payment scenario" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming Payment</SelectItem>
                      <SelectItem value="due">Payment Due</SelectItem>
                      <SelectItem value="overdue">Payment Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="variableData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Example Variable Data</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Customer Name: John, Amount: $50" {...field} />
                  </FormControl>
                  <FormDescription>Provide an example of data for placeholders.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerProvidedContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Instructions (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Mention our new loyalty program." {...field} />
                  </FormControl>
                  <FormDescription>Any specific content you want to include.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isGenerating}>
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              Generate Template
            </Button>
          </form>
        </Form>
        {generatedTemplate && (
            <div className="mt-8">
                <h3 className="font-semibold mb-2">Generated Template:</h3>
                <div className="text-sm bg-secondary p-4 rounded-md whitespace-pre-wrap font-mono">
                    {generatedTemplate.template}
                </div>
                 <Button className="w-full mt-4">Save Template</Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
