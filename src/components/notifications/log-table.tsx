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
            title: "Retrying notification...",
            description: `Attempting to resend notification ${logId}.`
        });
    }

    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Debtor</TableHead>
                    <TableHead className="hidden sm:table-cell">Type</TableHead>
                    <TableHead>Sent At</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {notificationLogs.map((log) => (
                    <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.debtorName}</TableCell>
                        <TableCell className="hidden sm:table-cell"><span className="capitalize">{log.type}</span></TableCell>
                        <TableCell>{log.sentAt}</TableCell>
                        <TableCell>
                            <Badge className={cn('capitalize', log.status === 'failed' ? 'bg-destructive/80 text-destructive-foreground' : 'bg-green-400/80 text-green-900')} variant={log.status === 'failed' ? 'destructive' : 'secondary'}>
                                {log.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            {log.status === 'failed' && (
                                <Button variant="outline" size="sm" onClick={() => handleRetry(log.id)}>
                                    <RefreshCcw className="mr-2 h-4 w-4" />
                                    Retry
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
