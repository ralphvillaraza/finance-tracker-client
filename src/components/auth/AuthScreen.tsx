import { FormEvent, useState } from 'react';
import { ArrowRight, CheckCircle2, Lock, Mail, ShieldCheck, User, KeyRound } from 'lucide-react';
import {
  forgotPassword,
  login,
  resetPassword,
  signup,
  verifySignup,
} from '../../services/api';
import type { AuthSession } from '../../types';

type AuthMode = 'login' | 'signup' | 'verify' | 'forgot' | 'reset';

interface AuthScreenProps {
  isDarkMode: boolean;
  onAuthSuccess: (session: AuthSession) => void;
}

const baseInput =
  'w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-blue-500/30';

export function AuthScreen({ isDarkMode, onAuthSuccess }: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [pendingEmail, setPendingEmail] = useState('');
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    code: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetFeedback = () => {
    setError('');
    setMessage('');
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    resetFeedback();
    setIsSubmitting(true);

    try {
      const session = await login({
        username: form.username.trim(),
        password: form.password,
      });
      onAuthSuccess(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (event: FormEvent) => {
    event.preventDefault();
    resetFeedback();
    setIsSubmitting(true);

    try {
      const result = await signup({
        email: form.email.trim(),
        username: form.username.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      setPendingEmail(form.email.trim());
      setMode('verify');
      setMessage(result.message || 'Account created. Verify your email to continue.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (event: FormEvent) => {
    event.preventDefault();
    resetFeedback();
    setIsSubmitting(true);

    try {
      const result = await verifySignup({
        email: (pendingEmail || form.email).trim(),
        code: form.code,
      });
      setMode('login');
      setMessage(result.message || 'Email verified successfully.');
      setForm((prev) => ({ ...prev, password: '', confirmPassword: '', code: '' }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgot = async (event: FormEvent) => {
    event.preventDefault();
    resetFeedback();
    setIsSubmitting(true);

    try {
      const result = await forgotPassword({ email: form.email.trim() });
      setPendingEmail(form.email.trim());
      setMode('reset');
      setMessage(result.message || 'Reset code sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Forgot-password request failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = async (event: FormEvent) => {
    event.preventDefault();
    resetFeedback();
    setIsSubmitting(true);

    try {
      const result = await resetPassword({
        email: (pendingEmail || form.email).trim(),
        code: form.code,
        newPassword: form.password,
        confirmPassword: form.confirmPassword,
      });
      setMode('login');
      setMessage(result.message || 'Password updated successfully.');
      setForm((prev) => ({ ...prev, password: '', confirmPassword: '', code: '' }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password reset failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputTheme = isDarkMode
    ? 'border-white/10 bg-[#1a1b1e] text-white placeholder:text-slate-400'
    : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400';

  const panelTheme = isDarkMode ? 'border-white/10 bg-[#17191d]' : 'border-slate-200 bg-white';
  const mutedText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const strongText = isDarkMode ? 'text-white' : 'text-slate-900';

  const renderAuthFields = () => {
    if (mode === 'signup') {
      return (
        <>
          <label className="block space-y-2 text-sm">
            <span className={mutedText}>Email</span>
            <div className="relative">
              <Mail className={`absolute left-3 top-3.5 h-4 w-4 ${mutedText}`} />
              <input
                value={form.email}
                onChange={(e) => onChange('email', e.target.value)}
                className={`${baseInput} ${inputTheme} pl-10`}
                type="email"
                placeholder="you@example.com"
              />
            </div>
          </label>

          <label className="block space-y-2 text-sm">
            <span className={mutedText}>Username</span>
            <div className="relative">
              <User className={`absolute left-3 top-3.5 h-4 w-4 ${mutedText}`} />
              <input
                value={form.username}
                onChange={(e) => onChange('username', e.target.value)}
                className={`${baseInput} ${inputTheme} pl-10`}
                type="text"
                placeholder="Your username"
              />
            </div>
          </label>

          <label className="block space-y-2 text-sm">
            <span className={mutedText}>Password</span>
            <div className="relative">
              <Lock className={`absolute left-3 top-3.5 h-4 w-4 ${mutedText}`} />
              <input
                value={form.password}
                onChange={(e) => onChange('password', e.target.value)}
                className={`${baseInput} ${inputTheme} pl-10`}
                type="password"
                placeholder="At least 8 characters"
              />
            </div>
          </label>

          <label className="block space-y-2 text-sm">
            <span className={mutedText}>Confirm password</span>
            <div className="relative">
              <Lock className={`absolute left-3 top-3.5 h-4 w-4 ${mutedText}`} />
              <input
                value={form.confirmPassword}
                onChange={(e) => onChange('confirmPassword', e.target.value)}
                className={`${baseInput} ${inputTheme} pl-10`}
                type="password"
                placeholder="Repeat your password"
              />
            </div>
          </label>
        </>
      );
    }

    if (mode === 'verify' || mode === 'reset') {
      return (
        <>
          <label className="block space-y-2 text-sm">
            <span className={mutedText}>Email</span>
            <div className="relative">
              <Mail className={`absolute left-3 top-3.5 h-4 w-4 ${mutedText}`} />
              <input
                value={pendingEmail || form.email}
                onChange={(e) => {
                  setPendingEmail(e.target.value);
                  onChange('email', e.target.value);
                }}
                className={`${baseInput} ${inputTheme} pl-10`}
                type="email"
                placeholder="you@example.com"
              />
            </div>
          </label>

          <label className="block space-y-2 text-sm">
            <span className={mutedText}>{mode === 'verify' ? 'Verification code' : 'Reset code'}</span>
            <div className="relative">
              <KeyRound className={`absolute left-3 top-3.5 h-4 w-4 ${mutedText}`} />
              <input
                value={form.code}
                onChange={(e) => onChange('code', e.target.value)}
                className={`${baseInput} ${inputTheme} pl-10`}
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
              />
            </div>
          </label>

          {mode === 'reset' ? (
            <>
              <label className="block space-y-2 text-sm">
                <span className={mutedText}>New password</span>
                <div className="relative">
                  <Lock className={`absolute left-3 top-3.5 h-4 w-4 ${mutedText}`} />
                  <input
                    value={form.password}
                    onChange={(e) => onChange('password', e.target.value)}
                    className={`${baseInput} ${inputTheme} pl-10`}
                    type="password"
                    placeholder="New password"
                  />
                </div>
              </label>

              <label className="block space-y-2 text-sm">
                <span className={mutedText}>Confirm new password</span>
                <div className="relative">
                  <Lock className={`absolute left-3 top-3.5 h-4 w-4 ${mutedText}`} />
                  <input
                    value={form.confirmPassword}
                    onChange={(e) => onChange('confirmPassword', e.target.value)}
                    className={`${baseInput} ${inputTheme} pl-10`}
                    type="password"
                    placeholder="Repeat it"
                  />
                </div>
              </label>
            </>
          ) : null}
        </>
      );
    }

    return (
      <>
        <label className="block space-y-2 text-sm">
          <span className={mutedText}>Username</span>
          <div className="relative">
            <User className={`absolute left-3 top-3.5 h-4 w-4 ${mutedText}`} />
            <input
              value={form.username}
              onChange={(e) => onChange('username', e.target.value)}
              className={`${baseInput} ${inputTheme} pl-10`}
              type="text"
              placeholder="Enter your username"
            />
          </div>
        </label>

        <label className="block space-y-2 text-sm">
          <span className={mutedText}>Password</span>
          <div className="relative">
            <Lock className={`absolute left-3 top-3.5 h-4 w-4 ${mutedText}`} />
            <input
              value={form.password}
              onChange={(e) => onChange('password', e.target.value)}
              className={`${baseInput} ${inputTheme} pl-10`}
              type="password"
              placeholder="Enter your password"
            />
          </div>
        </label>
      </>
    );
  };

  const handleSubmit = (event: FormEvent) => {
    if (mode === 'login') return handleLogin(event);
    if (mode === 'signup') return handleSignup(event);
    if (mode === 'verify') return handleVerify(event);
    if (mode === 'forgot') return handleForgot(event);
    return handleReset(event);
  };

  const title =
    mode === 'login'
      ? 'Welcome back'
      : mode === 'signup'
        ? 'Create your account'
        : mode === 'verify'
          ? 'Verify your email'
          : mode === 'forgot'
            ? 'Reset your password'
            : 'Set a new password';

  const subtitle =
    mode === 'login'
      ? 'Sign in to continue to your dashboard.'
      : mode === 'signup'
        ? 'Create a secure personal finance account.'
        : mode === 'verify'
          ? 'Use the 6-digit code sent to your email.'
          : mode === 'forgot'
            ? 'We will send a reset code to your email.'
            : 'Choose a new password for your account.';

  const submitLabel =
    mode === 'login'
      ? 'Sign in'
      : mode === 'signup'
        ? 'Create account'
        : mode === 'verify'
          ? 'Verify email'
          : mode === 'forgot'
            ? 'Send code'
            : 'Update password';

  return (
    <div className="w-full max-w-md">
      <div className={`${panelTheme} rounded-3xl border p-6 shadow-xl shadow-blue-950/5`}>
        <div className="mb-6 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <ShieldCheck className="h-6 w-6" />
          </div>
        </div>

        <div className="mb-6 text-center">
          <h1 className={`text-2xl font-bold ${strongText}`}>{title}</h1>
          <p className={`mt-2 text-sm ${mutedText}`}>{subtitle}</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {renderAuthFields()}

          {message ? (
            <div className="flex items-start gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-600">
              <CheckCircle2 className="mt-0.5 h-4 w-4" />
              <span>{message}</span>
            </div>
          ) : null}

          {error ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>{isSubmitting ? 'Please wait...' : submitLabel}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className={`mt-6 flex flex-wrap items-center justify-between gap-2 text-sm ${mutedText}`}>
          {mode !== 'signup' ? (
            <button type="button" className="font-medium text-blue-600" onClick={() => { setMode('signup'); resetFeedback(); }}>
              Create account
            </button>
          ) : null}

          {mode !== 'login' ? (
            <button type="button" className="font-medium text-blue-600" onClick={() => { setMode('login'); resetFeedback(); }}>
              Back to login
            </button>
          ) : null}

          {mode === 'login' ? (
            <button type="button" className="font-medium text-blue-600" onClick={() => { setMode('forgot'); resetFeedback(); }}>
              Forgot password?
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
