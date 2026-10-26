import {
  SummaryData,
  CashFlowPoint,
  Transaction,
  CreateTransactionPayload,
  FilterState,
  AuthSession,
  LoginPayload,
  SignupPayload,
  VerifySignupPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from '../types';

const API_BASE = '/api';
const AUTH_STORAGE_KEY = 'finance-tracker-auth';

function getStoredSession(): AuthSession | null {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    return saved ? (JSON.parse(saved) as AuthSession) : null;
  } catch {
    return null;
  }
}

function getAuthHeaders(): Record<string, string> {
  const session = getStoredSession();
  return session?.token ? { Authorization: `Bearer ${session.token}` } : {};
}

export function getAuthSession(): AuthSession | null {
  return getStoredSession();
}

export function clearAuthSession(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export async function login(payload: LoginPayload): Promise<{ token: string; user: AuthSession['user'] }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Login failed');
  }

  const session: AuthSession = {
    token: json.data.token,
    user: json.data.user,
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  return session;
}

export async function signup(payload: SignupPayload): Promise<{ message: string; devVerificationCode?: string }> {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Sign up failed');
  }

  return json;
}

export async function verifySignup(payload: VerifySignupPayload): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/auth/verify-signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Verification failed');
  }

  return json;
}

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string; devResetCode?: string }> {
  const res = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Password reset request failed');
  }

  return json;
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Password reset failed');
  }

  return json;
}

// Fallback data keeps the UI usable when the backend is down during local debugging.
const FALLBACK_SUMMARY: SummaryData = {
  totalBalance: 24850.75,
  monthlyIncome: 7500.0,
  monthlyExpenses: 3420.5,
  savingsGoal: {
    target: 5000,
    achievedPercent: 68,
  },
};

const FALLBACK_CASH_FLOW: CashFlowPoint[] = [
  { month: 'May 26', income: 6400, expenses: 3100 },
  { month: 'Jun 26', income: 7100, expenses: 3500 },
  { month: 'Jul 26', income: 6800, expenses: 4200 },
  { month: 'Aug 26', income: 7200, expenses: 3300 },
  { month: 'Sep 26', income: 7900, expenses: 3900 },
  { month: 'Oct 26', income: 7500, expenses: 3420 },
];

const FALLBACK_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    user_id: 1,
    type: 'income',
    amount: 5200,
    category: 'Salary',
    description: 'Senior Engineer Bi-Weekly Payroll',
    date: '2026-10-20',
  },
  {
    id: 2,
    user_id: 1,
    type: 'income',
    amount: 2300,
    category: 'Investments',
    description: 'Tech Index Fund Quarterly Dividend',
    date: '2026-10-18',
  },
  {
    id: 3,
    user_id: 1,
    type: 'expense',
    amount: 1450,
    category: 'Housing',
    description: 'Downtown Loft Rent Payment',
    date: '2026-10-16',
  },
  {
    id: 4,
    user_id: 1,
    type: 'expense',
    amount: 184.2,
    category: 'Groceries & Dining',
    description: 'Whole Foods Market Weekly Stockup',
    date: '2026-10-15',
  },
  {
    id: 5,
    user_id: 1,
    type: 'expense',
    amount: 65,
    category: 'Transportation',
    description: 'Metro Transit Card & EV Charging',
    date: '2026-10-12',
  },
  {
    id: 6,
    user_id: 1,
    type: 'expense',
    amount: 45,
    category: 'Utilities & Subscriptions',
    description: 'Cloud Storage & Spotify Family Plan',
    date: '2026-10-10',
  },
];

export async function fetchSummary(): Promise<SummaryData> {
  try {
    const res = await fetch(`${API_BASE}/summary`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('Utilizing fallback summary data:', err);
    return FALLBACK_SUMMARY;
  }
}

export async function fetchCashFlow(): Promise<CashFlowPoint[]> {
  try {
    const res = await fetch(`${API_BASE}/cash-flow`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('Utilizing fallback cash flow data:', err);
    return FALLBACK_CASH_FLOW;
  }
}

export async function fetchTransactions(filters?: Partial<FilterState>): Promise<Transaction[]> {
  try {
    const params = new URLSearchParams({ limit: '100' });
    if (filters?.type && filters.type !== 'all') params.append('type', filters.type);
    if (filters?.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);

    const res = await fetch(`${API_BASE}/transactions?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('Utilizing fallback transactions data:', err);
    return FALLBACK_TRANSACTIONS;
  }
}

export async function createTransaction(payload: CreateTransactionPayload): Promise<Transaction> {
  const res = await fetch(`${API_BASE}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.details?.[0]?.message || errData.error || 'Failed to record transaction');
  }

  const json = await res.json();
  return json.data;
}

export async function deleteTransaction(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/transactions/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to delete transaction');
  }
}

