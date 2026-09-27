/**
 * Contexto de Autenticação e Controle de Acesso
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { User, AuthTokens, LoginCredentials, UserRole, Permission } from '../types/auth';
import { authService } from '../services/auth/authService';

interface AuthContextValue {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: Permission) => boolean;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Inicializa a sessão persistida
  useEffect(() => {
    try {
      const session = authService.getSession();
      if (session) {
        setUser(session.user);
        setTokens(session.tokens);
      }
    } catch {
      authService.clearSession();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const session = await authService.login(credentials);
      setUser(session.user);
      setTokens(session.tokens);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Falha ao autenticar usuário.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setTokens(null);
      setIsLoading(false);
    }
  }, []);

  const hasRole = useCallback((role: UserRole): boolean => {
    return authService.hasRole(user, role);
  }, [user]);

  const hasPermission = useCallback((permission: Permission): boolean => {
    return authService.hasPermission(user, permission);
  }, [user]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    tokens,
    isAuthenticated: Boolean(user && tokens),
    isLoading,
    error,
    login,
    logout,
    hasRole,
    hasPermission,
    clearError,
  }), [user, tokens, isLoading, error, login, logout, hasRole, hasPermission, clearError]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider.');
  }
  return context;
}
