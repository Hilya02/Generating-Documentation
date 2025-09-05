
import { createContext } from 'react';
import type { User } from '../types';

/**
 * @interface AuthContextType
 * Defines the shape of the authentication context provided to the app.
 * This ensures type safety for any component consuming this context.
 */
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (username: string) => Promise<void>;
  signOut: () => Promise<void>;
}

/**
 * The React Context for authentication.
 * It is initialized with a default shape that includes placeholder functions.
 * Components will consume this context to access authentication state and methods.
 */
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
});
