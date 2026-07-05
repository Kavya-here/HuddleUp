import { useCallback, useEffect, useMemo, useState } from 'react';


import {
  AuthContext,
  safeParseJSON,
  STORAGE_KEY_HUDDLEUP_AUTH_USER_V1,
} from './AuthContextCore.js';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Restore persisted session on refresh.
    // Keep side-effects (localStorage reads/writes) outside render.
    const restore = () => {
      const raw = localStorage.getItem(STORAGE_KEY_HUDDLEUP_AUTH_USER_V1);
      if (!raw) {
        setUser(null);
        setLoading(false);
        return;
      }

      const parsed = safeParseJSON(raw);
      if (!parsed) {
        localStorage.removeItem(STORAGE_KEY_HUDDLEUP_AUTH_USER_V1);
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(parsed);
      setLoading(false);
    };

    restore();
  }, []);

  const loginUser = useCallback(async (profile) => {
    setError(null);
    setLoading(true);

    try {
      const nextUser = profile ?? null;

      if (nextUser === null) {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY_HUDDLEUP_AUTH_USER_V1);
        setLoading(false);
        return;
      }

      localStorage.setItem(
        STORAGE_KEY_HUDDLEUP_AUTH_USER_V1,
        JSON.stringify(nextUser),
      );
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
      localStorage.removeItem(STORAGE_KEY_HUDDLEUP_AUTH_USER_V1);
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



