
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { AppView } from '../types';

interface LoginProps {
  onLoginSuccess: () => void;
}
/**
 * Login view component.
 * Allows users to sign in with a username. This component is intentionally simple
 * to focus on the core app logic, but in a real-world scenario, it would
 * handle passwords and more complex authentication flows.
 */
export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const { signIn } = useAuth();
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles the login form submission.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await signIn(username);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 p-10 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Sign in to ALX Polly
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            Enter any username to continue
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="relative block w-full appearance-none rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-slate-900 dark:text-slate-200 bg-white dark:bg-slate-700 placeholder-slate-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              placeholder="Username"
            />
          </div>
          
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:bg-slate-400"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
