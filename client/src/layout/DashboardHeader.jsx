import {
  Bell,
  CalendarDays,
  Menu,
  Moon,
  Sun,
} from 'lucide-react';
import { format } from 'date-fns';

export default function DashboardHeader({
  user,
  theme,
  onToggleTheme,
  onOpenSidebar,
}) {
  return (
    <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200/70 bg-white/90 px-5 backdrop-blur-xl sm:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          onClick={onOpenSidebar}
          aria-label="Open sidebar"
        >
          <Menu size={21} />
        </button>

        <div>
          <p className="text-xs font-medium text-slate-400">
            Workspace / Overview
          </p>
          <p className="mt-1 text-sm font-extrabold text-slate-800">
            My dashboard
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <span className="hidden items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500 sm:flex">
          <CalendarDays size={14} />
          {format(new Date(), 'EEE, MMM d')}
        </span>

        <div className="hidden h-7 w-px bg-slate-200 sm:block" />

        <button
          onClick={onToggleTheme}
          className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle color theme"
        >
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        <button
          className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100"
          title="Notifications are not configured"
          aria-label="Notifications are not configured"
        >
          <Bell size={19} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-500" />
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
          {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
