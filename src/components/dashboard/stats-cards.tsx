import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Gem, AlertTriangle } from "lucide-react";
import { Debtor } from "@/lib/types";

interface StatsCardsProps {
    debtors: Debtor[];
}

export function StatsCards({ debtors }: StatsCardsProps) {
    // Calculate real statistics from user input data
    const totalDebt = debtors.reduce((acc, debtor) => acc + (debtor.total_debt || 0), 0);
    const totalDebtors = debtors.length;
    const paidCount = debtors.filter(d => d.status === 'paid').length;
    const dueCount = debtors.filter(d => d.status === 'due').length;
    const overdueCount = debtors.filter(d => d.status === 'overdue').length;
    const takeoverCount = debtors.filter(d => d.status === 'takeover').length;
    
    // Count actual vehicles/collateral from user input
    const totalCollateral = debtors.filter(d => 
        d.vehicle_type || 
        d.police_number || 
        d.stnk_number ||
        d.leasing_bpkb
    ).length;
    
    // Calculate additional metrics
    const activeDebt = debtors.filter(d => d.status !== 'paid').reduce((acc, debtor) => acc + (debtor.total_debt || 0), 0);
    const averageDebt = totalDebtors > 0 ? totalDebt / totalDebtors : 0;

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Utang</CardTitle>
          <div className="p-2 bg-primary/10 rounded-full">
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-3xl font-bold font-headline text-foreground">Rp{totalDebt.toLocaleString('id-ID')}</div>
          <p className="text-xs text-muted-foreground mt-2">
            {totalDebtors > 0 ? `Dari ${totalDebtors} debitur` : 'Belum ada data'}
          </p>
        </CardContent>
      </Card>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Debitur Aktif</CardTitle>
          <div className="p-2 bg-accent/10 rounded-full">
            <Users className="h-4 w-4 text-accent" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-3xl font-bold font-headline text-foreground">{totalDebtors}</div>
          <p className="text-xs text-muted-foreground mt-2">
            {paidCount} lunas • {dueCount} jatuh tempo • {overdueCount} menunggak • {takeoverCount} take over
          </p>
        </CardContent>
      </Card>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Jumlah Agunan</CardTitle>
          <div className="p-2 bg-blue-500/10 rounded-full">
            <Gem className="h-4 w-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-3xl font-bold font-headline text-foreground">{totalCollateral}</div>
          <p className="text-xs text-muted-foreground mt-2">
            {totalCollateral > 0 ? `Kendaraan & aset lainnya` : 'Belum ada agunan'}
          </p>
        </CardContent>
      </Card>
      <Card className="hover:shadow-md transition-shadow border-destructive/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Akun Menunggak</CardTitle>
          <div className="p-2 bg-destructive/10 rounded-full">
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-3xl font-bold font-headline text-destructive">{overdueCount}</div>
          <p className="text-xs text-muted-foreground mt-2">
            {overdueCount > 0 ? `Rp${activeDebt.toLocaleString('id-ID')} total tunggakan` : 'Tidak ada tunggakan'}
          </p>
        </CardContent>
      </Card>
    </>
  );
}
