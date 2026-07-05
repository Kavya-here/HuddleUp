import { createContext } from 'react';

const STORAGE_KEY = 'huddleup.auth.user.v1';

export const STORAGE_KEY_HUDDLEUP_AUTH_USER_V1 = STORAGE_KEY;

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  // Placeholder API (overridden by provider)
  loginUser: async () => {},
  logoutUser: async () => {},
});

export function safeParseJSON(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

