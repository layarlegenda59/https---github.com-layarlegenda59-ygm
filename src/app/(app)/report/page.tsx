
'use client';
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { debtors as initialDebtors } from "@/lib/data";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Debtor } from "@/lib/types";

export default function ReportPage() {
  const [debtors] = useState<Debtor[]>(initialDebtors);

  const sortedReportDebtors = [...debtors].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name = '') => {
    return name.split(' ').map(n => n[0]).join('');
  }

  return (
    <div className="flex flex-col gap-8">
      <Header title="Laporan" />
      <main>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Laporan Jatuh Tempo Debitur</CardTitle>
                <CardDescription>Rincian debitur dengan tanggal jatuh tempo leasing dan pendana.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Nama Debitur</TableHead>
                            <TableHead>Leasing / BPKB</TableHead>
                            <TableHead>Jatuh Tempo Leasing</TableHead>
                            <TableHead>Jatuh Tempo Pendana</TableHead>
                            <TableHead>Pendana</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedReportDebtors.map((debtor) => (
                            <TableRow key={debtor.id}>
                                <TableCell className="font-medium">{debtor.name}</TableCell>
                                <TableCell>{debtor.leasingBpkb || '-'}</TableCell>
                                <TableCell>{formatDate(debtor.dueDate)}</TableCell>
                                <TableCell>{formatDate(debtor.funderDueDate)}</TableCell>
                                <TableCell>{getInitials(debtor.funder)}</TableCell>
                                <TableCell className="text-right">
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
