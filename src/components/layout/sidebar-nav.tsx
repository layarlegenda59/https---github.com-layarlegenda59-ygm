'use client';

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarContent,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  Gem,
  MessageSquare,
  Settings,
  FileText,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '../ui/button';

const links = [
  { href: '/', label: 'Dasbor', icon: LayoutDashboard },
  { href: '/debtors', label: 'Debitur', icon: Users },
  { href: '/collateral', label: 'Agunan', icon: Gem },
  { href: '/notifications', label: 'Notifikasi', icon: MessageSquare },
  { href: '/templates', label: 'Template', icon: FileText },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground h-6 w-6"><path d="m12 19-7-7 7-7"/><path d="M19 19-7 7"/></svg>
            </div>
            <h2 className="font-headline text-xl font-semibold text-sidebar-foreground">GM Dalem Kaum</h2>
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
                  <link.icon />
                  <span>{link.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 mt-auto border-t border-sidebar-border">
         <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border">
                <AvatarImage src="https://picsum.photos/100" alt="Pengguna" data-ai-hint="person portrait" />
                <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-sm">
                <span className="font-semibold text-sidebar-foreground">Admin User</span>
                <span className="text-xs text-muted-foreground">admin@dalemkaum.com</span>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto text-muted-foreground hover:text-sidebar-foreground">
                <Settings className="w-5 h-5" />
            </Button>
         </div>
      </SidebarFooter>
    </>
  );
}
