import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Debtor } from "@/lib/types";

interface UpcomingDuesProps {
    debtors: Debtor[];
}

export function UpcomingDues({ debtors }: UpcomingDuesProps) {
  const upcoming = debtors
    .filter(d => d.status === 'due' || d.status === 'overdue')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Jatuh Tempo Mendatang</CardTitle>
        <CardDescription>Daftar debitur dengan pembayaran mendatang atau terlambat.</CardDescription>
      </CardHeader>
      <CardContent>
         {upcoming.length > 0 ? (
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Debitur</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead className="hidden sm:table-cell">Jatuh Tempo</TableHead>
                <TableHead className="text-right">Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {upcoming.map((debtor) => (
                <TableRow key={debtor.id}>
                    <TableCell>
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                        <AvatarImage src={`https://picsum.photos/seed/${debtor.id}/40/40`} alt={debtor.name} data-ai-hint="person portrait" />
                        <AvatarFallback>{debtor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{debtor.name}</div>
                    </div>
                    </TableCell>
                    <TableCell className="text-right">Rp{debtor.totalDebt.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="hidden sm:table-cell">{new Date(debtor.dueDate).toLocaleDateString('id-ID')}</TableCell>
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
         ) : (
            <div className="py-10 text-center text-muted-foreground">
                Tidak ada pembayaran jatuh tempo dalam waktu dekat.
            </div>
         )}
      </CardContent>
    </Card>
  );
}
