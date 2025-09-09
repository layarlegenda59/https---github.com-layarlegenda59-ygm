import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Gem, AlertTriangle } from "lucide-react";
import { debtors, collaterals } from "@/lib/data";

export function StatsCards() {
    const totalDebt = debtors.reduce((acc, debtor) => acc + debtor.totalDebt, 0);
    const totalDebtors = debtors.length;
    const overdueCount = debtors.filter(d => d.status === 'overdue').length;
    const totalCollateral = collaterals.length;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Utang</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-headline">Rp{totalDebt.toLocaleString('id-ID')}</div>
          <p className="text-xs text-muted-foreground">+2.1% dari bulan lalu</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Debitur Aktif</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-headline">{totalDebtors}</div>
          <p className="text-xs text-muted-foreground">+3 dari bulan lalu</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Jumlah Agunan</CardTitle>
          <Gem className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-headline">{totalCollateral}</div>
          <p className="text-xs text-muted-foreground">Total aset dijaminkan</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Akun Menunggak</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-headline text-destructive">{overdueCount}</div>
          <p className="text-xs text-muted-foreground">Butuh perhatian segera</p>
        </CardContent>
      </Card>
    </>
  );
}
