/**
 * Guardas de rota para proteção de acesso, validação de sessão e RBAC
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole, Permission } from '../types/auth';

interface GuardProps {
  children: React.ReactNode;
}

interface RoleGuardProps extends GuardProps {
  requiredRole?: UserRole;
  requiredPermission?: Permission;
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<GuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Verificando credenciais...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export const PublicOnlyRoute: React.FC<GuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  requiredRole,
  requiredPermission,
  fallbackPath = '/',
}) => {
  const { hasRole, hasPermission } = useAuth();

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to={fallbackPath} replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};
