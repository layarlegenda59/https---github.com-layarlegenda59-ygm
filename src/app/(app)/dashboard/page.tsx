import { Header } from "@/components/layout/header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { UpcomingDues } from "@/components/dashboard/upcoming-dues";
import { DebtOverviewChart } from "@/components/dashboard/debt-overview-chart";
import { supabase } from "@/lib/supabase/client";

async function getDebtorData() {
    const { data, error } = await supabase.from('debtors').select('*');
    if (error) {
        console.error("Error fetching debtors for dashboard:", error);
        return [];
    }
    return data;
}


export default async function DashboardPage() {
  const debtors = await getDebtorData();
  return (
    <div className="flex flex-col gap-8">
      <Header title="Dasbor" />
      <main className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCards debtors={debtors} />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <div className="lg:col-span-4">
            <UpcomingDues debtors={debtors} />
          </div>
          <div className="lg:col-span-3">
            <DebtOverviewChart debtors={debtors}/>
          </div>
        </div>
      </main>
    </div>
  );
}
