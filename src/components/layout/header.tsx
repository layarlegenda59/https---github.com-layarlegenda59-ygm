import { SidebarTrigger } from "@/components/ui/sidebar";

interface HeaderProps {
  title: string;
  children?: React.ReactNode;
}

export function Header({ title, children }: HeaderProps) {
  return (
    <header className="flex items-center gap-4">
      <SidebarTrigger className="md:hidden" />
      <h1 className="font-headline text-2xl md:text-3xl font-bold tracking-tight text-foreground">{title}</h1>
      <div className="ml-auto flex items-center gap-2">
        {children}
      </div>
    </header>
  );
}
