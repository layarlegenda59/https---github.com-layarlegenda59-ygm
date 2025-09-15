'use client';

import { Header } from "@/components/layout/header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { UpcomingDues } from "@/components/dashboard/upcoming-dues";
import { ChartWrapper } from "@/components/dashboard/chart-wrapper";
import { supabase } from "@/lib/supabase/client";
import { NotificationBell } from "@/components/dashboard/notification-bell";
import { useEffect, useState } from 'react';
import { Debtor } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDebtors = async () => {
      setLoading(true);
      try {
        // Check if user is authenticated first
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log("No authenticated user found");
          setDebtors([]);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('debtors')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching debtors for dashboard:", error);
          setDebtors([]);
        } else {
          console.log("Fetched debtors:", data);
          setDebtors(data || []);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setDebtors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDebtors();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        <Header title="Dasbor" />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Memuat data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <Header title="Dasbor">
        <NotificationBell debtors={debtors} />
      </Header>
      <main className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCards debtors={debtors} />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <div className="lg:col-span-4">
            <UpcomingDues debtors={debtors} />
          </div>
          <div className="lg:col-span-3">
            <ChartWrapper debtors={debtors}/>
          </div>
        </div>
      </main>
    </div>
  );
}
