'use client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal, Plus, Search, PlusCircle, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/header";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Debtor } from "@/lib/types";
import { DebtorFormSheet } from "@/components/debtors/debtor-form-sheet";
import { DeleteDebtorDialog } from "@/components/debtors/delete-debtor-dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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
    (debtor.email && debtor.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (debtor.police_number && debtor.police_number.toLowerCase().includes(searchTerm.toLowerCase()))
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

  const handleStatusChange = async (debtorId: string, newStatus: Debtor['status']) => {
    const { error } = await supabase
      .from('debtors')
      .update({ status: newStatus })
      .eq('id', debtorId);

    if (error) {
      toast({
        title: "Gagal mengubah status",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Status berhasil diubah",
        description: "Status debitur telah diperbarui.",
      });
      await fetchDebtors();
    }
  };

  const handleDebtorFormSubmit = async (debtorData: Omit<Debtor, 'id' | 'created_at'>) => {
    const dataToSubmit = { 
        ...debtorData
    };
    
    if (selectedDebtor) {
      // Update
      const { error } = await supabase
        .from('debtors')
        .update(dataToSubmit)
        .match({ id: selectedDebtor.id });

      if (error) {
        console.error('Update error:', error);
        toast({ title: "Gagal memperbarui", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Berhasil", description: "Data debitur telah diperbarui." });
      }
    } else {
      // Create - Get current user and add user_id
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({ title: "Error", description: "User tidak terautentikasi", variant: "destructive" });
        return;
      }

      const dataWithUserId = {
        ...dataToSubmit,
        user_id: user.id
      };

      const { error } = await supabase
        .from('debtors')
        .insert([dataWithUserId]);

      if (error) {
        console.error('Insert error:', error);
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
          <Button onClick={handleAddDebtor}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Debitur
          </Button>
      </Header>
      <main className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Informasi Debitur</CardTitle>
                <CardDescription>Kelola data semua debitur yang terdaftar dalam sistem.</CardDescription>
                 <div className="pt-4">
                    <Input
                        placeholder="Filter berdasarkan nama, email, atau no. polisi..."
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
                            <TableHead className="hidden sm:table-cell">No. Polisi</TableHead>
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
                                    <TableCell>
                                        <div className="font-medium">{debtor.name}</div>
                                        <div className="text-sm text-muted-foreground">{debtor.phone}</div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        {debtor.police_number || '-'}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-right">
                                        Rp{debtor.total_debt.toLocaleString('id-ID')}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">{formatDate(debtor.due_date)}</TableCell>
                                    <TableCell>
                                        <Select
                                            value={debtor.status}
                                            onValueChange={(value: Debtor['status']) => handleStatusChange(debtor.id, value)}
                                        >
                                            <SelectTrigger className="w-32">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="paid">Lunas</SelectItem>
                                                <SelectItem value="due">Jatuh Tempo</SelectItem>
                                                <SelectItem value="overdue">Tunggakan</SelectItem>
                                                <SelectItem value="takeover">Take Over</SelectItem>
                                            </SelectContent>
                                        </Select>
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
