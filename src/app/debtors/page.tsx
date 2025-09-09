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
import { debtors as allDebtors } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function DebtorsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDebtors = allDebtors.filter(debtor =>
    debtor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    debtor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
      <Header title="Debitur">
        <Button variant="outline">
          <FileUp className="mr-2 h-4 w-4" />
          Impor Data
        </Button>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Debitur
        </Button>
      </Header>
      <main>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Informasi Debitur</CardTitle>
                <CardDescription>Buat, baca, perbarui, dan hapus informasi debitur.</CardDescription>
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
                            <TableHead className="hidden md:table-cell">Kontak</TableHead>
                            <TableHead className="hidden sm:table-cell text-right">Total Utang</TableHead>
                            <TableHead className="hidden md:table-cell">Jatuh Tempo</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead><span className="sr-only">Aksi</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredDebtors.map((debtor) => (
                            <TableRow key={debtor.id}>
                                <TableCell className="font-medium">{debtor.name}</TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <div className="flex flex-col">
                                        <span>{debtor.email}</span>
                                        <span className="text-muted-foreground text-sm">{debtor.phone}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell text-right">Rp{debtor.totalDebt.toLocaleString('id-ID')}</TableCell>
                                <TableCell className="hidden md:table-cell">{new Date(debtor.dueDate).toLocaleDateString('id-ID')}</TableCell>
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
                                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                        <DropdownMenuItem>Ubah</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">Hapus</DropdownMenuItem>
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
    </div>
  );
}
