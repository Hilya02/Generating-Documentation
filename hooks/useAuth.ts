
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * A custom hook to access the authentication context.
 * Why use a hook? It simplifies consumption of the context, abstracting
 * away the `useContext` call and providing better error handling if used
 * outside of a provider.
 * @returns The authentication context value.
 * @throws {Error} Throws an error if used outside of an `AuthProvider`.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
