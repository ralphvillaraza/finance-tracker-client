import { useState, useEffect, useCallback, useRef } from 'react';
import { Navbar } from './components/layout/Navbar';
import { OverviewMetrics } from './components/dashboard/OverviewMetrics';
import { TransactionList } from './components/dashboard/TransactionList';
import { CashFlowAnalytics } from './components/dashboard/CashFlowAnalytics';
import { RecordTransactionModal } from './components/modals/RecordTransactionModal';
import { AuthScreen } from './components/auth/AuthScreen';
import {
  fetchSummary,
  fetchCashFlow,
  fetchTransactions,
  createTransaction,
  deleteTransaction,
  clearAuthSession,
  getAuthSession,
} from './services/api';
import {
  SummaryData,
  CashFlowPoint,
  Transaction,
  CreateTransactionPayload,
  AuthSession,
} from './types';

export function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(() => getAuthSession());

  const [summary, setSummary] = useState<SummaryData>({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savingsGoal: { target: 5000, achievedPercent: 0 },
  });
  const [cashFlow, setCashFlow] = useState<CashFlowPoint[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isWakeupMessageVisible, setIsWakeupMessageVisible] = useState(false);
  const wakeupTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!session) {
      clearAuthSession();
      return;
    }

    localStorage.setItem('finance-tracker-auth', JSON.stringify(session));
  }, [session]);

  useEffect(() => {
    if (!isLoadingData) {
      if (wakeupTimerRef.current) {
        window.clearTimeout(wakeupTimerRef.current);
        wakeupTimerRef.current = null;
      }
      setIsWakeupMessageVisible(false);
      return;
    }

    wakeupTimerRef.current = window.setTimeout(() => {
      setIsWakeupMessageVisible(true);
    }, 5000);

    return () => {
      if (wakeupTimerRef.current) {
        window.clearTimeout(wakeupTimerRef.current);
        wakeupTimerRef.current = null;
      }
    };
  }, [isLoadingData]);

  const loadData = useCallback(async () => {
    if (!session) return;

    setIsLoadingData(true);

    try {
      const [sum, flow, txs] = await Promise.all([
        fetchSummary(),
        fetchCashFlow(),
        fetchTransactions(),
      ]);

      setSummary(sum);
      setCashFlow(flow);
      setTransactions(txs);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setIsLoadingData(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      loadData();
    }
  }, [loadData, session]);

  const handleCreateTransaction = async (payload: CreateTransactionPayload) => {
    if (!session) return;
    await createTransaction(payload);
    await loadData();
  };

  const handleDeleteTransaction = async (id: number) => {
    if (!session) return;
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id);
      await loadData();
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    setSession(null);
  };

  if (!session) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${
          isDarkMode
            ? 'bg-[#121114] text-[#f5f5f4] selection:bg-blue-600 selection:text-white'
            : 'bg-white text-slate-900 selection:bg-blue-200 selection:text-slate-900'
        }`}
      >
        <AuthScreen isDarkMode={isDarkMode} onAuthSuccess={setSession} />
      </div>
    );
  }

  if (isLoadingData) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center px-6 transition-colors duration-200 ${
          isDarkMode
            ? 'bg-[#121114] text-[#f5f5f4]'
            : 'bg-white text-slate-900'
        }`}
      >
        <div
          className={`w-full max-w-md rounded-2xl border p-8 text-center shadow-soft ${
            isDarkMode ? 'border-white/[0.08] bg-[#1a181c]' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="mb-4 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          </div>
          <h2 className="text-xl font-semibold">Waking up database server...</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-stone-400">
            {isWakeupMessageVisible
              ? 'This might take 30-50 seconds. Please wait while the backend starts up.'
              : 'Connecting to your finance data...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isDarkMode
          ? 'bg-[#121114] text-[#f5f5f4] selection:bg-blue-600 selection:text-white'
          : 'bg-white text-slate-900 selection:bg-blue-200 selection:text-slate-900'
      }`}
    >
      <Navbar
        onOpenModal={() => setIsModalOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode((prev) => !prev)}
        userName={session.user.username}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        <section>
          <OverviewMetrics summary={summary} isDarkMode={isDarkMode} />
        </section>

        <section>
          <TransactionList
            transactions={transactions}
            onOpenModal={() => setIsModalOpen(true)}
            onDeleteTransaction={handleDeleteTransaction}
            isDarkMode={isDarkMode}
          />
        </section>

        <section>
          <CashFlowAnalytics data={cashFlow} isDarkMode={isDarkMode} />
        </section>
      </main>

      <footer
        className={`border-t py-5 text-center text-xs ${
          isDarkMode ? 'border-white/[0.06] text-stone-500' : 'border-slate-200 text-slate-500'
        }`}
      >
        FinanceTracker &bull; Secure personal finance dashboard
      </footer>

      <RecordTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTransaction}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}

export default App;
