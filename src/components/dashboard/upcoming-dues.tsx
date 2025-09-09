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
import { debtors } from "@/lib/data";
import { cn } from "@/lib/utils";

export function UpcomingDues() {
  const upcoming = debtors
    .filter(d => d.status === 'due' || d.status === 'overdue')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Upcoming Due Dates</CardTitle>
        <CardDescription>A list of debtors with upcoming or overdue payments.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Debtor</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="hidden sm:table-cell">Due Date</TableHead>
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
                <TableCell className="text-right">${debtor.totalDebt.toLocaleString()}</TableCell>
                <TableCell className="hidden sm:table-cell">{new Date(debtor.dueDate).toLocaleDateString()}</TableCell>
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
                    {debtor.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
