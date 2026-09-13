import { Search, Sun, Moon, Github, Menu } from 'lucide-react';
import VelclawMark from './VelclawMark';

interface Props {
  dark: boolean;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  onOpenMobileNav: () => void;
}

export default function Header({ dark, onToggleTheme, onOpenSearch, onOpenMobileNav }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-14 flex items-center gap-4">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden h-8 w-8 flex items-center justify-center rounded-md border border-neutral-200 dark:border-neutral-800 active:scale-95 transition-transform"
          aria-label="Mở menu"
        >
          <Menu className="h-4 w-4" />
        </button>

        <a href="/" className="flex items-center gap-2 shrink-0">
          <VelclawMark size={24} />
          <span className="font-semibold text-sm">Velclaw</span>
        </a>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          <span className="px-3 py-1.5 rounded-md font-medium bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
            Tài liệu
          </span>
          <a href="/api" className="px-3 py-1.5 rounded-md text-neutral-500 hover:opacity-80">
            Tham chiếu API
          </a>
        </nav>

        <div className="flex-1" />

        <button
          onClick={onOpenSearch}
          className="hidden sm:flex items-center gap-2 w-64 px-3 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 text-neutral-500 text-sm hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="flex-1 text-left">Tìm kiếm...</span>
          <span className="text-xs font-mono px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-800">⌘K</span>
        </button>

        <button onClick={onOpenSearch} className="sm:hidden h-8 w-8 flex items-center justify-center">
          <Search className="h-4 w-4" />
        </button>

        <a
          href="https://github.com"
          aria-label="GitHub"
          className="h-8 w-8 hidden sm:flex items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
        >
          <Github className="h-4 w-4" />
        </a>

        <button
          onClick={onToggleTheme}
          aria-label="Đổi giao diện sáng/tối"
          className="h-8 w-8 flex items-center justify-center rounded-md border border-neutral-200 dark:border-neutral-800 active:scale-95 transition-transform"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <a
          href="https://velclaw.cfd/deploy"
          className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-md bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium transition-all active:scale-95"
        >
          Bắt đầu
        </a>
      </div>
    </header>
  );
}
