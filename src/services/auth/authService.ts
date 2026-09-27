/**
 * Serviço de autenticação, persistência de credenciais e controle de sessão
 */

import { storageService } from '../storage/storageService';
import { httpClient } from '../api/httpClient';
import { isTokenExpired } from '../../core/security';
import {
  User,
  AuthTokens,
  AuthSession,
  LoginCredentials,
  UserRole,
  Permission,
} from '../../types/auth';

const STORAGE_KEYS = {
  USER: 'auth_user',
  TOKENS: 'auth_tokens',
} as const;

export class AuthService {
  /**
   * Recupera a sessão ativa armazenada, validando integridade e expiração
   */
  public getSession(): AuthSession | null {
    const user = storageService.get<User>(STORAGE_KEYS.USER);
    const tokens = storageService.get<AuthTokens>(STORAGE_KEYS.TOKENS);

    if (!user || !tokens?.accessToken) {
      return null;
    }

    if (isTokenExpired(tokens.expiresAt)) {
      this.clearSession();
      return null;
    }

    return { user, tokens };
  }

  /**
   * Efetua login chamando o endpoint de autenticação
   */
  public async login(credentials: LoginCredentials): Promise<AuthSession> {
    const session = await httpClient.post<AuthSession>('/auth/login', {
      email: credentials.email.trim(),
      password: credentials.password,
      rememberMe: Boolean(credentials.rememberMe),
    }, { skipAuth: true });

    if (!session || !session.user || !session.tokens) {
      throw new Error('Resposta de autenticação inválida.');
    }

    this.saveSession(session);
    return session;
  }

  /**
   * Encerra a sessão e purga credenciais locais
   */
  public async logout(): Promise<void> {
    try {
      await httpClient.post('/auth/logout', undefined, { timeoutMs: 5000 });
    } catch {
      // Ignora falha de rede ao deslogar
    } finally {
      this.clearSession();
    }
  }

  /**
   * Salva sessão no armazenamento local
   */
  public saveSession(session: AuthSession): void {
    storageService.set(STORAGE_KEYS.USER, session.user);
    storageService.set(STORAGE_KEYS.TOKENS, session.tokens);
  }

  /**
   * Remove sessão do armazenamento
   */
  public clearSession(): void {
    storageService.remove(STORAGE_KEYS.USER);
    storageService.remove(STORAGE_KEYS.TOKENS);
  }

  /**
   * Validação de papéis de usuário (Hierarquia RBAC)
   */
  public hasRole(user: User | null, requiredRole: UserRole): boolean {
    if (!user || !user.isActive) return false;
    if (user.role === 'superadmin') return true;
    if (user.role === 'admin' && requiredRole !== 'superadmin') return true;
    return user.role === requiredRole;
  }

  /**
   * Validação granular de permissões
   */
  public hasPermission(user: User | null, requiredPermission: Permission): boolean {
    if (!user || !user.isActive) return false;
    if (user.role === 'superadmin') return true;
    return Array.isArray(user.permissions) && user.permissions.includes(requiredPermission);
  }
}

export const authService = new AuthService();
