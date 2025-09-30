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
import { MoreHorizontal, Plus, Search, PlusCircle, Loader2, Car, Phone, Calendar, DollarSign } from "lucide-react";
import { Header } from "@/components/layout/header";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Debtor } from "@/lib/types";
import { DebtorFormSheet } from "@/components/debtors/debtor-form-sheet";
import { DeleteDebtorDialog } from "@/components/debtors/delete-debtor-dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export default function DebtorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDebtor, setSelectedDebtor] = useState<Debtor | null>(null);
  const [isDebtorFormOpen, setDebtorFormOpen] = useState(false);
  const [isDeleteDebtorDialogOpen, setDeleteDebtorDialogOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const fetchDebtors = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('debtors')
      .select('*')
      .order('funder_due_date', { ascending: true });

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

  const formatCurrency = (amount: number) => {
    return `Rp${amount.toLocaleString('id-ID')}`;
  };

  const getStatusBadge = (status: Debtor['status']) => {
    const statusConfig = {
      paid: { label: 'Lunas', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      due: { label: 'Jatuh Tempo', variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' },
      overdue: { label: 'Tunggakan', variant: 'destructive' as const, className: 'bg-red-100 text-red-800' },
      takeover: { label: 'Take Over', variant: 'outline' as const, className: 'bg-blue-100 text-blue-800' },
    };
    
    const config = statusConfig[status];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const MobileDebtorCard = ({ debtor }: { debtor: Debtor }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{debtor.name}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <Phone className="h-3 w-3" />
              <span>{debtor.phone}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8">
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
        </div>
        
        <div className="space-y-3">
          <div className="bg-muted/50 rounded-lg p-3">
            <h4 className="font-medium text-sm mb-2 text-muted-foreground">Informasi Debitur</h4>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Jenis Kendaraan:</span>
                <span>{debtor.vehicle_type || 'Tidak tersedia'}</span>
              </div>
              {debtor.police_number && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">No. Polisi:</span>
                  <span>{debtor.police_number}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Total Utang:</span>
                <span className="font-semibold">{formatCurrency(debtor.total_debt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Jatuh Tempo:</span>
                <span>{formatDate(debtor.due_date)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-muted-foreground">Status:</span>
              <div className="mt-1">{getStatusBadge(debtor.status)}</div>
            </div>
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
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col gap-8">
      <Header title="Debitur">
          <Button onClick={handleAddDebtor}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Debitur
          </Button>
      </Header>
      <main className="space-y-6 sm:space-y-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-xl sm:text-2xl">Informasi Debitur</CardTitle>
                <CardDescription className="text-sm sm:text-base">Kelola data semua debitur yang terdaftar dalam sistem.</CardDescription>
                 <div className="pt-4">
                    <Input
                        placeholder="Filter berdasarkan nama, email, atau no. polisi..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:max-w-sm"
                    />
                </div>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                        <span className="text-sm text-muted-foreground">Memuat data...</span>
                    </div>
                ) : filteredDebtors.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Tidak ada data debitur.</p>
                    </div>
                ) : isMobile ? (
                    // Mobile Card Layout
                    <div className="space-y-4">
                        {filteredDebtors.map((debtor) => (
                            <MobileDebtorCard key={debtor.id} debtor={debtor} />
                        ))}
                    </div>
                ) : (
                    // Desktop Table Layout
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Nama</TableHead>
                                <TableHead className="hidden sm:table-cell">Jenis Kendaraan</TableHead>
                                <TableHead className="hidden md:table-cell">No. Polisi</TableHead>
                                <TableHead className="hidden md:table-cell text-right">Total Utang</TableHead>
                                <TableHead className="hidden md:table-cell">Jatuh Tempo</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead><span className="sr-only">Aksi</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredDebtors.map((debtor) => (
                                <TableRow key={debtor.id}>
                                    <TableCell>
                                        <div className="font-medium">{debtor.name}</div>
                                        <div className="text-sm text-muted-foreground">{debtor.phone}</div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        {debtor.vehicle_type || '-'}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        {debtor.police_number || '-'}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-right">
                                        {formatCurrency(debtor.total_debt)}
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
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
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
