import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import authService from '../api/services/authService';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, Loader2, Stethoscope } from 'lucide-react';

function getLoginErrorMessage(error) {
  const data = error?.response?.data;

  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors[0]?.message || data.errors[0] || 'Login failed.';
  }

  if (data?.errors && typeof data.errors === 'object') {
    const firstError = Object.values(data.errors).flat()[0];
    if (firstError) {
      return firstError;
    }
  }

  return (
    data?.message ||
    data?.error ||
    error?.message ||
    'Login failed. Please check your credentials.'
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await authService.login(username.trim(), password);
      if (!response?.token || !response?.user) {
        throw new Error('Login response is missing token or user data.');
      }

      login(response.user, response.token);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(getLoginErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <div className="mb-6 text-center">
          <div className="flex justify-center">
            <Stethoscope className="h-12 w-12 text-teal-600" />
          </div>
          <h1 className="mt-2 text-2xl font-bold text-teal-600">MedTracker</h1>
          <p className="mt-1 text-sm text-slate-600">Sign in to continue</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              placeholder="Enter username"
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-20 text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                placeholder="Enter password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 cursor-pointer items-center justify-center rounded p-2 text-teal-700 hover:bg-teal-50"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full cursor-pointer items-center justify-center rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          {error ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}
