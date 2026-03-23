import { createContext, useCallback, useContext, useMemo } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      <ToastContainer
        position="top-center"
        autoClose={2800}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
        newestOnTop
        theme="colored"
        style={{ zIndex: 99999 }}
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
