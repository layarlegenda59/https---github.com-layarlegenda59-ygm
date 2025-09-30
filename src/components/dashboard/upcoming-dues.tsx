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
import { useIsMobile } from "@/hooks/use-mobile";
import { Calendar, DollarSign } from "lucide-react";

interface UpcomingDuesProps {
    debtors: Debtor[];
}

export function UpcomingDues({ debtors }: UpcomingDuesProps) {
  const isMobile = useIsMobile();
  const upcoming = debtors
    .filter(d => d.status === 'due' || d.status === 'overdue')
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 5);

  const formatCurrency = (amount: number) => {
    return `Rp${amount.toLocaleString('id-ID')}`;
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

  const MobileDueCard = ({ debtor }: { debtor: Debtor }) => (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1">
            <Avatar className="h-10 w-10">
              <AvatarImage src={`https://picsum.photos/seed/${debtor.id}/40/40`} alt={debtor.name} />
              <AvatarFallback>{debtor.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{debtor.name}</div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <DollarSign className="h-3 w-3" />
                <span>{formatCurrency(debtor.total_debt)}</span>
              </div>
            </div>
          </div>
          {getStatusBadge(debtor.status)}
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Jatuh Tempo:</span>
            <span>{new Date(debtor.due_date).toLocaleDateString('id-ID')}</span>
          </div>
          {debtor.funder_due_date && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Jatuh Tempo Pendana:</span>
              <span>{new Date(debtor.funder_due_date).toLocaleDateString('id-ID')}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Jatuh Tempo Mendatang</CardTitle>
        <CardDescription>Daftar debitur dengan pembayaran mendatang atau terlambat.</CardDescription>
      </CardHeader>
      <CardContent>
         {upcoming.length > 0 ? (
           isMobile ? (
             <div className="space-y-3">
               {upcoming.map((debtor) => (
                 <MobileDueCard key={debtor.id} debtor={debtor} />
               ))}
             </div>
           ) : (
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>Debitur</TableHead>
                   <TableHead className="text-right">Jumlah</TableHead>
                   <TableHead className="hidden sm:table-cell">Jatuh Tempo</TableHead>
                   <TableHead className="hidden md:table-cell">Jatuh Tempo Pendana</TableHead>
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
                     <TableCell className="text-right">Rp{debtor.total_debt.toLocaleString('id-ID')}</TableCell>
                     <TableCell className="hidden sm:table-cell">{new Date(debtor.due_date).toLocaleDateString('id-ID')}</TableCell>
                     <TableCell className="hidden md:table-cell">
                       {debtor.funder_due_date ? new Date(debtor.funder_due_date).toLocaleDateString('id-ID') : '-'}
                     </TableCell>
                     <TableCell className="text-right">
                       {getStatusBadge(debtor.status)}
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           )
         ) : (
           <div className="py-10 text-center text-muted-foreground">
             Tidak ada pembayaran jatuh tempo dalam waktu dekat.
           </div>
         )}
      </CardContent>
    </Card>
  );
}
