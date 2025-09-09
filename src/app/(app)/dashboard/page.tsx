import { Header } from "@/components/layout/header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { UpcomingDues } from "@/components/dashboard/upcoming-dues";
import { DebtOverviewChart } from "@/components/dashboard/debt-overview-chart";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <Header title="Dasbor" />
      <main className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCards />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <div className="lg:col-span-4">
            <UpcomingDues />
          </div>
          <div className="lg:col-span-3">
            <DebtOverviewChart />
          </div>
        </div>
      </main>
    </div>
  );
}
