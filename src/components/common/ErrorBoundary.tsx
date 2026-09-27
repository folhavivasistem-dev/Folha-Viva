/**
 * Boundary global para captura e contenção de exceções não tratadas na árvore React
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Registro interno e seguro de erros
    console.error('Falha de execução capturada pelo ErrorBoundary:', error, errorInfo);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-xs border border-slate-200 p-6 text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-slate-900 mb-2">
              Instabilidade temporária identificada
            </h1>
            <p className="text-sm text-slate-600 mb-6">
              Ocorreu um comportamento inesperado. Os dados e o estado da aplicação foram protegidos.
            </p>
            <button
              onClick={this.handleReload}
              className="w-full inline-flex justify-center items-center px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium rounded-lg transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 outline-none"
            >
              Recarregar aplicação
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
