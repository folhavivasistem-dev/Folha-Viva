/**
 * Cliente HTTP padronizado com timeout, interceptores e tratamento de erros
 */

import { config } from '../../core/config';
import { storageService } from '../storage/storageService';
import { AuthTokens } from '../../types/auth';
import { RequestOptions, ApiResponse, ApiErrorResponse } from '../../types/api';

const AUTH_TOKEN_KEY = 'auth_tokens';

export class HttpClient {
  private baseUrl: string;
  private defaultTimeout: number;

  constructor(baseUrl: string = config.apiBaseUrl, defaultTimeout: number = config.apiTimeoutMs) {
    this.baseUrl = baseUrl;
    this.defaultTimeout = defaultTimeout;
  }

  private buildUrl(endpoint: string, params?: RequestOptions['params']): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const base = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
    const url = new URL(`${base}${cleanEndpoint}`, window.location.origin);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private getAuthHeader(): Record<string, string> {
    const tokens = storageService.get<AuthTokens>(AUTH_TOKEN_KEY);
    if (tokens?.accessToken) {
      return { Authorization: `Bearer ${tokens.accessToken}` };
    }
    return {};
  }

  public async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { timeoutMs = this.defaultTimeout, params, skipAuth = false, headers, ...customOptions } = options;
    const url = this.buildUrl(endpoint, params);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(!skipAuth ? this.getAuthHeader() : {}),
      ...((headers as Record<string, string>) || {}),
    };

    try {
      const response = await fetch(url, {
        ...customOptions,
        headers: requestHeaders,
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok) {
        let errorData: ApiErrorResponse | null = null;
        try {
          errorData = await response.json();
        } catch {
          // Resposta não é JSON válido
        }

        const errorMessage =
          errorData?.error?.message ||
          (response.status === 401
            ? 'Sessão expirada ou não autenticada.'
            : response.status === 403
            ? 'Acesso não autorizado para esta funcionalidade.'
            : response.status === 404
            ? 'Recurso não encontrado no servidor.'
            : response.status >= 500
            ? 'Erro interno no servidor. Tente novamente mais tarde.'
            : `Falha na requisição (código ${response.status}).`);

        throw new Error(errorMessage);
      }

      // Se a resposta for 204 No Content
      if (response.status === 204) {
        return undefined as T;
      }

      const parsed: ApiResponse<T> | T = await response.json();
      if (parsed && typeof parsed === 'object' && 'data' in parsed && 'success' in parsed) {
        return (parsed as ApiResponse<T>).data;
      }

      return parsed as T;
    } catch (err: unknown) {
      clearTimeout(timer);
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          throw new Error('A requisição excedeu o tempo limite estabelecido.');
        }
        throw err;
      }
      throw new Error('Ocorreu uma falha inesperada de comunicação.');
    }
  }

  public get<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public put<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const httpClient = new HttpClient();
