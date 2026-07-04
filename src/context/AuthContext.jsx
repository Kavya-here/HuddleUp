import { createContext } from 'react';

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  // Placeholder API
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }) {
  // Intentionally minimal placeholder (no business logic yet)
  return <AuthContext.Provider value={{ user: null, isAuthenticated: false }}>{children}</AuthContext.Provider>;
}

