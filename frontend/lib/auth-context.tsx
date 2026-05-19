'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { UserDto } from './api-types';
import { AUTH_REQUIRED_EVENT, authApi, setToken, removeToken, getToken } from './api';
import { consumeQueuedAuthRequiredToast, showAuthRequiredToast } from './auth-toast';
import { toast } from '@/hooks/use-toast';

interface AuthState {
  user: UserDto | null;
  loading: boolean;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  loginWithGoogle: () => {},
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

function getGoogleClientId(): string | null {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();
  if (!clientId || clientId.startsWith('<') || !clientId.endsWith('.apps.googleusercontent.com')) {
    return null;
  }
  return clientId;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          prompt: () => void;
          revoke: (email: string, done: () => void) => void;
        };
      };
    };
    handleGoogleCredential?: (response: { credential: string }) => void;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    consumeQueuedAuthRequiredToast();

    const handleAuthRequired = () => showAuthRequiredToast();
    window.addEventListener(AUTH_REQUIRED_EVENT, handleAuthRequired);

    const token = getToken();
    if (!token) {
      setLoading(false);
      return () => window.removeEventListener(AUTH_REQUIRED_EVENT, handleAuthRequired);
    }
    authApi
      .me()
      .then(setUser)
      .catch(() => removeToken())
      .finally(() => setLoading(false));

    return () => window.removeEventListener(AUTH_REQUIRED_EVENT, handleAuthRequired);
  }, []);

  const handleCredential = useCallback(async (idToken: string) => {
    try {
      const res = await authApi.login({ idToken });
      setToken(res.accessToken);
      setUser(res.user);
    } catch (err) {
      console.error('Login failed:', err);
      toast({
        description: '로그인에 실패했습니다. 국민대학교 구글 계정(@kookmin.ac.kr)으로만 이용 가능합니다.',
      });
    }
  }, []);

  useEffect(() => {
    const clientId = getGoogleClientId();
    if (!clientId) return;

    window.handleGoogleCredential = (response: { credential: string }) => {
      handleCredential(response.credential);
    };

    const interval = setInterval(() => {
      if (window.google?.accounts?.id) {
        clearInterval(interval);
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => handleCredential(response.credential),
        });
      }
    }, 100);

    return () => {
      clearInterval(interval);
      delete window.handleGoogleCredential;
    };
  }, [handleCredential]);

  const loginWithGoogle = useCallback(() => {
    if (!getGoogleClientId()) {
      toast({
        description: 'Google 로그인 설정이 필요합니다. 올바른 Google OAuth 클라이언트 ID를 설정하세요.',
      });
      return;
    }
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore logout errors
    } finally {
      removeToken();
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
