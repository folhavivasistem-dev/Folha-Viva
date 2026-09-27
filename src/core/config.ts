/**
 * Configuração central e ambiente da aplicação
 */

export interface AppConfig {
  appName: string;
  appVersion: string;
  apiBaseUrl: string;
  apiTimeoutMs: number;
  storagePrefix: string;
  isProduction: boolean;
  isDevelopment: boolean;
}

const resolveApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, '');
  }
  return '/api';
};

export const config: AppConfig = Object.freeze({
  appName: 'Folha Viva - Sistema de Gestão',
  appVersion: '1.0.0',
  apiBaseUrl: resolveApiBaseUrl(),
  apiTimeoutMs: 15000,
  storagePrefix: '@folha_viva:',
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
});
