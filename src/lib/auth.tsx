'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Guild { id: string; name: string; icon: string | null; botInstalled?: boolean; memberCount?: number | null; ownerId?: string | null; permissions?: string | null; }
interface User  { id: string; username: string; avatarUrl: string; email: string; adminGuilds: Guild[]; }

interface AuthCtx {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({ user: null, loading: true, logout: async () => {}, refresh: async () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const data = await api.getMe();
      setUser(data.authenticated ? data.user : null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    window.location.href = '/login';
  };

  useEffect(() => { refresh(); }, []);

  return <AuthContext.Provider value={{ user, loading, logout, refresh }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
