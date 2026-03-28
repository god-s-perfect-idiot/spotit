import { createContext, useCallback, useContext, useMemo } from 'react';
import toast, { Toaster } from 'react-hot-toast';

type ToastType = 'success' | 'error' | 'info';

type ToastContextValue = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const showToast = useCallback(
    (message: string, type: ToastType = 'info') => {
      try {
        if (type === 'success') {
          toast.success(message);
          return;
        }
        if (type === 'error') {
          toast.error(message);
          return;
        }
        toast(message);
      } catch (error) {
        console.error('Toast render failed, falling back to alert:', error);
        window.alert(message);
      }
    },
    []
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster
        position="top-center"
        gutter={8}
        containerStyle={{ zIndex: 99999 }}
        toastOptions={{
          duration: 2800,
          style: {
            background: '#33B1FF',
            color: '#ffffff',
            borderRadius: '30px',
            padding: '10px',
            fontSize: '16px',
            fontWeight: 'bold',
          },
        }}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
