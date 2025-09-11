
'use client';
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, FileUp, MoreHorizontal, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Debtor } from "@/lib/types";
import { DebtorFormSheet } from "@/components/debtors/debtor-form-sheet";
import { DeleteDebtorDialog } from "@/components/debtors/delete-debtor-dialog";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function DebtorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDebtor, setSelectedDebtor] = useState<Debtor | null>(null);
  const [isDebtorFormOpen, setDebtorFormOpen] = useState(false);
  const [isDeleteDebtorDialogOpen, setDeleteDebtorDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchDebtors = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('debtors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching debtors:", error);
      toast({
        title: "Gagal memuat data",
        description: "Tidak dapat mengambil data debitur dari server.",
        variant: "destructive",
      });
    } else {
      setDebtors(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDebtors();
  }, []);

  const filteredDebtors = debtors.filter(debtor =>
    debtor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (debtor.email && debtor.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddDebtor = () => {
    setSelectedDebtor(null);
    setDebtorFormOpen(true);
  };

  const handleEditDebtor = (debtor: Debtor) => {
    setSelectedDebtor(debtor);
    setDebtorFormOpen(true);
  };

  const handleDeleteDebtor = (debtor: Debtor) => {
    setSelectedDebtor(debtor);
    setDeleteDebtorDialogOpen(true);
  };

  const confirmDeleteDebtor = async () => {
    if (selectedDebtor) {
      const { error } = await supabase
        .from('debtors')
        .delete()
        .match({ id: selectedDebtor.id });

      if (error) {
        toast({
          title: "Gagal menghapus",
          description: `Gagal menghapus data debitur ${selectedDebtor.name}.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Berhasil dihapus",
          description: `Debitur ${selectedDebtor.name} telah dihapus.`,
        });
        await fetchDebtors(); // Refresh data
      }
      setDeleteDebtorDialogOpen(false);
      setSelectedDebtor(null);
    }
  };

  const handleDebtorFormSubmit = async (debtorData: Omit<Debtor, 'id' | 'created_at'>) => {
    // Simple status logic based on due date
    const dueDate = new Date(debtorData.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let status: Debtor['status'] = 'due';
    if (debtorData.totalDebt === 0) {
        status = 'paid';
    } else if (dueDate < today) {
        status = 'overdue';
    }

    const dataToSubmit = { ...debtorData, status };
    
    if (selectedDebtor) {
      // Update
      const { error } = await supabase
        .from('debtors')
        .update(dataToSubmit)
        .match({ id: selectedDebtor.id });

      if (error) {
        toast({ title: "Gagal memperbarui", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Berhasil", description: "Data debitur telah diperbarui." });
      }
    } else {
      // Create
      const { error } = await supabase
        .from('debtors')
        .insert([dataToSubmit]);

      if (error) {
        toast({ title: "Gagal menambah data", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Berhasil", description: "Debitur baru telah ditambahkan." });
      }
    }
    await fetchDebtors();
    setDebtorFormOpen(false);
    setSelectedDebtor(null);
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <Header title="Debitur">
        <>
          <Button variant="outline">
            <FileUp className="mr-2 h-4 w-4" />
            Impor Data
          </Button>
          <Button onClick={handleAddDebtor}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Debitur
          </Button>
        </>
      </Header>
      <main className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Informasi Debitur</CardTitle>
                <CardDescription>Kelola data semua debitur yang terdaftar dalam sistem.</CardDescription>
                 <div className="pt-4">
                    <Input
                        placeholder="Filter berdasarkan nama atau email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Nama</TableHead>
                            <TableHead className="hidden sm:table-cell">Kontak</TableHead>
                            <TableHead className="hidden md:table-cell text-right">Total Utang</TableHead>
                            <TableHead className="hidden md:table-cell">Jatuh Tempo</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead><span className="sr-only">Aksi</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                                        <span className="mt-2 block">Memuat data...</span>
                                    </TableCell>
                                </TableRow>
                            ) : filteredDebtors.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                    Tidak ada data debitur.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredDebtors.map((debtor) => (
                                <TableRow key={debtor.id}>
                                    <TableCell className="font-medium">{debtor.name}</TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <div className="flex flex-col">
                                            <span>{debtor.email}</span>
                                            <span className="text-muted-foreground">{debtor.phone}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-right">
                                        Rp{debtor.totalDebt.toLocaleString('id-ID')}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">{formatDate(debtor.dueDate)}</TableCell>
                                    <TableCell>
                                        <Badge
                                            className={cn(
                                                'capitalize',
                                                debtor.status === 'overdue' && 'bg-destructive/80 text-destructive-foreground',
                                                debtor.status === 'due' && 'bg-yellow-400/80 text-yellow-900',
                                                debtor.status === 'paid' && 'bg-green-400/80 text-green-900'
                                            )}
                                            variant="secondary"
                                        >
                                            {debtor.status === 'paid' ? 'Lunas' : debtor.status === 'due' ? 'Jatuh Tempo' : 'Tunggakan'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Buka menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Aksi Debitur</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => handleEditDebtor(debtor)}>Ubah</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDeleteDebtor(debtor)} className="text-destructive">Hapus</DropdownMenuItem>
                                        </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
      </main>

      <DebtorFormSheet
        isOpen={isDebtorFormOpen}
        onClose={() => { setDebtorFormOpen(false); setSelectedDebtor(null); }}
        onSubmit={handleDebtorFormSubmit}
        debtor={selectedDebtor}
      />
      <DeleteDebtorDialog
        isOpen={isDeleteDebtorDialogOpen}
        onClose={() => setDeleteDebtorDialogOpen(false)}
        onConfirm={confirmDeleteDebtor}
        debtorName={selectedDebtor?.name || ''}
      />
    </div>
  );
}
