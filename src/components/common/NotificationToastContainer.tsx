/**
 * Container e renderizador de notificações acessíveis
 */

import React from 'react';
import { useApp } from '../../context/AppContext';

export const NotificationToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useApp();

  if (notifications.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {notifications.map((n) => {
        const bgColors = {
          success: 'bg-emerald-50 border-emerald-300 text-emerald-900',
          error: 'bg-rose-50 border-rose-300 text-rose-900',
          warning: 'bg-amber-50 border-amber-300 text-amber-900',
          info: 'bg-sky-50 border-sky-300 text-sky-900',
        }[n.type];

        return (
          <div
            key={n.id}
            role="alert"
            className={`pointer-events-auto border rounded-lg p-3 shadow-md flex items-start justify-between gap-3 text-sm transition-all duration-200 ${bgColors}`}
          >
            <span>{n.message}</span>
            <button
              type="button"
              onClick={() => removeNotification(n.id)}
              className="text-current opacity-70 hover:opacity-100 transition-opacity p-0.5 rounded"
              aria-label="Fechar notificação"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
};
