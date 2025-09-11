
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
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Debtor } from "@/lib/types";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function ReportPage() {
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDebtors = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('debtors')
        .select('*')
        .order('dueDate', { ascending: true });

      if (error) {
        console.error("Error fetching debtors for report:", error);
        toast({
          title: "Gagal memuat data",
          description: "Tidak dapat mengambil data laporan dari server.",
          variant: "destructive",
        });
      } else {
        setDebtors(data || []);
      }
      setLoading(false);
    };

    fetchDebtors();
  }, [toast]);


  const formatDate = (dateString: string) => {
     if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name = '') => {
    if (!name) return '-';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
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
                             {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                                        <span className="mt-2 block">Memuat data laporan...</span>
                                    </TableCell>
                                </TableRow>
                            ) : debtors.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                    Tidak ada data untuk ditampilkan.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                debtors.map((debtor) => (
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
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
