
'use client';
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, FileUp, Car, MoreHorizontal, Bike } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { collaterals as initialCollaterals, debtors } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Collateral } from "@/lib/types";
import { CollateralFormSheet } from "@/components/collateral/collateral-form-sheet";
import { DeleteCollateralDialog } from "@/components/collateral/delete-collateral-dialog";

export default function CollateralPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [collaterals, setCollaterals] = useState<Collateral[]>(initialCollaterals);
    const [selectedCollateral, setSelectedCollateral] = useState<Collateral | null>(null);
    const [isFormOpen, setFormOpen] = useState(false);
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const filteredCollaterals = collaterals.filter(c =>
        c.debtorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAdd = () => {
        setSelectedCollateral(null);
        setFormOpen(true);
    };

    const handleEdit = (collateral: Collateral) => {
        setSelectedCollateral(collateral);
        setFormOpen(true);
    };

    const handleDelete = (collateral: Collateral) => {
        setSelectedCollateral(collateral);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (selectedCollateral) {
            setCollaterals(collaterals.filter(c => c.id !== selectedCollateral.id));
            setDeleteDialogOpen(false);
            setSelectedCollateral(null);
        }
    };
    
    const handleFormSubmit = (collateralData: Omit<Collateral, 'id' | 'debtorName'> & { id?: string }) => {
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
        setFormOpen(false);
        setSelectedCollateral(null);
    };

  return (
    <div className="flex flex-col gap-8">
      <Header title="Agunan">
        <Button variant="outline">
          <FileUp className="mr-2 h-4 w-4" />
          Impor Data
        </Button>
        <Button onClick={handleAdd}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Agunan
        </Button>
      </Header>
      <main>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Aset Agunan</CardTitle>
                <CardDescription>Kelola aset agunan termasuk kendaraan dan properti sewa.</CardDescription>
                <div className="pt-4">
                    <Input
                        placeholder="Filter berdasarkan debitur atau deskripsi..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
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
                                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => handleEdit(item)}>Ubah</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDelete(item)} className="text-destructive">Hapus</DropdownMenuItem>
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
      <CollateralFormSheet
        isOpen={isFormOpen}
        onClose={() => { setFormOpen(false); setSelectedCollateral(null); }}
        onSubmit={handleFormSubmit}
        collateral={selectedCollateral}
        debtors={debtors}
      />
      <DeleteCollateralDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        collateralDescription={selectedCollateral?.description || ''}
      />
    </div>
  );
}
