'use client';

import { Bell } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Debtor } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import Link from 'next/link';
import { differenceInDays, parseISO } from 'date-fns';

interface NotificationBellProps {
  debtors: Debtor[];
}

export function NotificationBell({ debtors }: NotificationBellProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const notifications = debtors
    .filter((debtor) => {
      if (debtor.status === 'paid') return false;
      const dueDate = parseISO(debtor.dueDate);
      const daysUntilDue = differenceInDays(dueDate, today);
      // Tampilkan jika sudah lewat jatuh tempo (overdue) atau akan jatuh tempo dalam 3 hari.
      return daysUntilDue <= 3;
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const notificationCount = notifications.length;
  
  const getNotificationText = (dueDate: string) => {
    const dueDateObj = parseISO(dueDate);
    const daysDiff = differenceInDays(dueDateObj, today);

    if (daysDiff < 0) {
      return `Telah jatuh tempo ${Math.abs(daysDiff)} hari lalu.`;
    }
    if (daysDiff === 0) {
      return 'Jatuh tempo hari ini.';
    }
    return `Jatuh tempo dalam ${daysDiff} hari.`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
              {notificationCount}
            </span>
          )}
          <span className="sr-only">Buka notifikasi</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <Card className="border-0 shadow-none">
            <CardHeader className="p-2">
                <CardTitle className="text-base">Notifikasi Jatuh Tempo</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
                {notificationCount > 0 ? (
                    <div className="flex flex-col gap-2">
                        {notifications.slice(0, 5).map((debtor) => (
                        <Link href="/debtors" key={debtor.id}>
                            <div className="flex items-start gap-3 rounded-lg p-2 hover:bg-muted/50 transition-colors">
                                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                                <div className="text-sm">
                                    <p className="font-medium">{debtor.name}</p>
                                    <p className="text-muted-foreground">
                                        {getNotificationText(debtor.dueDate)}
                                    </p>
                                </div>
                            </div>
                        </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">Tidak ada notifikasi baru.</p>
                )}
            </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
