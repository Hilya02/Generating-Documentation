import React, { useState, useEffect, useMemo } from 'react';
import * as pollService from './services/pollService';
// FIX: Changed type-only import to a value import for AppView enum.
import { User, AppView } from './types';
import { AuthContext } from './context/AuthContext';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login';
import About from './components/About';

/**
 * The root component of the ALX Polly application.
 *
 * Why this structure?
 * 1.  **Centralized State Management:** It holds the top-level state for authentication (`user`, `isLoading`)
 *     and the current view (`view`), acting as the single source of truth.
 * 2.  **Context Provider:** It wraps the entire application in `AuthContext.Provider`, making
 *     authentication data and functions available to any child component without prop drilling.
 * 3.  **View Routing:** It implements a simple "router" using state to switch between different
 *     views (Dashboard, Login, About), which is suitable for a single-page application of this scale.
 */
const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // FIX: Initialize state with AppView enum member instead of string literal.
  const [view, setView] = useState<AppView>(AppView.Dashboard);

  /**
   * Initializes the authentication state by checking for a current user session on component mount.
   * This `useEffect` hook runs only once when the application first loads.
   */
  useEffect(() => {
    const checkCurrentUser = () => {
      const currentUser = pollService.getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    };
    checkCurrentUser();
  }, []);

  /**
   * Handles the user sign-in process.
   * @param {string} username - The username provided by the user.
   */
  const handleSignIn = async (username: string) => {
    const signedInUser = await pollService.signIn(username);
    setUser(signedInUser);
  };
  
  /**
   * Handles the user sign-out process.
   */
  const handleSignOut = async () => {
    await pollService.signOut();
    setUser(null);
  };

  /**
   * The context value is memoized using `useMemo`.
   * This is a performance optimization that prevents the context value object from being
   * recreated on every render, which would cause all consuming components to re-render
   * unnecessarily. It only re-creates the object if `user` or `isLoading` changes.
   */
  const authContextValue = useMemo(() => ({
    user,
    isLoading,
    signIn: handleSignIn,
    signOut: handleSignOut,
  }), [user, isLoading]);

  /**
   * Renders the current view based on the `view` state.
   * This is a simple but effective way to handle page navigation in a small SPA.
   */
  const renderView = () => {
    // FIX: Use AppView enum members in switch statement.
    switch (view) {
      case AppView.Login:
        // FIX: Use AppView enum member instead of string literal.
        return <Login onLoginSuccess={() => setView(AppView.Dashboard)} />;
      case AppView.About:
        return <About />;
      case AppView.Dashboard:
      default:
        return <Dashboard />;
    }
  };
  
  return (
    <AuthContext.Provider value={authContextValue}>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 font-sans">
        <Header setView={setView} />
        <main>
          {isLoading ? (
            <div className="text-center p-10 text-slate-500 dark:text-slate-400">Loading Application...</div>
          ) : (
            renderView()
          )}
        </main>
      </div>
    </AuthContext.Provider>
  );
};

export default App;
