"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Send } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { debtors, templates } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  debtorId: z.string().min(1, "Silakan pilih debitur."),
  templateId: z.string().min(1, "Silakan pilih template."),
  sendAt: z.date({
    required_error: "Tanggal pengiriman harus diisi.",
  }),
});

export function NotificationScheduler() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Notifikasi Dijadwalkan!",
      description: `Pesan akan dikirim ke ${debtors.find(d => d.id === values.debtorId)?.name} pada ${format(values.sendAt, "PPP", { locale: id })}.`,
    });
    form.reset({ debtorId: '', templateId: '', sendAt: undefined });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-lg mx-auto">
        <FormField
          control={form.control}
          name="debtorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Debitur</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih debitur untuk notifikasi" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {debtors.map(debtor => (
                    <SelectItem key={debtor.id} value={debtor.id}>
                      {debtor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="templateId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template Pesan</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih template pesan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {templates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sendAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Tanggal Kirim</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: id })
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                    initialFocus
                    locale={id}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          <Send className="mr-2 h-4 w-4" />
          Jadwalkan Notifikasi
        </Button>
      </form>
    </Form>
  );
}
