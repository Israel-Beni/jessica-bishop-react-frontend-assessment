import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface NotificationContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  showToast: () => { },
});

let toastId = 0;

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  const colors: Record<ToastType, string> = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-rose-600 text-white',
    info: 'bg-white border border-emerald-100 text-emerald-950 shadow-sm',
  };

  const dot: Record<ToastType, string> = {
    success: 'bg-emerald-300',
    error: 'bg-rose-300',
    info: 'bg-emerald-400',
  };

  return (
    <NotificationContext.Provider value={{ showToast }}>
      {children}

      {/* Toast stack — slides in from very top of viewport */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium pointer-events-auto
              animate-[slideDown_0.25s_ease-out] ${colors[toast.type]}`}
            style={{ animation: 'slideDown 0.25s ease-out' }}
          >
            <span className={`w-2 h-2 rounded-full shrink-0 ${dot[toast.type]}`} />
            <span className="flex-1 leading-snug">{toast.message}</span>
            <button
              onClick={() => dismiss(toast.id)}
              className="opacity-60 hover:opacity-100 transition-opacity ml-1 shrink-0"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
