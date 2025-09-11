
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
  MessageSquare,
  Settings,
  LogOut,
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
  { href: '/notifications', label: 'Notifikasi', icon: MessageSquare },
  { href: '/settings', label: 'Pengaturan', icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }
    fetchUser();
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
      <SidebarHeader className="p-2">
        <div className={cn("p-2", state === 'expanded' ? "w-full" : "")}>
          <Button variant="ghost" className="w-full justify-start gap-3 px-2" onClick={toggleSidebar}>
              <div className="p-2 bg-primary rounded-lg flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground h-6 w-6"><path d="m12 19-7-7 7-7"/><path d="M19 19-7 7"/></svg>
              </div>
              <h2 className={cn("font-headline text-xl font-semibold text-sidebar-foreground truncate transition-opacity duration-200", state === 'collapsed' && 'opacity-0 w-0')}>GM Dalem Kaum</h2>
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(link.href)}
                tooltip={{children: link.label}}
              >
                <Link href={link.href}>
                  <link.icon className={cn(
                      'transition-transform duration-300 ease-in-out',
                      state === 'expanded' ? 'group-hover:rotate-[10deg]' : ''
                    )} />
                  <span>{link.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2 mt-auto border-t border-sidebar-border">
         <div className="flex items-center gap-3 p-2">
            <Avatar className="h-10 w-10 border flex-shrink-0">
                <AvatarImage src={`https://i.pravatar.cc/100?u=${user?.id}`} alt={user?.user_metadata?.full_name} data-ai-hint="person portrait" />
                <AvatarFallback>{getInitials(user?.user_metadata?.full_name)}</AvatarFallback>
            </Avatar>
            <div className={cn("flex flex-col text-sm truncate transition-opacity duration-200", state === 'collapsed' && 'opacity-0 w-0')}>
                <span className="font-semibold text-sidebar-foreground">{user?.user_metadata?.full_name || 'Pengguna'}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
            </div>
            <Button variant="ghost" size="icon" className={cn("ml-auto text-muted-foreground hover:text-sidebar-foreground flex-shrink-0")} onClick={handleLogout} tooltip={{children: 'Keluar'}}>
                <LogOut className="w-5 h-5" />
            </Button>
         </div>
      </SidebarFooter>
    </>
  );
}
