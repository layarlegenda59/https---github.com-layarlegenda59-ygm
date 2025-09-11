
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { collaterals as initialCollaterals } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Collateral } from "@/lib/types";
import { CollateralFormSheet } from "@/components/collateral/collateral-form-sheet";
import { DeleteCollateralDialog } from "@/components/collateral/delete-collateral-dialog";

export default function CollateralPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [collaterals, setCollaterals] = useState<Collateral[]>(initialCollaterals);
  const [selectedCollateral, setSelectedCollateral] = useState<Collateral | null>(null);
  const [isCollateralFormOpen, setCollateralFormOpen] = useState(false);
  const [isDeleteCollateralDialogOpen, setDeleteCollateralDialogOpen] = useState(false);

  const filteredCollaterals = collaterals.filter(collateral =>
    collateral.debtorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collateral.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collateral.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Collateral handlers
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
      setCollaterals(collaterals.filter(d => d.id !== selectedCollateral.id));
      setDeleteCollateralDialogOpen(false);
      setSelectedCollateral(null);
    }
  };

  const handleCollateralFormSubmit = (collateralData: Omit<Collateral, 'id'> & { id?: string }) => {
    if (selectedCollateral) {
      // Update
      const updatedCollaterals = collaterals.map(d =>
        d.id === selectedCollateral.id ? { ...d, ...collateralData, id: d.id } : d
      );
      setCollaterals(updatedCollaterals);
    } else {
      // Create
      const newCollateral: Collateral = {
        ...collateralData,
        id: `COL${Date.now()}`,
      };
      setCollaterals([newCollateral, ...collaterals]);
    }
    setCollateralFormOpen(false);
    setSelectedCollateral(null);
  };


  return (
    <div className="flex flex-col gap-8">
      <Header title="Agunan">
        <Button variant="outline">
          <FileUp className="mr-2 h-4 w-4" />
          Impor Data
        </Button>
        <Button onClick={handleAddCollateral}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Agunan
        </Button>
      </Header>
      <main className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Aset Agunan</CardTitle>
                <CardDescription>Kelola aset agunan termasuk kendaraan dan properti sewa.</CardDescription>
                 <div className="pt-4">
                    <Input
                        placeholder="Filter berdasarkan nama, deskripsi, atau serial..."
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
                            <TableHead>Nama Debitur</TableHead>
                            <TableHead>Jenis</TableHead>
                            <TableHead>Deskripsi</TableHead>
                            <TableHead>Nomor Seri</TableHead>
                            <TableHead className="text-right">Nilai</TableHead>
                            <TableHead><span className="sr-only">Aksi</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCollaterals.map((collateral) => (
                            <TableRow key={collateral.id}>
                                <TableCell className="font-medium">{collateral.debtorName}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {collateral.type === 'car' ? <Car className="h-5 w-5 text-muted-foreground" /> : <Bike className="h-5 w-5 text-muted-foreground" />}
                                        <span className="capitalize">{collateral.type === 'car' ? 'Mobil' : 'Motor'}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{collateral.description}</TableCell>
                                <TableCell>{collateral.serialNumber || '-'}</TableCell>
                                <TableCell className="text-right">Rp{collateral.value.toLocaleString('id-ID')}</TableCell>
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
                                        <DropdownMenuItem onClick={() => handleEditCollateral(collateral)}>Ubah</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDeleteCollateral(collateral)} className="text-destructive">Hapus</DropdownMenuItem>
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
        isOpen={isCollateralFormOpen}
        onClose={() => { setCollateralFormOpen(false); setSelectedCollateral(null); }}
        onSubmit={handleCollateralFormSubmit}
        collateral={selectedCollateral}
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
