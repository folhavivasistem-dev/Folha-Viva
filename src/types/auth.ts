/**
 * Tipos de Autenticação, Controle de Acesso Baseado em Papéis (RBAC) e Usuário
 */

import { BaseEntity } from './common';

export type UserRole = 'superadmin' | 'admin' | 'manager' | 'operator' | 'viewer';

export type Permission =
  | 'users:read'
  | 'users:write'
  | 'users:delete'
  | 'production:read'
  | 'production:write'
  | 'inventory:read'
  | 'inventory:write'
  | 'finance:read'
  | 'finance:write'
  | 'reports:read'
  | 'reports:export'
  | 'settings:manage';

export interface User extends BaseEntity {
  name: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  isActive: boolean;
  lastLoginAt?: string;
  avatarUrl?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number; // Unix timestamp em milissegundos
}

export interface AuthSession {
  user: User;
  tokens: AuthTokens;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
