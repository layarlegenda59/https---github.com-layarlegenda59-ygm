import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Gem, AlertTriangle, Shield } from "lucide-react";
import { Debtor } from "@/lib/types";

interface StatsCardsProps {
    debtors: Debtor[];
}

export function StatsCards({ debtors }: StatsCardsProps) {
    // Calculate real statistics from user input data
    const totalDebt = debtors.reduce((acc, debtor) => acc + (debtor.total_debt || 0), 0);
    
    // Count unique debtors by name (case-insensitive)
    const uniqueDebtorNames = new Set(debtors.map(d => d.name.toLowerCase().trim()));
    const totalDebtors = uniqueDebtorNames.size;
    
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
    const overdueDebt = debtors.filter(d => d.status === 'overdue').reduce((acc, debtor) => acc + (debtor.total_debt || 0), 0);

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 sm:pb-2">
          <CardTitle className="text-base sm:text-sm font-medium text-muted-foreground">Total Utang</CardTitle>
          <div className="p-2 bg-primary/10 rounded-full">
            <DollarSign className="h-5 w-5 sm:h-4 sm:w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-xl sm:text-3xl font-bold font-headline text-foreground leading-tight">Rp{totalDebt.toLocaleString('id-ID')}</div>
          <p className="text-sm sm:text-xs text-muted-foreground mt-2 sm:mt-1">
            {totalDebtors > 0 ? `Dari ${totalDebtors} debitur` : 'Belum ada data'}
          </p>
        </CardContent>
      </Card>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 sm:pb-2">
          <CardTitle className="text-base sm:text-sm font-medium text-muted-foreground">Debitur Aktif</CardTitle>
          <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
            <Users className="h-5 w-5 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-xl sm:text-3xl font-bold font-headline text-foreground leading-tight">{totalDebtors}</div>
          <p className="text-sm sm:text-xs text-muted-foreground mt-2 sm:mt-1">
            {totalDebtors > 0 ? `Dari ${totalDebtors} total` : 'Belum ada data'}
          </p>
        </CardContent>
      </Card>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 sm:pb-2">
          <CardTitle className="text-base sm:text-sm font-medium text-muted-foreground">Total Agunan</CardTitle>
          <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-full">
            <Shield className="h-5 w-5 sm:h-4 sm:w-4 text-orange-600 dark:text-orange-400" />
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-xl sm:text-3xl font-bold font-headline text-foreground leading-tight">{totalCollateral}</div>
          <p className="text-sm sm:text-xs text-muted-foreground mt-2 sm:mt-1">
            {totalDebtors > 0 ? `Dari ${totalDebtors} debitur` : 'Belum ada data'}
          </p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 sm:pb-2">
          <CardTitle className="text-base sm:text-sm font-medium text-red-700 dark:text-red-300">Akun Menunggak</CardTitle>
          <AlertTriangle className="h-5 w-5 sm:h-4 sm:w-4 text-red-600 dark:text-red-400" />
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-xl sm:text-2xl font-bold text-red-900 dark:text-red-100 leading-tight">{overdueCount}</div>
          <p className="text-sm sm:text-xs text-red-600 dark:text-red-400 mt-2 sm:mt-1">
            Total utang: Rp{overdueDebt.toLocaleString('id-ID')}
          </p>
        </CardContent>
      </Card>
    </>
  );
}
