import React from 'react';
import { Plus, Moon, Sun, LogOut } from 'lucide-react';

interface NavbarProps {
  onOpenModal: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  userName?: string;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenModal,
  isDarkMode,
  onToggleTheme,
  userName,
  onLogout,
}) => {
  return (
    <header
      className={`sticky top-0 z-30 backdrop-blur-md border-b ${
        isDarkMode ? 'bg-[#121114]/90 border-white/[0.08]' : 'bg-white/95 border-slate-200'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-2 py-2 sm:h-16 sm:py-0">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src="/images/Finance_Tracker_Logo.png"
              alt="FinanceTracker logo"
              className="h-10 w-auto rounded-md object-contain max-sm:h-8"
            />
            <div className="min-w-0">
              <span
                className={`block truncate text-lg font-bold tracking-tight sm:text-xl ${
                  isDarkMode ? 'text-[#f5f5f4]' : 'text-slate-900'
                }`}
              >
                FinanceTracker
              </span>
              {userName ? (
                <span className={`text-[10px] uppercase tracking-[0.14em] ${isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}>
                  {userName}
                </span>
              ) : (
                <span className={`block text-[10px] uppercase tracking-[0.18em] ${isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}>
                  NAWEEB
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 sm:gap-3">
            <button
              onClick={onToggleTheme}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to night mode'}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to night mode'}
              className={`inline-flex items-center justify-center gap-2 rounded-full border text-xs font-medium transition-colors max-sm:h-9 max-sm:w-9 max-sm:p-0 max-sm:gap-0 sm:h-10 sm:px-3 ${
                isDarkMode
                  ? 'border-white/[0.08] bg-white/[0.04] text-stone-300 hover:bg-white/[0.08] hover:text-[#f5f5f4]'
                  : 'border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="hidden sm:inline">Night</span>
            </button>

            <button
              onClick={onOpenModal}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-3 py-2 text-[11px] font-semibold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-[0.98] max-sm:min-w-[128px] max-sm:justify-between max-sm:px-2.5 sm:px-4"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span className="whitespace-nowrap">Add Transactions</span>
            </button>

            {onLogout ? (
              <button
                onClick={onLogout}
                title="Log out"
                aria-label="Log out"
                className={`inline-flex items-center justify-center gap-2 rounded-full border text-xs font-medium transition-colors max-sm:h-9 max-sm:w-9 max-sm:p-0 max-sm:gap-0 sm:h-10 sm:px-3 ${
                  isDarkMode
                    ? 'border-white/[0.08] bg-white/[0.04] text-stone-300 hover:bg-white/[0.08] hover:text-[#f5f5f4]'
                    : 'border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Log out</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};
