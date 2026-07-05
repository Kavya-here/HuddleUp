import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'huddleup.auth.user.v1';

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  // Placeholder API (overridden by provider)
  loginUser: async () => {},
  logoutUser: async () => {},
});

function safeParseJSON(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Restore persisted session on refresh.
    // Must not truncate localStorage; we simply read what was stored.
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setUser(null);
      setLoading(false);
      return;
    }

    const parsed = safeParseJSON(raw);
    if (!parsed) {
      // If corrupted/unexpected shape, clear it rather than breaking app.
      localStorage.removeItem(STORAGE_KEY);
      setUser(null);
      setLoading(false);
      return;
    }

    setUser(parsed);
    setLoading(false);
  }, []);

  const loginUser = useCallback(async (profile) => {
    setError(null);
    setLoading(true);

    try {
      // profile can be any serializable user/profile object.
      // Keep it generic for integration with CometChat or other auth later.
      const nextUser = profile ?? null;

      if (nextUser === null) {
        // Treat falsy profile as a logout-like operation.
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
        setLoading(false);
        return;
      }

      // Persist to localStorage for session continuity.
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
      setUser(nextUser);
      setLoading(false);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to login';
      setError(message);
      setLoading(false);
    }
  }, []);

  const logoutUser = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      localStorage.removeItem(STORAGE_KEY);
      setUser(null);
      setLoading(false);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to logout';
      setError(message);
      setLoading(false);
    }
  }, []);

  const value = useMemo(() => {
    return {
      user,
      loading,
      error,
      isAuthenticated: Boolean(user),
      loginUser,
      logoutUser,
    };
  }, [user, loading, error, loginUser, logoutUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

