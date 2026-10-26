import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { CreateTransactionPayload, TransactionType } from '../../types';

interface RecordTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateTransactionPayload) => Promise<void>;
  isDarkMode: boolean;
}

const CATEGORIES = {
  expense: [
    'Housing',
    'Groceries & Dining',
    'Transportation',
    'Utilities',
    'Entertainment',
    'Healthcare',
    'Shopping',
    'Other',
  ],
  income: [
    'Salary',
    'Investments',
    'Freelance',
    'Bonus',
    'Gift',
    'Other',
  ],
};

export const RecordTransactionModal: React.FC<RecordTransactionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isDarkMode,
}) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES.expense[0]);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setCategory(CATEGORIES[type][0]);
  }, [type]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMsg('Please enter a valid positive dollar amount.');
      return;
    }

    if (!description.trim()) {
      setErrorMsg('Please enter a short description.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        type,
        amount: parsedAmount,
        category,
        description: description.trim(),
        date,
      });

      setAmount('');
      setDescription('');
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentCategories = CATEGORIES[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className={`rounded-2xl p-6 sm:p-7 max-w-md w-full shadow-modal border relative animate-pop ${
          isDarkMode
            ? 'bg-[#1a181c] border-white/[0.08] text-[#f5f5f4]'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between pb-4 ${
            isDarkMode ? 'border-b border-white/[0.06]' : 'border-b border-slate-200'
          }`}
        >
          <h3 className={`text-base font-semibold ${isDarkMode ? 'text-[#f5f5f4]' : 'text-slate-900'}`}>
            Add Transaction
          </h3>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDarkMode
                ? 'text-stone-400 hover:text-[#f5f5f4] hover:bg-white/[0.06]'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div
            className={`mt-3.5 p-2.5 text-xs rounded-xl ${
              isDarkMode
                ? 'bg-blue-500/10 border border-blue-500/30 text-blue-300'
                : 'bg-blue-50 border border-blue-200 text-blue-700'
            }`}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Expense vs Income Toggle */}
          <div
            className={`grid grid-cols-2 p-1 rounded-xl border gap-1 ${
              isDarkMode ? 'bg-white/[0.04] border-white/[0.06]' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                type === 'expense'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : isDarkMode
                    ? 'text-stone-400 hover:text-stone-200'
                    : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : isDarkMode
                    ? 'text-stone-400 hover:text-stone-200'
                    : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Income
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-slate-500'}`}>
              Amount ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border focus:border-blue-500 focus:outline-none text-lg font-bold transition-all ${
                isDarkMode
                  ? 'bg-white/[0.04] border-white/[0.08] text-[#f5f5f4] placeholder-stone-600'
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Category Chips */}
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${isDarkMode ? 'text-stone-400' : 'text-slate-500'}`}>
              Category
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
              {currentCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    category === cat
                      ? type === 'income'
                        ? isDarkMode
                          ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50 font-medium'
                          : 'bg-emerald-100 text-emerald-700 border-emerald-300 font-medium'
                        : isDarkMode
                          ? 'bg-blue-600/30 text-blue-200 border-blue-500/60 font-medium'
                          : 'bg-blue-100 text-blue-700 border-blue-300 font-medium'
                      : isDarkMode
                        ? 'bg-white/[0.03] text-stone-400 border-white/[0.06] hover:bg-white/[0.06]'
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-slate-500'}`}>
              Description
            </label>
            <input
              type="text"
              required
              placeholder={type === 'income' ? 'e.g. Monthly salary' : 'e.g. Grocery run'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-3.5 py-2 rounded-xl border focus:border-blue-500 focus:outline-none text-xs transition-all ${
                isDarkMode
                  ? 'bg-white/[0.04] border-white/[0.08] text-[#f5f5f4] placeholder-stone-600'
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Date */}
          <div>
            <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-slate-500'}`}>
              Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full px-3.5 py-2 rounded-xl border focus:border-blue-500 focus:outline-none text-xs transition-all ${
                isDarkMode
                  ? 'bg-white/[0.04] border-white/[0.08] text-[#f5f5f4]'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            />
          </div>

          {/* Actions */}
          <div
            className={`pt-2 flex items-center justify-end gap-2 ${
              isDarkMode ? 'border-t border-white/[0.06]' : 'border-t border-slate-200'
            }`}
          >
            <button
              type="button"
              onClick={onClose}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-colors ${
                isDarkMode ? 'text-stone-400 hover:text-stone-200' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2 rounded-xl transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
