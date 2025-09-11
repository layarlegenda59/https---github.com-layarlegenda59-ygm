
'use client';
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, FileUp, MoreHorizontal, Car, Bike } from "lucide-react";
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
import { debtors as initialDebtors, collaterals as initialCollaterals } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Debtor, Collateral } from "@/lib/types";
import { DebtorFormSheet } from "@/components/debtors/debtor-form-sheet";
import { DeleteDebtorDialog } from "@/components/debtors/delete-debtor-dialog";
import { CollateralFormSheet } from "@/components/collateral/collateral-form-sheet";
import { DeleteCollateralDialog } from "@/components/collateral/delete-collateral-dialog";

export default function DebtorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debtors, setDebtors] = useState<Debtor[]>(initialDebtors);
  const [selectedDebtor, setSelectedDebtor] = useState<Debtor | null>(null);
  const [isDebtorFormOpen, setDebtorFormOpen] = useState(false);
  const [isDeleteDebtorDialogOpen, setDeleteDebtorDialogOpen] = useState(false);

  const [collaterals, setCollaterals] = useState<Collateral[]>(initialCollaterals);
  const [selectedCollateral, setSelectedCollateral] = useState<Collateral | null>(null);
  const [isCollateralFormOpen, setCollateralFormOpen] = useState(false);
  const [isDeleteCollateralDialogOpen, setDeleteCollateralDialogOpen] = useState(false);
  const [collateralSearchTerm, setCollateralSearchTerm] = useState('');


  const filteredDebtors = debtors.map(debtor => {
    const debtorCollaterals = initialCollaterals.filter(c => c.debtorId === debtor.id);
    return { ...debtor, collaterals: debtorCollaterals };
  }).filter(debtor =>
    debtor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    debtor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCollaterals = collaterals.filter(c =>
    c.debtorName.toLowerCase().includes(collateralSearchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(collateralSearchTerm.toLowerCase())
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

  // Collateral Handlers
    const handleAddCollateral = () => {
        setSelectedCollateral(null);
        setCollateralFormOpen(true);
    };

    const handleEditCollateral = (collateral: Collateral) => {
        setSelectedCollateral(collateral);
        setCollateralFormOpen(true);
    };

    const handleDeleteCollateral = (collateral: Collateral) => {
        setSelectedCollateral(collateral);
        setDeleteCollateralDialogOpen(true);
    };

    const confirmDeleteCollateral = () => {
        if (selectedCollateral) {
            setCollaterals(collaterals.filter(c => c.id !== selectedCollateral.id));
            setDeleteCollateralDialogOpen(false);
            setSelectedCollateral(null);
        }
    };
    
    const handleCollateralFormSubmit = (collateralData: Omit<Collateral, 'id' | 'debtorName'> & { id?: string }) => {
        const debtor = debtors.find(d => d.id === collateralData.debtorId);
        if (!debtor) return; 

        if (selectedCollateral) {
            // Update
            setCollaterals(collaterals.map(c =>
                c.id === selectedCollateral.id ? { ...c, ...collateralData, debtorName: debtor.name, id: c.id } : c
            ));
        } else {
            // Create
            const newCollateral: Collateral = {
                ...collateralData,
                id: `COL${Date.now()}`,
                debtorName: debtor.name,
            };
            setCollaterals([newCollateral, ...collaterals]);
        }
        setCollateralFormOpen(false);
        setSelectedCollateral(null);
    };


  return (
    <div className="flex flex-col gap-8">
      <Header title="Debitur & Agunan">
        <Button variant="outline">
          <FileUp className="mr-2 h-4 w-4" />
          Impor Data
        </Button>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Tambah
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleAddDebtor}>Tambah Debitur</DropdownMenuItem>
                <DropdownMenuItem onClick={handleAddCollateral}>Tambah Agunan</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
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
                            <TableHead className="hidden md:table-cell">Jenis</TableHead>
                            <TableHead className="hidden sm:table-cell">Deskripsi</TableHead>
                            <TableHead className="hidden md:table-cell text-right">Nilai</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead><span className="sr-only">Aksi</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredDebtors.map((debtor) => (
                            <TableRow key={debtor.id}>
                                <TableCell className="font-medium">{debtor.name}</TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <div className="flex flex-col gap-1">
                                        {debtor.collaterals.length > 0 ? debtor.collaterals.map(c => (
                                            <div key={c.id} className="flex items-center gap-2">
                                                {c.type === 'car' ? <Car className="h-5 w-5 text-muted-foreground" /> : <Bike className="h-5 w-5 text-muted-foreground" />}
                                                <span className="capitalize">{c.type === 'car' ? 'Mobil' : 'Motor'}</span>
                                            </div>
                                        )) : <span className="text-muted-foreground">-</span>}
                                    </div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                     <div className="flex flex-col gap-1">
                                        {debtor.collaterals.length > 0 ? debtor.collaterals.map(c => (
                                            <span key={c.id}>{c.description}</span>
                                        )) : <span className="text-muted-foreground">-</span>}
                                    </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-right">
                                     <div className="flex flex-col gap-1">
                                        {debtor.collaterals.length > 0 ? debtor.collaterals.map(c => (
                                            <span key={c.id}>Rp{c.value.toLocaleString('id-ID')}</span>
                                        )) : <span className="text-muted-foreground">-</span>}
                                    </div>
                                </TableCell>
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

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Aset Agunan</CardTitle>
                <CardDescription>Kelola aset agunan termasuk kendaraan dan properti sewa.</CardDescription>
                <div className="pt-4">
                    <Input
                        placeholder="Filter agunan berdasarkan debitur atau deskripsi..."
                        value={collateralSearchTerm}
                        onChange={(e) => setCollateralSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                </div>
            </CardHeader>
            <CardContent>
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Jenis</TableHead>
                                <TableHead>Deskripsi</TableHead>
                                <TableHead className="hidden sm:table-cell">Debitur</TableHead>
                                <TableHead className="text-right">Nilai</TableHead>
                                <TableHead><span className="sr-only">Aksi</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCollaterals.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        {item.type === 'car' ? <Car className="h-5 w-5" /> : <Bike className="h-5 w-5" />}
                                        <span className="capitalize">{item.type === 'car' ? 'Mobil' : 'Motor'}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{item.description}</TableCell>
                                <TableCell className="hidden sm:table-cell">{item.debtorName}</TableCell>
                                <TableCell className="text-right">Rp{item.value.toLocaleString('id-ID')}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Buka menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Aksi Agunan</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => handleEditCollateral(item)}>Ubah</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDeleteCollateral(item)} className="text-destructive">Hapus</DropdownMenuItem>
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
      <CollateralFormSheet
        isOpen={isCollateralFormOpen}
        onClose={() => { setCollateralFormOpen(false); setSelectedCollateral(null); }}
        onSubmit={handleCollateralFormSubmit}
        collateral={selectedCollateral}
        debtors={debtors}
      />
      <DeleteCollateralDialog
        isOpen={isDeleteCollateralDialogOpen}
        onClose={() => setDeleteCollateralDialogOpen(false)}
        onConfirm={confirmDeleteCollateral}
        collateralDescription={selectedCollateral?.description || ''}
      />
    </div>
  );
}
