import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNotification } from './NotificationContext';

interface DeleteContextType {
  confirmDelete: (id: number, label?: string) => void;
}

const DeleteContext = createContext<DeleteContextType>({ confirmDelete: () => { } });

interface DeleteTarget {
  id: number;
  label: string;
}

export const DeleteProvider = ({
  children,
  onConfirm,
}: {
  children: ReactNode;
  onConfirm: (id: number) => Promise<void>;
}) => {
  const [target, setTarget] = useState<DeleteTarget | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useNotification();

  const confirmDelete = (id: number, label = 'this record') => {
    setTarget({ id, label });
  };

  const handleConfirm = async () => {
    if (!target) return;
    setIsDeleting(true);
    try {
      await onConfirm(target.id);
      showToast('Record removed successfully');
    } catch {
      showToast('Failed to remove record', 'error');
    } finally {
      setIsDeleting(false);
      setTarget(null);
    }
  };

  return (
    <DeleteContext.Provider value={{ confirmDelete }}>
      {children}

      {target && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-emerald-950/20 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setTarget(null)}
        >
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-[0px_24px_48px_-12px_rgba(16,24,40,0.14)] w-full max-w-sm p-8 animate-fade-in">
            <p className="text-sm font-semibold text-emerald-950 mb-1">Remove record?</p>
            <p className="text-sm text-emerald-900/50 mb-8">
              <span className="font-medium text-emerald-800">{target.label}</span> will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setTarget(null)}
                className="flex-1 py-2.5 text-sm font-medium text-emerald-900/50 hover:text-emerald-950 rounded-xl border border-emerald-100 hover:bg-emerald-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isDeleting}
                className="flex-1 py-2.5 text-sm font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-all disabled:opacity-50"
              >
                {isDeleting ? 'Removing…' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DeleteContext.Provider>
  );
};

export const useDelete = () => useContext(DeleteContext);
