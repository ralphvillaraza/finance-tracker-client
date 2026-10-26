import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { CashFlowPoint } from '../../types';

interface CashFlowAnalyticsProps {
  data: CashFlowPoint[];
  isDarkMode: boolean;
}

export const CashFlowAnalytics: React.FC<CashFlowAnalyticsProps> = ({ data, isDarkMode }) => {
  const formatYAxis = (val: number) => {
    if (val === 0) return '$0';
    return `$${(val / 1000).toFixed(0)}k`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const income = payload.find((p: any) => p.dataKey === 'income')?.value || 0;
      const expenses = payload.find((p: any) => p.dataKey === 'expenses')?.value || 0;
      const diff = income - expenses;

      return (
        <div
          className={`p-3 rounded-xl shadow-modal text-xs border min-w-[150px] ${
            isDarkMode
              ? 'bg-[#232026] text-[#f5f5f4] border-white/[0.08]'
              : 'bg-white text-slate-900 border-slate-200'
          }`}
        >
          <p
            className={`text-[11px] font-semibold mb-1.5 pb-1 ${
              isDarkMode ? 'text-stone-400 border-b border-white/[0.06]' : 'text-slate-500 border-b border-slate-200'
            }`}
          >
            {label}
          </p>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className={isDarkMode ? 'text-stone-300' : 'text-slate-600'}>Income:</span>
              <span className={isDarkMode ? 'font-semibold text-emerald-400' : 'font-semibold text-emerald-700'}>
                ${income.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={isDarkMode ? 'text-stone-300' : 'text-slate-600'}>Expenses:</span>
              <span className={isDarkMode ? 'font-semibold text-blue-300' : 'font-semibold text-blue-700'}>
                ${expenses.toLocaleString()}
              </span>
            </div>
            <div
              className={`pt-1 flex items-center justify-between text-[11px] ${
                isDarkMode ? 'border-t border-white/[0.06]' : 'border-t border-slate-200'
              }`}
            >
              <span className={isDarkMode ? 'text-stone-400' : 'text-slate-500'}>Net:</span>
              <span
                className={`font-semibold ${
                  diff >= 0
                    ? isDarkMode
                      ? 'text-emerald-400'
                      : 'text-emerald-700'
                    : isDarkMode
                      ? 'text-blue-300'
                      : 'text-blue-700'
                }`}
              >
                {diff >= 0 ? `+$${diff.toLocaleString()}` : `-$${Math.abs(diff).toLocaleString()}`}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={`rounded-2xl border shadow-soft p-6 max-sm:p-4 ${
        isDarkMode ? 'bg-[#1a181c] border-white/[0.08]' : 'bg-slate-50 border-slate-200'
      }`}
    >
      {/* Header */}
      <div
        className={`mb-4 flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between ${
          isDarkMode ? 'border-b border-white/[0.06]' : 'border-b border-slate-200'
        }`}
      >
        <div>
          <h2 className={`text-base font-semibold max-sm:text-sm ${isDarkMode ? 'text-[#f5f5f4]' : 'text-slate-900'}`}>
            Income & Expenses Over Time
          </h2>
          <p className={`mt-0.5 text-xs max-sm:text-[11px] ${isDarkMode ? 'text-stone-400' : 'text-slate-500'}`}>
            Monthly comparison
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-medium sm:gap-3 sm:text-xs">
          <div className={`flex items-center gap-1.5 ${isDarkMode ? 'text-stone-300' : 'text-slate-600'}`}>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Income</span>
          </div>
          <div className={`flex items-center gap-1.5 ${isDarkMode ? 'text-stone-300' : 'text-slate-600'}`}>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Expenses</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="warmIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="warmExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.08)'}
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDarkMode ? '#78716c' : '#64748b', fontSize: 11 }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={formatYAxis}
              tick={{ fill: isDarkMode ? '#78716c' : '#64748b', fontSize: 11 }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#warmIncome)"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#warmExpense)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
