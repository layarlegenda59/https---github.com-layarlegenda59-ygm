
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
import { Loader2, Calendar, Building, User } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ReportPage() {
  const isMobile = useIsMobile();
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDebtors = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('debtors')
        .select('*')
        .order('funder_due_date', { ascending: true });

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
  };

  const getStatusBadge = (status: Debtor['status']) => {
    return (
      <Badge
        className={cn(
          'capitalize',
          status === 'overdue' && 'bg-destructive/80 text-destructive-foreground',
          status === 'due' && 'bg-yellow-400/80 text-yellow-900',
          status === 'paid' && 'bg-green-400/80 text-green-900',
          status === 'takeover' && 'bg-blue-400/80 text-blue-900'
        )}
        variant="secondary"
      >
        {status === 'paid' ? 'Lunas' : 
         status === 'due' ? 'Jatuh Tempo' : 
         status === 'takeover' ? 'Take Over' : 'Tunggakan'}
      </Badge>
    );
  };

  const MobileReportCard = ({ debtor }: { debtor: Debtor }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-medium">{debtor.name}</div>
              <div className="text-sm text-muted-foreground">{debtor.leasing_bpkb || '-'}</div>
            </div>
          </div>
          {getStatusBadge(debtor.status)}
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Jatuh Tempo Leasing:</span>
            <span>{formatDate(debtor.due_date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Jatuh Tempo Pendana:</span>
            <span>{formatDate(debtor.funder_due_date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Pendana:</span>
            <span>{debtor.funder || '-'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
                {loading ? (
                  <div className="h-24 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Memuat data laporan...</span>
                  </div>
                ) : debtors.length === 0 ? (
                  <div className="h-24 flex items-center justify-center text-muted-foreground">
                    Tidak ada data untuk ditampilkan.
                  </div>
                ) : isMobile ? (
                  <div className="space-y-4">
                    {debtors.map((debtor) => (
                      <MobileReportCard key={debtor.id} debtor={debtor} />
                    ))}
                  </div>
                ) : (
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
                        {debtors.map((debtor) => (
                          <TableRow key={debtor.id}>
                            <TableCell className="font-medium">{debtor.name}</TableCell>
                            <TableCell>{debtor.leasing_bpkb || '-'}</TableCell>
                            <TableCell>{formatDate(debtor.due_date)}</TableCell>
                            <TableCell>{formatDate(debtor.funder_due_date)}</TableCell>
                            <TableCell>{getInitials(debtor.funder || '')}</TableCell>
                            <TableCell className="text-right">
                              {getStatusBadge(debtor.status)}
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
    </div>
  );
}
