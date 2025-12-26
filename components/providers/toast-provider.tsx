"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { AnimatedToast, AnimatedToastProps } from "@/components/animated-toast";

import { AnimatePresence } from "motion/react";

type ToastType = "default" | "success" | "error" | "info" | "warning";

interface ToastOptions {
  description?: string;
  duration?: number;
  id?: string;
}

interface ToastContextType {
  toast: (message: React.ReactNode, type?: ToastType, options?: ToastOptions) => string;
  success: (message: React.ReactNode, options?: ToastOptions) => string;
  error: (message: React.ReactNode, options?: ToastOptions) => string;
  info: (message: React.ReactNode, options?: ToastOptions) => string;
  warning: (message: React.ReactNode, options?: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<(AnimatedToastProps & { id: string })[]>([]);

  const addToast = useCallback((message: React.ReactNode, type: ToastType = "default", options?: ToastOptions) => {
    const id = options?.id || Math.random().toString(36).substring(2, 9);
    
    setToasts((prev) => {
      const existing = prev.find((t) => t.id === id);
      if (existing) {
        return prev.map((t) => t.id === id ? { ...t, message, type, description: options?.description, duration: options?.duration } : t);
      }
      return [
        ...prev,
        {
          id,
          message,
          type,
          description: options?.description,
          duration: options?.duration,
        },
      ];
    });
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: React.ReactNode, type: ToastType = "default", options?: ToastOptions) => {
    return addToast(message, type, options);
  }, [addToast]);

  const success = useCallback((message: React.ReactNode, options?: ToastOptions) => addToast(message, "success", options), [addToast]);
  const error = useCallback((message: React.ReactNode, options?: ToastOptions) => addToast(message, "error", options), [addToast]);
  const info = useCallback((message: React.ReactNode, options?: ToastOptions) => addToast(message, "info", options), [addToast]);
  const warning = useCallback((message: React.ReactNode, options?: ToastOptions) => addToast(message, "warning", options), [addToast]);
  const dismiss = useCallback((id: string) => removeToast(id), [removeToast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning, dismiss }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <AnimatedToast
              key={t.id}
              {...t}
              onClose={() => removeToast(t.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
