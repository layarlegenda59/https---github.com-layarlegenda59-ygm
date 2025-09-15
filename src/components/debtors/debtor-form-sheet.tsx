'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
  phone: z.string().optional(),
  police_number: z.string().nullable().optional(),
  stnk_number: z.string().nullable().optional(),
  vehicle_type: z.string().nullable().optional(),
  vehicle_color: z.string().nullable().optional(),
  vehicle_year: z.coerce.number().nullable().optional(),
  total_debt: z.coerce.number().min(0, 'Total utang tidak boleh negatif.'),
  due_date: z.date({ required_error: 'Tanggal jatuh tempo leasing harus diisi.' }),
  funder_due_date: z.date({ required_error: 'Tanggal jatuh tempo pendana harus diisi.' }),
  leasing_bpkb: z.string().nullable().optional(),
  funder: z.string().nullable().optional(),
  status: z.enum(['paid', 'due', 'overdue', 'takeover']),
});

type DebtorFormValues = z.infer<typeof formSchema>;

interface DebtorFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Debtor, 'id' | 'created_at'>) => void;
  debtor: Debtor | null;
}

export function DebtorFormSheet({ isOpen, onClose, onSubmit, debtor }: DebtorFormSheetProps) {
  const form = useForm<DebtorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      police_number: '',
      stnk_number: '',
      vehicle_type: '',
      vehicle_color: '',
      vehicle_year: null,
      total_debt: 0,
      due_date: new Date(),
      funder_due_date: new Date(),
      leasing_bpkb: '',
      funder: '',
      status: 'due',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (debtor) {
        form.reset({
          ...debtor,
          police_number: debtor.police_number || '',
          stnk_number: debtor.stnk_number || '',
          vehicle_type: debtor.vehicle_type || '',
          vehicle_color: debtor.vehicle_color || '',
          vehicle_year: debtor.vehicle_year || null,
          due_date: new Date(debtor.due_date),
          funder_due_date: new Date(debtor.funder_due_date),
          status: debtor.status,
        });
      } else {
        form.reset({
          name: '',
          phone: '',
          police_number: '',
          stnk_number: '',
          vehicle_type: '',
          vehicle_color: '',
          vehicle_year: null,
          total_debt: 0,
          due_date: new Date(),
          funder_due_date: new Date(),
          leasing_bpkb: '',
          funder: '',
          status: 'due',
        });
      }
    }
  }, [debtor, isOpen, form]);

  const handleSubmit = (values: DebtorFormValues) => {
    const { due_date, funder_due_date, ...rest } = values;
    onSubmit({
      ...rest,
      email: null, // Set email to null since we removed the field
      phone: rest.phone || '',
      police_number: rest.police_number || null,
      stnk_number: rest.stnk_number || null,
      vehicle_type: rest.vehicle_type || null,
      vehicle_color: rest.vehicle_color || null,
      vehicle_year: rest.vehicle_year || null,
      leasing_bpkb: rest.leasing_bpkb || null,
      funder: rest.funder || null,
      due_date: due_date.toISOString(),
      funder_due_date: funder_due_date.toISOString(),
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Telepon <span className="text-muted-foreground font-normal">(opsional)</span></FormLabel>
                    <FormControl>
                      <Input placeholder="cth. 081234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="police_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No. Polisi</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. B 1234 ABC" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stnk_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No. Mesin</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. 1234567890123456" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vehicle_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Kendaraan</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. Honda Beat, Toyota Avanza" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vehicle_color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warna Kendaraan</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. Hitam, Putih, Merah" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vehicle_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tahun Kendaraan</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="cth. 2020" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="total_debt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Utang (Rp)</FormLabel>
                    <FormControl>
                      <Input 
                        type="text" 
                        placeholder="cth. 500,000" 
                        {...field}
                        value={field.value ? field.value.toLocaleString('id-ID') : ''}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d]/g, '');
                          field.onChange(value ? parseInt(value) : 0);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="due_date"
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
                name="funder_due_date"
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
                  name="leasing_bpkb"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Leasing / BPKB</FormLabel>
                      <FormControl>
                        <Input placeholder="cth. ACC" {...field} value={field.value || ''} />
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
                        <Input placeholder="cth. Funder A" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="paid">Lunas</SelectItem>
                        <SelectItem value="due">Jatuh Tempo</SelectItem>
                        <SelectItem value="overdue">Tunggakan</SelectItem>
                        <SelectItem value="takeover">Take Over</SelectItem>
                      </SelectContent>
                    </Select>
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
