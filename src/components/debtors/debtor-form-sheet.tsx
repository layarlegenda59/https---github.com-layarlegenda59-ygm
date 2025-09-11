
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Debtor } from '@/lib/types';
import { useEffect } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';

const formSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter.'),
  email: z.string().email('Format email tidak valid.').optional().or(z.literal('')),
  phone: z.string().min(10, 'Nomor telepon minimal 10 digit.'),
  totalDebt: z.coerce.number().min(0, 'Total utang tidak boleh negatif.'),
  dueDate: z.date({ required_error: 'Tanggal jatuh tempo leasing harus diisi.' }),
  funderDueDate: z.date({ required_error: 'Tanggal jatuh tempo pendana harus diisi.' }),
  leasingBpkb: z.string().optional(),
  funder: z.string().optional(),
});

type DebtorFormValues = z.infer<typeof formSchema>;

interface DebtorFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Debtor, 'id' | 'status' | 'created_at'>) => void;
  debtor: Debtor | null;
}

export function DebtorFormSheet({ isOpen, onClose, onSubmit, debtor }: DebtorFormSheetProps) {
  const form = useForm<DebtorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      totalDebt: 0,
      leasingBpkb: '',
      funder: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (debtor) {
        form.reset({
          ...debtor,
          dueDate: new Date(debtor.dueDate),
          funderDueDate: new Date(debtor.funderDueDate),
        });
      } else {
        form.reset({
          name: '',
          email: '',
          phone: '',
          totalDebt: 0,
          dueDate: new Date(),
          funderDueDate: new Date(),
          leasingBpkb: '',
          funder: '',
        });
      }
    }
  }, [debtor, isOpen, form]);

  const handleSubmit = (values: DebtorFormValues) => {
    const { dueDate, funderDueDate, ...rest } = values;
    onSubmit({
      ...rest,
      dueDate: dueDate.toISOString(),
      funderDueDate: funderDueDate.toISOString(),
    });
  };
  
  const title = debtor ? 'Ubah Debitur' : 'Tambah Debitur Baru';
  const description = debtor ? 'Perbarui informasi debitur di bawah ini.' : 'Isi form di bawah untuk menambah debitur baru.';

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col h-full">
            <SheetHeader>
              <SheetTitle>{title}</SheetTitle>
              <SheetDescription>{description}</SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto py-6 space-y-4 pr-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Telepon</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. 081234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="totalDebt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Utang (Rp)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="cth. 500000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Jatuh Tempo Leasing</FormLabel>
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
                            initialFocus
                            locale={id}
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="funderDueDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Jatuh Tempo Pendana</FormLabel>
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
                            initialFocus
                            locale={id}
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                  control={form.control}
                  name="leasingBpkb"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Leasing / BPKB</FormLabel>
                      <FormControl>
                        <Input placeholder="cth. ACC" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="funder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pendana</FormLabel>
                      <FormControl>
                        <Input placeholder="cth. Funder A" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <SheetFooter>
                <SheetClose asChild>
                    <Button type="button" variant="outline">Batal</Button>
                </SheetClose>
                <Button type="submit">Simpan</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
