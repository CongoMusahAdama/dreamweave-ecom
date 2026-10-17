import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { sweetAuthSuccess, sweetError } from '@/lib/sweet-alert';
import type { AuthUser } from '@/types/customer';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string, user: AuthUser) => void | Promise<void>;
  initialMode?: 'login' | 'register';
  /** When true, stay on current page (checkout, wishlist). Default: go to account/admin after auth */
  stayOnPage?: boolean;
}

const emptyForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
};

function getApiErrorMessage(data: { message?: string; errors?: { msg: string }[] }, fallback: string) {
  if (data.message) return data.message;
  if (Array.isArray(data.errors) && data.errors[0]?.msg) return data.errors[0].msg;
  return fallback;
}

function dashboardPathForUser(user: { role?: string }) {
  return user?.role === 'admin' ? '/admin' : '/account';
}

const AuthModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
  stayOnPage = false,
}: AuthModalProps) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (isOpen) {
      setIsLogin(initialMode === 'login');
      setError('');
    }
  }, [isOpen, initialMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.email?.trim() || !formData.password) {
      setError('Please fill in all required fields');
      return false;
    }

    if (!isLogin && !formData.name?.trim()) {
      setError('Please enter your name');
      return false;
    }

    if (!isLogin && !formData.confirmPassword) {
      setError('Please confirm your password');
      return false;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (!isLogin && !formData.phone?.trim()) {
      setError('Please enter your phone number');
      return false;
    }

    if (!isLogin && !/^\+?[\d\s-()]{7,20}$/.test(formData.phone.trim())) {
      setError('Please enter a valid phone number');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin
        ? { email: formData.email.trim(), password: formData.password }
        : {
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
            phone: formData.phone.trim(),
          };

      const data = await apiFetch<{
        success: boolean;
        message?: string;
        errors?: { msg: string }[];
        data: { token: string; user: AuthUser };
      }>(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!data.success) {
        throw new Error(getApiErrorMessage(data, 'Authentication failed'));
      }

      const authedUser = data.data.user;
      await onSuccess(data.data.token, authedUser);
      sweetAuthSuccess(isLogin ? 'login' : 'register');
      onClose();
      setFormData(emptyForm);
      if (!stayOnPage) {
        navigate(dashboardPathForUser(authedUser), { replace: true });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
      sweetError(isLogin ? 'Sign in failed' : 'Sign up failed', message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData(emptyForm);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 px-3 py-4 sm:flex sm:items-center sm:justify-center sm:p-4">
      <div className="mx-auto flex w-full max-w-md flex-col border border-black bg-white shadow-xl max-sm:min-h-[min(100dvh-2rem,44rem)] max-sm:w-[min(100vw-1.5rem,28rem)] max-sm:max-h-[calc(100dvh-2rem)] sm:max-h-[min(100dvh-2rem,48rem)]">
        <div className="flex items-center justify-between border-b border-black/10 px-4 py-4 sm:px-6 sm:py-5">
          <h2 className="text-sm font-bold tracking-[0.15em] uppercase text-black">
            {isLogin ? 'Sign in' : 'Create account'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-9 w-9 shrink-0 p-0 text-black hover:bg-black/5"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 sm:px-6 sm:py-6">
          {error && (
            <div className="border border-red-300 bg-red-50 text-red-700 px-4 py-3 text-[10px] font-bold uppercase tracking-wider">
              {error}
            </div>
          )}

          {!isLogin && (
            <div>
              <Label htmlFor="name" className="text-[10px] font-bold tracking-[0.15em] uppercase text-black/60">
                Full name *
              </Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  className="h-11 pl-10 rounded-none border-black text-sm"
                  autoComplete="name"
                />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="email" className="text-[10px] font-bold tracking-[0.15em] uppercase text-black/60">
              Email *
            </Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@email.com"
                className="h-11 pl-10 rounded-none border-black text-sm"
                autoComplete="email"
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <Label htmlFor="phone" className="text-[10px] font-bold tracking-[0.15em] uppercase text-black/60">
                Phone *
              </Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+233 20 123 4567"
                  className="h-11 pl-10 rounded-none border-black text-sm"
                  autoComplete="tel"
                  required
                />
              </div>
              <p className="text-[9px] font-bold text-black/40 mt-1.5 leading-relaxed">
                Used for order updates and your welcome SMS.
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="password" className="text-[10px] font-bold tracking-[0.15em] uppercase text-black/60">
              Password *
            </Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Min. 6 characters"
                className="h-11 pl-10 pr-10 rounded-none border-black text-sm"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 p-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-black/40" />
                ) : (
                  <Eye className="h-4 w-4 text-black/40" />
                )}
              </Button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <Label
                htmlFor="confirmPassword"
                className="text-[10px] font-bold tracking-[0.15em] uppercase text-black/60"
              >
                Confirm password *
              </Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Re-enter password"
                  className="h-11 pl-10 pr-10 rounded-none border-black text-sm"
                  autoComplete="new-password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 p-0"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-black/40" />
                  ) : (
                    <Eye className="h-4 w-4 text-black/40" />
                  )}
                </Button>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-black hover:bg-black/90 text-white rounded-none text-[10px] font-bold tracking-[0.2em] uppercase min-h-[48px]"
            disabled={loading}
          >
            {loading ? (isLogin ? 'Signing in…' : 'Creating account…') : isLogin ? 'Sign in' : 'Create account'}
          </Button>
        </form>

        <div className="border-t border-black/10 bg-black/[0.02] px-4 py-4 sm:px-6">
          <p className="text-center text-[10px] font-bold tracking-[0.12em] uppercase text-black/50">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button type="button" onClick={toggleMode} className="text-black underline underline-offset-2">
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
