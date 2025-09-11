
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
import { Collateral } from '@/lib/types';
import { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { debtors } from '@/lib/data';

const formSchema = z.object({
  debtorId: z.string({ required_error: "Debitur harus dipilih." }),
  debtorName: z.string(), // This will be set based on debtorId
  type: z.enum(['car', 'motor'], { required_error: "Tipe agunan harus dipilih." }),
  description: z.string().min(5, 'Deskripsi minimal 5 karakter.'),
  value: z.coerce.number().min(0, 'Nilai tidak boleh negatif.'),
  serialNumber: z.string().optional(),
});

type CollateralFormValues = z.infer<typeof formSchema>;

interface CollateralFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CollateralFormValues) => void;
  collateral: Collateral | null;
}

export function CollateralFormSheet({ isOpen, onClose, onSubmit, collateral }: CollateralFormSheetProps) {
  const form = useForm<CollateralFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      debtorId: '',
      debtorName: '',
      type: 'car',
      description: '',
      value: 0,
      serialNumber: '',
    },
  });

  useEffect(() => {
    if (collateral) {
      form.reset(collateral);
    } else {
      form.reset({
        debtorId: '',
        debtorName: '',
        type: 'car',
        description: '',
        value: 0,
        serialNumber: '',
      });
    }
  }, [collateral, form, isOpen]);
  
  const handleDebtorChange = (debtorId: string) => {
    const selectedDebtor = debtors.find(d => d.id === debtorId);
    form.setValue('debtorId', debtorId);
    form.setValue('debtorName', selectedDebtor?.name || '');
  }

  const handleSubmit = (values: CollateralFormValues) => {
    const selectedDebtor = debtors.find(d => d.id === values.debtorId);
    // Ensure debtorName is in sync before submitting
    const dataToSubmit = {
        ...values,
        debtorName: selectedDebtor?.name || values.debtorName,
    }
    onSubmit(dataToSubmit);
  };
  
  const title = collateral ? 'Ubah Agunan' : 'Tambah Agunan Baru';
  const description = collateral ? 'Perbarui informasi agunan di bawah ini.' : 'Isi form di bawah untuk menambah agunan baru.';

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col h-full">
            <SheetHeader>
              <SheetTitle>{title}</SheetTitle>
              <SheetDescription>{description}</SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto py-6 space-y-4">
              <FormField
                control={form.control}
                name="debtorId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Debitur</FormLabel>
                        <Select onValueChange={handleDebtorChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih debitur..." />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {debtors.map(debtor => (
                                    <SelectItem key={debtor.id} value={debtor.id}>{debtor.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
                />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tipe Agunan</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih tipe..." />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="car">Mobil</SelectItem>
                                <SelectItem value="motor">Motor</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
                />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. Toyota Avanza 2022 Hitam" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Seri / Rangka</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. MH1JF511XHJ12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimasi Nilai (Rp)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="cth. 150000000" {...field} />
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
