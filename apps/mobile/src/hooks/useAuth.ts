import { useState, useEffect } from 'react';
import { getToken, clearToken } from '../services/api';

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getToken().then((t) => {
      setToken(t);
      setLoading(false);
    });
  }, []);

  async function logout() {
    await clearToken();
    setToken(null);
  }

  return { token, loading, setToken, logout };
}
