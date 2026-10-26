import React, { useState } from 'react';
import { Trash2, Search, Plus } from 'lucide-react';
import { Transaction, TransactionType } from '../../types';

interface TransactionListProps {
  transactions: Transaction[];
  onOpenModal: () => void;
  onDeleteTransaction: (id: number) => void;
  isDarkMode: boolean;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onOpenModal,
  onDeleteTransaction,
  isDarkMode,
}) => {
  const [selectedType, setSelectedType] = useState<'all' | TransactionType>('all');
  const [query, setQuery] = useState('');

  // Filter in-memory to keep interactions instant while debugging API responses.
  const filtered = transactions.filter((t) => {
    const matchesType = selectedType === 'all' || t.type === selectedType;
    const matchesQuery =
      !query ||
      t.description.toLowerCase().includes(query.toLowerCase()) ||
      t.category.toLowerCase().includes(query.toLowerCase());
    return matchesType && matchesQuery;
  });

  const formatCurrency = (amount: number, type: TransactionType) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);

    return type === 'income' ? `+${formatted}` : `-${formatted}`;
  };

  return (
    <div
      className={`rounded-2xl border shadow-soft flex flex-col justify-between h-full p-6 max-sm:p-4 ${
        isDarkMode ? 'bg-[#1a181c] border-white/[0.08]' : 'bg-slate-50 border-slate-200'
      }`}
    >
      {/* Header */}
      <div>
        <div
          className={`mb-3 flex items-center justify-between pb-4 ${
            isDarkMode ? 'border-b border-white/[0.06]' : 'border-b border-slate-200'
          }`}
        >
          <div>
            <h2 className={`text-base font-semibold max-sm:text-sm ${isDarkMode ? 'text-[#f5f5f4]' : 'text-slate-900'}`}>
              Recent Transactions
            </h2>
            <p className={`mt-0.5 text-xs max-sm:text-[11px] ${isDarkMode ? 'text-stone-400' : 'text-slate-500'}`}>
              Where your money went
            </p>
          </div>
          <button
            onClick={onOpenModal}
            className="group relative inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-semibold rounded-xl px-3 py-1.5 shadow-sm transition-all max-sm:w-8 max-sm:h-8 max-sm:px-0 max-sm:py-0 max-sm:rounded-full"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5] max-sm:w-3.5 max-sm:h-3.5" />
            <span className="sm:inline max-sm:absolute max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:top-full max-sm:mt-1 max-sm:scale-90 max-sm:rounded-md max-sm:bg-slate-900 max-sm:px-1.5 max-sm:py-1 max-sm:text-[10px] max-sm:text-white max-sm:opacity-0 max-sm:transition-all max-sm:group-hover:opacity-100 max-sm:group-focus-visible:opacity-100 max-sm:group-active:opacity-100 max-sm:pointer-events-none">
              Add
            </span>
          </button>
        </div>

        {/* Filter controls & search */}
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {/* All / Expenses / Income tabs */}
          <div
            className={`flex flex-wrap p-1 rounded-xl text-xs font-medium ${
              isDarkMode ? 'bg-white/[0.05]' : 'bg-slate-100'
            }`}
          >
            <button
              onClick={() => setSelectedType('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                selectedType === 'all'
                  ? isDarkMode
                    ? 'bg-white/[0.12] text-[#f5f5f4]'
                    : 'bg-white text-slate-900'
                  : isDarkMode
                    ? 'text-stone-400 hover:text-stone-200'
                    : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedType('expense')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                selectedType === 'expense'
                  ? isDarkMode
                    ? 'bg-blue-500/20 text-blue-300 font-semibold'
                    : 'bg-blue-100 text-blue-700 font-semibold'
                  : isDarkMode
                    ? 'text-stone-400 hover:text-stone-200'
                    : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setSelectedType('income')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                selectedType === 'income'
                  ? isDarkMode
                    ? 'bg-emerald-500/20 text-emerald-400 font-semibold'
                    : 'bg-emerald-100 text-emerald-700 font-semibold'
                  : isDarkMode
                    ? 'text-stone-400 hover:text-stone-200'
                    : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Income
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:max-w-[180px] sm:flex-1">
            <Search
              className={`w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                isDarkMode ? 'text-stone-400' : 'text-slate-400'
              }`}
            />
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`w-full text-xs pl-7 pr-2.5 py-1.5 rounded-xl border focus:border-blue-500 focus:outline-none transition-all ${
                isDarkMode
                  ? 'bg-white/[0.04] text-[#f5f5f4] placeholder-stone-500 border-white/[0.06]'
                  : 'bg-white text-slate-900 placeholder-slate-400 border-slate-200'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Scrolling Transaction List */}
      <div className="flex-1 overflow-y-auto max-h-[360px] space-y-1.5 pr-1">
        {filtered.length === 0 ? (
          <div className={`text-center py-10 text-xs ${isDarkMode ? 'text-stone-500' : 'text-slate-500'}`}>
            No transactions found. Click "Add" above to record one.
          </div>
        ) : (
          // Render list from already-filtered data to isolate UI issues from filter logic.
          filtered.map((t) => {
            const isIncome = t.type === 'income';

            return (
              <div
                key={t.id}
                className={`group flex items-center justify-between p-2.5 rounded-xl transition-colors border border-transparent ${
                  isDarkMode
                    ? 'hover:bg-white/[0.04] hover:border-white/[0.04]'
                    : 'hover:bg-slate-100 hover:border-slate-200'
                }`}
              >
                {/* Left: Description, category & date */}
                <div className="min-w-0 pr-2">
                  <div className={`text-xs font-medium truncate ${isDarkMode ? 'text-[#f5f5f4]' : 'text-slate-900'}`}>
                    {t.description}
                  </div>
                  <div
                    className={`text-[11px] flex items-center gap-1.5 mt-0.5 ${
                      isDarkMode ? 'text-stone-400' : 'text-slate-500'
                    }`}
                  >
                    <span>{t.category}</span>
                    <span className={isDarkMode ? 'text-stone-600' : 'text-slate-400'}>&bull;</span>
                    <span>{t.date}</span>
                  </div>
                </div>

                {/* Right: Amount & Delete */}
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-xs sm:text-sm font-semibold tracking-tight ${
                      isIncome
                        ? isDarkMode
                          ? 'text-emerald-400'
                          : 'text-emerald-700'
                        : isDarkMode
                          ? 'text-blue-300'
                          : 'text-blue-700'
                    }`}
                  >
                    {formatCurrency(t.amount, t.type)}
                  </span>
                  <button
                    onClick={() => onDeleteTransaction(t.id)}
                    title="Delete record"
                    className={`opacity-0 group-hover:opacity-100 p-1 transition-all rounded ${
                      isDarkMode
                        ? 'text-stone-500 hover:text-blue-300'
                        : 'text-slate-400 hover:text-blue-700'
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
