
'use client';

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarContent,
  useSidebar
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';


const links = [
  { href: '/dashboard', label: 'Dasbor', icon: LayoutDashboard },
  { href: '/debtors', label: 'Debitur', icon: Users },
  { href: '/report', label: 'Laporan', icon: FileText },
  { href: '/settings', label: 'Pengaturan', icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [debtorStats, setDebtorStats] = useState({ total: 0, overdue: 0 });

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }
    
    const fetchDebtorStats = async () => {
      const { data } = await supabase.from('debtors').select('status');
      if (data) {
        const total = data.length;
        const overdue = data.filter(d => d.status === 'overdue').length;
        setDebtorStats({ total, overdue });
      }
    }
    
    fetchUser();
    fetchDebtorStats();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
       toast({
        title: "Gagal Keluar",
        description: error.message,
        variant: "destructive",
      });
    } else {
        router.push('/login');
        router.refresh();
        toast({
            title: "Berhasil Keluar",
            description: "Anda telah keluar dari sesi.",
        });
    }
  };

  const getInitials = (name = '') => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <>
      <SidebarHeader className="p-3 sm:p-4">
        <div className={cn("p-2 sm:p-3", state === 'expanded' ? "w-full" : "")}>
          <Button variant="ghost" className="w-full justify-start gap-3 sm:gap-4 px-3 h-14 sm:h-16 text-base sm:text-lg" onClick={toggleSidebar}>
              <div className="p-2 sm:p-2.5 bg-primary rounded-lg flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground sm:h-7 sm:w-7"><path d="m12 19-7-7 7-7"/><path d="M19 19-7 7"/></svg>
              </div>
              <h2 className={cn("font-headline text-xl sm:text-2xl font-semibold text-sidebar-foreground truncate transition-opacity duration-200", state === 'collapsed' && 'opacity-0 w-0')}>YGM</h2>
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-3 sm:p-4">
        <SidebarMenu className="space-y-2">
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(link.href)}
                tooltip={link.label}
                className="h-12 sm:h-14 text-base sm:text-lg px-3 sm:px-4 py-3 sm:py-4"
              >
                <Link href={link.href} className="relative flex items-center gap-3 sm:gap-4">
                  <link.icon className={cn(
                      'h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 ease-in-out flex-shrink-0',
                      state === 'expanded' ? 'group-hover:rotate-[10deg]' : ''
                    )} />
                  <span className="font-medium">{link.label}</span>
                  {link.href === '/debtors' && debtorStats.total > 0 && (
                    <span className="ml-auto text-sm sm:text-base bg-primary text-primary-foreground rounded-full px-2.5 py-1 min-w-[24px] text-center font-semibold">
                      {debtorStats.total}
                    </span>
                  )}
                  {link.href === '/debtors' && debtorStats.overdue > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 bg-destructive rounded-full border-2 border-sidebar-background"></span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-3 sm:p-4 mt-auto border-t border-sidebar-border">
         <div className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3">
            <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border flex-shrink-0">
                <AvatarImage src={`https://i.pravatar.cc/100?u=${user?.id}`} alt={user?.user_metadata?.full_name} data-ai-hint="person portrait" />
                <AvatarFallback className="text-base sm:text-lg font-semibold">{getInitials(user?.user_metadata?.full_name)}</AvatarFallback>
            </Avatar>
            <div className={cn("flex flex-col text-base sm:text-lg truncate transition-opacity duration-200", state === 'collapsed' && 'opacity-0 w-0')}>
                <span className="font-semibold text-sidebar-foreground leading-tight">{user?.user_metadata?.full_name || 'Pengguna'}</span>
                <span className="text-sm sm:text-base text-muted-foreground leading-tight">{user?.email}</span>
            </div>
            <Button variant="ghost" size="icon" className={cn("ml-auto text-muted-foreground hover:text-sidebar-foreground flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12")} onClick={handleLogout} title="Keluar">
                <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
         </div>
      </SidebarFooter>
    </>
  );
}
