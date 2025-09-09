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
import { debtors } from "@/lib/data"

const chartData = debtors.reduce((acc, debtor) => {
  const status = debtor.status.charAt(0).toUpperCase() + debtor.status.slice(1);
  const existing = acc.find(item => item.name === status);
  if (existing) {
    existing.total += debtor.totalDebt;
  } else {
    acc.push({ name: status, total: debtor.totalDebt, fill: `var(--color-${debtor.status})` });
  }
  return acc;
}, [] as { name: string, total: number, fill: string }[]);

const chartConfig = {
  total: {
    label: "Total Debt",
  },
  paid: {
    label: "Paid",
    color: "hsl(var(--chart-2))",
  },
  due: {
    label: "Due",
    color: "hsl(var(--chart-4))",
  },
  overdue: {
    label: "Overdue",
    color: "hsl(var(--destructive))",
  },
}

export function DebtOverviewChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Debt Overview</CardTitle>
        <CardDescription>A summary of total debt by status.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
            <XAxis
              dataKey="name"
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
              tickFormatter={(value) => `$${Number(value) / 1000}k`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="total" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
