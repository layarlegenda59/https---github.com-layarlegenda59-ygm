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
import { RefreshCcw } from "lucide-react";
import { notificationLogs } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export function NotificationLogTable() {
    const { toast } = useToast();
    
    const handleRetry = (logId: string) => {
        toast({
            title: "Mengirim ulang notifikasi...",
            description: `Mencoba mengirim ulang notifikasi ${logId}.`
        });
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
                    {notificationLogs.map((log) => (
                    <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.debtorName}</TableCell>
                        <TableCell className="hidden sm:table-cell"><span className="capitalize">{log.type}</span></TableCell>
                        <TableCell>{new Date(log.sentAt).toLocaleString('id-ID')}</TableCell>
                        <TableCell>
                            <Badge className={cn('capitalize', log.status === 'failed' ? 'bg-destructive/80 text-destructive-foreground' : 'bg-green-400/80 text-green-900')} variant={log.status === 'failed' ? 'destructive' : 'secondary'}>
                                {log.status === 'success' ? 'Sukses' : 'Gagal'}
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
                    ))}
                </TableBody>
            </Table>
        </div>
  );
}
