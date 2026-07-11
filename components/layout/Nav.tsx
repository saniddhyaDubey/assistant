import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Nav() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold">
          sd<span className="text-accent">.</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-muted">
          <Link href="/" className="hover:text-foreground transition-colors">
            today
          </Link>
          <Link href="/history" className="hover:text-foreground transition-colors">
            history
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
