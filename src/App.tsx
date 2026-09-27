/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationToastContainer } from './components/common/NotificationToastContainer';
import { AppRoutes } from './routes';
import { config } from './core/config';

const SystemStatusBanner: React.FC = () => {
  const { isOnline } = useApp();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="bg-amber-600 text-white text-xs font-medium py-1.5 px-4 text-center sticky top-0 z-50 shadow-xs"
    >
      Modo desconectado detectado. Operações serão sincronizadas ao restabelecer a conexão.
    </div>
  );
};

const InitialSystemShell: React.FC = () => {
  const { isLoading, isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white">
      <SystemStatusBanner />

      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-xs px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white shadow-xs">
            FV
          </div>
          <div>
            <h1 className="text-base font-semibold leading-tight tracking-tight text-white">
              {config.appName}
            </h1>
            <p className="text-xs text-slate-400">
              Arquitetura Base e Serviços Fundamentais
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Core Inicial Ativo
          </span>
          <span className="px-2 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-400 font-mono">
            v{config.appVersion}
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-10 flex flex-col justify-center">
        <section aria-label="Status dos Módulos Fundamentais" className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-6 md:p-8 backdrop-blur-xs shadow-xl">
          <div className="mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Estrutura de Produção Inicializada
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
              Camada Base e Serviços Operacionais
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              A fundação arquitetural foi configurada conforme as diretrizes de código limpo, tipagem estrita e segurança. Nenhuma tela de demonstração ou simulação de dados foi carregada. O sistema está pronto para a implementação dos módulos verticais reais.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-slate-200">Tipagem e Domínio</h3>
                <p className="text-xs text-slate-400 mt-0.5">RBAC, Usuário, Auditoria, Entidades e Contratos de API tipados.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-slate-200">Cliente HTTP e Timeout</h3>
                <p className="text-xs text-slate-400 mt-0.5">Interceptação de Bearer token, AbortController e tratamento de erros.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-slate-200">Segurança e Sanitização</h3>
                <p className="text-xs text-slate-400 mt-0.5">Proteção XSS básica, checagem de expiração de token e validação RFC.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-slate-200">Persistência e Sessão</h3>
                <p className="text-xs text-slate-400 mt-0.5">Storage seguro isolado por namespace, fallback de memória e RBAC.</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              Sessão: {isLoading ? 'Verificando...' : isAuthenticated ? `Autenticado (${user?.name})` : 'Aguardando autenticação'}
            </span>
            <span className="font-mono text-slate-500">Pronto para próximas instruções</span>
          </div>
        </section>

        {/* Rotas ativas no router */}
        <AppRoutes />
      </main>

      <NotificationToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AuthProvider>
          <BrowserRouter>
            <InitialSystemShell />
          </BrowserRouter>
        </AuthProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}
