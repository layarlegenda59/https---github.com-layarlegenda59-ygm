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
      const dueDate = parseISO(debtor.due_date);
      const daysUntilDue = differenceInDays(dueDate, today);
      // Tampilkan jika sudah lewat jatuh tempo (overdue) atau akan jatuh tempo dalam 3 hari.
      return daysUntilDue <= 3;
    })
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

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
        <Button variant="ghost" size="icon" className="relative h-10 w-10 sm:h-11 sm:w-11">
          <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-destructive text-xs sm:text-sm text-destructive-foreground font-semibold">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
          <span className="sr-only">Buka notifikasi</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 sm:w-96">
        <Card className="border-0 shadow-none">
            <CardHeader className="p-3 sm:p-4">
                <CardTitle className="text-lg sm:text-xl">Notifikasi Jatuh Tempo</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4">
                {notificationCount > 0 ? (
                    <div className="flex flex-col gap-3">
                        {notifications.slice(0, 5).map((debtor) => (
                        <Link href="/debtors" key={debtor.id}>
                            <div className="flex items-start gap-3 sm:gap-4 rounded-lg p-3 hover:bg-muted/50 transition-colors">
                                <div className="mt-1 h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-primary flex-shrink-0" />
                                <div className="text-sm sm:text-base min-w-0 flex-1">
                                    <p className="font-medium truncate">{debtor.name}</p>
                                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                                        {getNotificationText(debtor.due_date)}
                                    </p>
                                </div>
                            </div>
                        </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm sm:text-base text-muted-foreground text-center py-6">Tidak ada notifikasi baru.</p>
                )}
            </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
