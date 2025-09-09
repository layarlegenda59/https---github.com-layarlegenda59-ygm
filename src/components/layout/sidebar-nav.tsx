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
  Gem,
  MessageSquare,
  Settings,
  BookText,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

const links = [
  { href: '/', label: 'Dasbor', icon: LayoutDashboard },
  { href: '/debtors', label: 'Debitur', icon: Users },
  { href: '/laporan', label: 'Laporan', icon: BookText },
  { href: '/collateral', label: 'Agunan', icon: Gem },
  { href: '/notifications', label: 'Notifikasi', icon: MessageSquare },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();

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
                isActive={pathname === link.href}
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
                <AvatarImage src="https://picsum.photos/100" alt="Pengguna" data-ai-hint="person portrait" />
                <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className={cn("flex flex-col text-sm truncate transition-opacity duration-200", state === 'collapsed' && 'opacity-0 w-0')}>
                <span className="font-semibold text-sidebar-foreground">Admin User</span>
                <span className="text-xs text-muted-foreground">admin@dalemkaum.com</span>
            </div>
            <Button variant="ghost" size="icon" className={cn("ml-auto text-muted-foreground hover:text-sidebar-foreground flex-shrink-0 transition-opacity duration-200", state === 'collapsed' && 'opacity-0 w-0')}>
                <Settings className="w-5 h-5" />
            </Button>
         </div>
      </SidebarFooter>
    </>
  );
}
