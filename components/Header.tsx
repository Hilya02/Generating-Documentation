import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { LogoutIcon } from './icons/LogoutIcon';
// FIX: Changed type-only import to value import to use AppView enum.
import { AppView } from '../types';

interface HeaderProps {
  setView: (view: AppView) => void;
}

/**
 * Header component for the ALX Polly application.
 * It provides navigation and displays the current user's authentication status.
 * The `useAuth` hook is used here to conditionally render UI elements
 * based on whether a user is logged in, which is a common and powerful pattern in React.
 */
export const Header: React.FC<HeaderProps> = ({ setView }) => {
  const { user, signOut: performSignOut } = useAuth();

  return (
    <header className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1
              className="text-2xl font-bold text-slate-800 dark:text-white cursor-pointer"
              // FIX: Use AppView enum instead of string literal.
              onClick={() => setView(AppView.Dashboard)}
            >
              ALX Polly
            </h1>
            <nav className="hidden md:flex space-x-4">
               {/* FIX: Use AppView enum instead of string literal. */}
               <a href="#" onClick={(e) => { e.preventDefault(); setView(AppView.Dashboard); }} className="text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-white">Dashboard</a>
               {/* FIX: Use AppView enum instead of string literal. */}
               <a href="#" onClick={(e) => { e.preventDefault(); setView(AppView.About); }} className="text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-white">About</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2">
                  <UserCircleIcon className="h-6 w-6 text-slate-500 dark:text-slate-300" />
                  <span className="text-slate-700 dark:text-slate-200 font-medium hidden sm:block">{user.username}</span>
                </div>
                <button
                  onClick={performSignOut}
                  className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  aria-label="Sign out"
                >
                  <LogoutIcon className="h-6 w-6" />
                </button>
              </>
            ) : (
              <button
                // FIX: Use AppView enum instead of string literal.
                onClick={() => setView(AppView.Login)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};