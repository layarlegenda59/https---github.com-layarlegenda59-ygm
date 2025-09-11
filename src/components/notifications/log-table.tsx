'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { NotificationLog } from "@/lib/types";

export function NotificationLogTable() {
    const { toast } = useToast();
    const [logs, setLogs] = useState<NotificationLog[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('notification_logs')
            .select('*')
            .order('sentAt', { ascending: false });
        
        if (error) {
            console.error("Error fetching notification logs:", error);
            toast({
                title: "Gagal memuat log",
                description: error.message,
                variant: "destructive"
            });
        } else {
            setLogs(data || []);
        }
        setLoading(false);
    }
    
    useEffect(() => {
        fetchLogs();
    }, []);

    const handleRetry = (logId: string) => {
        toast({
            title: "Mengirim ulang notifikasi...",
            description: `Fungsionalitas ini belum diimplementasikan. Mencoba mengirim ulang notifikasi ${logId}.`
        });
        // Here you would typically call a server function or API to retry sending the notification
    }

    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Debitur</TableHead>
                    <TableHead className="hidden sm:table-cell">Tipe</TableHead>
                    <TableHead>Dikirim Pada</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                                <span className="mt-2 block">Memuat log...</span>
                            </TableCell>
                        </TableRow>
                    ) : logs.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                            Tidak ada log notifikasi.
                            </TableCell>
                        </TableRow>
                    ) : (
                        logs.map((log) => (
                        <TableRow key={log.id}>
                            <TableCell className="font-medium">{log.debtorName}</TableCell>
                            <TableCell className="hidden sm:table-cell"><span className="capitalize">{log.type}</span></TableCell>
                            <TableCell>{new Date(log.sentAt).toLocaleString('id-ID')}</TableCell>
                            <TableCell>
                                <Badge className={cn('capitalize', log.status === 'failed' ? 'bg-destructive/80 text-destructive-foreground' : log.status === 'success' ? 'bg-green-400/80 text-green-900' : 'bg-secondary')} variant={'secondary'}>
                                    {log.status === 'success' ? 'Sukses' : log.status === 'failed' ? 'Gagal' : log.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                {log.status === 'failed' && (
                                    <Button variant="outline" size="sm" onClick={() => handleRetry(log.id)}>
                                        <RefreshCcw className="mr-2 h-4 w-4" />
                                        Coba Lagi
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
  );
}
