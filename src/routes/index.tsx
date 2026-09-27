/**
 * Configuração de rotas da aplicação
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './guards';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rota inicial protegida pela arquitetura de autenticação */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <div className="p-6">
              {/* O conteúdo de tela será implementado na etapa de módulos */}
            </div>
          </ProtectedRoute>
        }
      />

      {/* Fallback de rotas inexistentes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
