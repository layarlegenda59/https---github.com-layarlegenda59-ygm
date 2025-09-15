'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { Debtor } from '@/lib/types';

// Dynamic import untuk mengatasi masalah SSR dengan Recharts
const DebtOverviewChart = dynamic(
  () => import('./debt-overview-chart').then(mod => ({ default: mod.DebtOverviewChart })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Memuat grafik...</span>
      </div>
    ),
  }
);

interface ChartWrapperProps {
  debtors: Debtor[];
}

export function ChartWrapper({ debtors }: ChartWrapperProps) {
  return <DebtOverviewChart debtors={debtors} />;
}