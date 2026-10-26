import React from 'react';
import { SummaryData } from '../../types';

interface OverviewMetricsProps {
  summary: SummaryData;
  isDarkMode: boolean;
}

export const OverviewMetrics: React.FC<OverviewMetricsProps> = ({ summary, isDarkMode }) => {
  const formatUSD = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(val);
  };

  const cards = [
    {
      title: 'Total Balance',
      value: formatUSD(summary.totalBalance),
      valueColor: isDarkMode ? 'text-[#f5f5f4]' : 'text-slate-900',
    },
    {
      title: 'Income',
      value: formatUSD(summary.monthlyIncome),
      valueColor: 'text-emerald-400',
    },
    {
      title: 'Expenses',
      value: formatUSD(summary.monthlyExpenses),
      valueColor: isDarkMode ? 'text-blue-300' : 'text-blue-600',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 max-sm:grid-cols-1 max-sm:gap-3">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`rounded-2xl border shadow-soft transition-all p-6 max-sm:p-4 ${
            isDarkMode ? 'bg-[#1a181c] border-white/[0.08]' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div
            className={`mb-2 text-sm font-medium max-sm:text-xs ${
              isDarkMode ? 'text-stone-400' : 'text-slate-500'
            }`}
          >
            {card.title}
          </div>
          <div className={`text-3xl font-bold tracking-tight max-sm:text-xl ${card.valueColor}`}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
};
