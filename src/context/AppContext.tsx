/**
 * Contexto global de aplicação (Status de Conectividade, Alertas e Sistema)
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

export interface AppNotification {
  id: string;
  type: AlertType;
  message: string;
  durationMs?: number;
}

interface AppContextValue {
  isOnline: boolean;
  notifications: AppNotification[];
  notify: (type: AlertType, message: string, durationMs?: number) => void;
  removeNotification: (id: string) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const notify = useCallback((type: AlertType, message: string, durationMs = 5000) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newNotification: AppNotification = { id, type, message, durationMs };

    setNotifications((prev) => [...prev, newNotification]);

    if (durationMs > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, durationMs);
    }
  }, [removeNotification]);

  const value = useMemo<AppContextValue>(() => ({
    isOnline,
    notifications,
    notify,
    removeNotification,
  }), [isOnline, notifications, notify, removeNotification]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser utilizado dentro de um AppProvider.');
  }
  return context;
}
