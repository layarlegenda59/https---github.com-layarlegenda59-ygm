import { SidebarTrigger } from "@/components/ui/sidebar";

interface HeaderProps {
  title: string;
  children?: React.ReactNode;
}

export function Header({ title, children }: HeaderProps) {
  return (
    <header className="flex items-center gap-2 md:gap-4 container-spacing section-spacing">
      <SidebarTrigger />
      <h1 className="font-headline text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-foreground truncate flex-1 min-w-0">{title}</h1>
      <div className="ml-auto flex items-center gap-1 md:gap-2 flex-shrink-0">
        {children}
      </div>
    </header>
  );
}
