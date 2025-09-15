import { SidebarTrigger } from "@/components/ui/sidebar";

interface HeaderProps {
  title: string;
  children?: React.ReactNode;
}

export function Header({ title, children }: HeaderProps) {
  return (
    <header className="flex items-center gap-3 sm:gap-4 md:gap-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <SidebarTrigger className="h-8 w-8 sm:h-9 sm:w-9" />
      <h1 className="font-headline text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground truncate flex-1 min-w-0">{title}</h1>
      <div className="ml-auto flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
        {children}
      </div>
    </header>
  );
}
