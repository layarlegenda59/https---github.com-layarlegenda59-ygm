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
import { Collateral, Debtor } from '@/lib/types';
import { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

const formSchema = z.object({
  debtorId: z.string().min(1, 'Debitur harus dipilih.'),
  type: z.enum(['vehicle', 'lease'], { required_error: 'Jenis agunan harus dipilih.' }),
  description: z.string().min(5, 'Deskripsi minimal 5 karakter.'),
  value: z.coerce.number().min(1, 'Nilai agunan tidak boleh kosong.'),
  serialNumber: z.string().optional(),
  address: z.string().optional(),
});

type CollateralFormValues = z.infer<typeof formSchema>;

interface CollateralFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CollateralFormValues) => void;
  collateral: Collateral | null;
  debtors: Debtor[];
}

export function CollateralFormSheet({ isOpen, onClose, onSubmit, collateral, debtors }: CollateralFormSheetProps) {
  const form = useForm<CollateralFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      debtorId: '',
      type: 'vehicle',
      description: '',
      value: 0,
      serialNumber: '',
      address: '',
    },
  });

  const collateralType = form.watch('type');

  useEffect(() => {
    if (collateral) {
      form.reset(collateral);
    } else {
      form.reset({
        debtorId: '',
        type: 'vehicle',
        description: '',
        value: 0,
        serialNumber: '',
        address: '',
      });
    }
  }, [collateral, form, isOpen]);

  const handleSubmit = (values: CollateralFormValues) => {
    onSubmit(values);
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
                    <FormLabel>Debitur Pemilik</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih debitur" />
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
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Agunan</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis agunan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="vehicle">Kendaraan</SelectItem>
                        <SelectItem value="lease">Properti / Sewa</SelectItem>
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
                    <FormLabel>Deskripsi Singkat</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. Toyota Avanza 2022" {...field} />
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
                    <FormLabel>Nilai Taksiran (Rp)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="cth. 180000000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {collateralType === 'vehicle' && (
                <FormField
                    control={form.control}
                    name="serialNumber"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nomor Seri / Rangka</FormLabel>
                        <FormControl>
                        <Input placeholder="cth. VIN123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              )}
               {collateralType === 'lease' && (
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Alamat Properti</FormLabel>
                        <FormControl>
                        <Textarea placeholder="cth. Jl. Jenderal Sudirman No. 123, Jakarta" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              )}
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
