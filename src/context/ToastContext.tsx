import type { ReactNode } from "react";
import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const DEFAULT_DURATION = 3500;

export type ToastType = "info" | "success" | "error" | "warning";

interface Toast {
  id: string;
  msg: string;
  type: ToastType;
  isExiting: boolean;
  isEntering: boolean;
}

interface ToastContextType {
  addToast: (msg: string, type?: ToastType, duration?: number) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timerRefs = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  const dismissToast = useCallback((id: string) => {
    const timer = timerRefs.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timerRefs.current.delete(id);
    }
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isExiting: true } : t)),
    );
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (msg: string, type: ToastType = "info", duration = DEFAULT_DURATION) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [
        ...prev,
        { id, msg, type, isEntering: true, isExiting: false },
      ]);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setToasts((prev) =>
            prev.map((t) => (t.id === id ? { ...t, isEntering: false } : t)),
          );
        });
      });

      const timer = setTimeout(() => dismissToast(id), duration);
      timerRefs.current.set(id, timer);
    },
    [dismissToast],
  );

  return (
    <ToastContext.Provider value={{ addToast, dismissToast }}>
      {createPortal(
        <div className="fixed z-500 flex flex-col gap-2 bottom-8 mx-auto">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`flex items-center justify-between gap-4 rounded-md px-4 py-2
                shadow-md transition-opacity duration-300
                ${toast.isEntering || toast.isExiting ? "opacity-0" : "opacity-100"}`}
              onTransitionEnd={() => {
                if (toast.isExiting) removeToast(toast.id);
              }}
            >
              <span>{toast.msg}</span>
              <button onClick={() => dismissToast(toast.id)}>
                <X />
              </button>
            </div>
          ))}
        </div>,
        document.documentElement,
      )}
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};
