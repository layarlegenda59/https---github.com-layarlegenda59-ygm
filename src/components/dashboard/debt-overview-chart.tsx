"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Debtor } from "@/lib/types"

const chartConfig = {
  total: {
    label: "Total Utang",
  },
  paid: {
    label: "Lunas",
    color: "hsl(var(--chart-1))",
  },
  due: {
    label: "Jatuh Tempo",
    color: "hsl(var(--chart-2))",
  },
  overdue: {
    label: "Tunggakan",
    color: "hsl(var(--chart-3))",
  },
  takeover: {
    label: "Take Over",
    color: "hsl(var(--chart-4))",
  },
}

interface DebtOverviewChartProps {
  debtors: Debtor[];
}

export function DebtOverviewChart({ debtors }: DebtOverviewChartProps) {
  const paidTotal = debtors
    .filter(d => d.status === 'paid')
    .reduce((acc, d) => acc + d.total_debt, 0);

  const dueTotal = debtors
    .filter(d => d.status === 'due')
    .reduce((acc, d) => acc + d.total_debt, 0);

  const overdueTotal = debtors
    .filter(d => d.status === 'overdue')
    .reduce((acc, d) => acc + d.total_debt, 0);

  const takeoverTotal = debtors
    .filter(d => d.status === 'takeover')
    .reduce((acc, d) => acc + d.total_debt, 0);

  const chartData = [
    { status: 'Lunas', total: paidTotal, fill: 'hsl(var(--chart-1))' },
    { status: 'Jatuh Tempo', total: dueTotal, fill: 'hsl(var(--chart-2))' },
    { status: 'Tunggakan', total: overdueTotal, fill: 'hsl(var(--chart-3))' },
    { status: 'Take Over', total: takeoverTotal, fill: 'hsl(var(--chart-4))' }
  ].filter(item => item.total > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Ringkasan Utang</CardTitle>
        <CardDescription>
          {debtors.length > 0 
            ? `Data dari ${debtors.length} debitur yang diinput` 
            : 'Belum ada data debitur'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
         {debtors.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                <XAxis
                dataKey="status"
                stroke="hsl(var(--foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                />
                <YAxis
                stroke="hsl(var(--foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `Rp${Number(value) / 1000}k`}
                />
                <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="total" radius={4} />
            </BarChart>
            </ChartContainer>
         ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                    <p className="text-lg font-medium">Belum ada data debitur</p>
                    <p className="text-sm mt-2">Tambahkan debitur pertama untuk melihat grafik</p>
                </div>
            </div>
         )}
      </CardContent>
    </Card>
  )
}
