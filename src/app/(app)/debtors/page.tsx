
'use client';
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, FileUp, MoreHorizontal } from "lucide-react";
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
import { debtors as initialDebtors } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Debtor } from "@/lib/types";
import { DebtorFormSheet } from "@/components/debtors/debtor-form-sheet";
import { DeleteDebtorDialog } from "@/components/debtors/delete-debtor-dialog";

export default function DebtorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debtors, setDebtors] = useState<Debtor[]>(initialDebtors);
  const [selectedDebtor, setSelectedDebtor] = useState<Debtor | null>(null);
  const [isDebtorFormOpen, setDebtorFormOpen] = useState(false);
  const [isDeleteDebtorDialogOpen, setDeleteDebtorDialogOpen] = useState(false);

  const filteredDebtors = debtors.filter(debtor =>
    debtor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    debtor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Debtor handlers
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

  const confirmDeleteDebtor = () => {
    if (selectedDebtor) {
      setDebtors(debtors.filter(d => d.id !== selectedDebtor.id));
      setDeleteDebtorDialogOpen(false);
      setSelectedDebtor(null);
    }
  };

  const handleDebtorFormSubmit = (debtorData: Omit<Debtor, 'id' | 'status'> & { id?: string }) => {
    if (selectedDebtor) {
      // Update
      const updatedDebtors = debtors.map(d =>
        d.id === selectedDebtor.id ? { ...d, ...debtorData, id: d.id } : d
      );
      const updatedDebtor = updatedDebtors.find(d => d.id === selectedDebtor.id);
      if (updatedDebtor) {
        // Simple status logic based on due date
        const dueDate = new Date(updatedDebtor.dueDate);
        const today = new Date();
        today.setHours(0,0,0,0);
        
        if (updatedDebtor.totalDebt === 0) {
            updatedDebtor.status = 'paid';
        } else if (dueDate < today) {
            updatedDebtor.status = 'overdue';
        } else {
            updatedDebtor.status = 'due';
        }
      }
      setDebtors(updatedDebtors);
    } else {
      // Create
      const newDebtor: Debtor = {
        ...debtorData,
        id: `DBT${Date.now()}`,
        status: new Date(debtorData.dueDate) < new Date() ? 'overdue' : 'due',
      };
      setDebtors([newDebtor, ...debtors]);
    }
    setDebtorFormOpen(false);
    setSelectedDebtor(null);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <Header title="Debitur">
        <Button variant="outline">
          <FileUp className="mr-2 h-4 w-4" />
          Impor Data
        </Button>
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
                            {filteredDebtors.map((debtor) => (
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
                            ))}
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
