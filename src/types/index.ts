export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: number;
  user_id: number;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string;
  created_at?: string;
  updated_at?: string;
}

export interface SummaryData {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsGoal: {
    target: number;
    achievedPercent: number;
  };
}

export interface CashFlowPoint {
  month: string;
  income: number;
  expenses: number;
}

export interface CreateTransactionPayload {
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface FilterState {
  type: 'all' | 'income' | 'expense';
  category: string;
  search: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface SignupPayload {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface VerifySignupPayload {
  email: string;
  code: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}
