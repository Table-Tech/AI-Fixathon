import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header className={cn("w-full border-b border-foreground/10 px-6 py-4", className)}>
      <nav className="flex items-center justify-between">
        <span className="text-xl font-bold">AI Fixathon</span>
      </nav>
    </header>
  );
}
