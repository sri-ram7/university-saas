

import { createContext, useContext, useState, useCallback, useRef } from "react";

const ToastContext = createContext(null);

let idCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      delete timersRef.current[id];
    }, 350);
  }, []);


  const toast = useCallback(
    (message, type = "info", duration = 4000) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, type, exiting: false }]);
      timersRef.current[id] = setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss]
  );

  const success = useCallback((msg) => toast(msg, "success"), [toast]);
  const error = useCallback((msg) => toast(msg, "error", 5000), [toast]);
  const info = useCallback((msg) => toast(msg, "info"), [toast]);
  const warning = useCallback((msg) => toast(msg, "warning"), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

/** @returns {{ toast, success, error, info, warning }} */
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be inside ToastProvider");
  return ctx;
};

const ICONS = {
  success: (
    <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 18, height: 18 }}>
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 18, height: 18 }}>
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 18, height: 18 }}>
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 18, height: 18 }}>
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
  ),
};

const COLORS = {
  success: { bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.4)", icon: "#10b981", glow: "0 0 20px rgba(16,185,129,0.3)" },
  error:   { bg: "rgba(239,68,68,0.15)",  border: "rgba(239,68,68,0.4)",  icon: "#ef4444", glow: "0 0 20px rgba(239,68,68,0.3)" },
  warning: { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.4)", icon: "#f59e0b", glow: "0 0 20px rgba(245,158,11,0.3)" },
  info:    { bg: "rgba(99,102,241,0.15)", border: "rgba(99,102,241,0.4)", icon: "#6366f1", glow: "0 0 20px rgba(99,102,241,0.3)" },
};

/**
 * @param {{ toasts: object[], onDismiss: (id:number)=>void }} props
 */
export const ToastContainer = ({ toasts, onDismiss }) => (
  <div
    style={{
      position: "fixed",
      top: 20,
      right: 20,
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      gap: 10,
      pointerEvents: "none",
    }}
  >
    {(toasts || []).map((t) => {
      const c = COLORS[t.type];
      return (
        <div
          key={t.id}
          style={{
            pointerEvents: "all",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 16px",
            borderRadius: 12,
            background: c.bg,
            border: `1px solid ${c.border}`,
            boxShadow: c.glow,
            backdropFilter: "blur(16px)",
            color: "#f1f5f9",
            fontSize: 14,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            maxWidth: 360,
            cursor: "pointer",
            animation: t.exiting
              ? "toastOut 0.35s ease forwards"
              : "toastIn 0.35s ease forwards",
          }}
          onClick={() => onDismiss(t.id)}
          role="alert"
          aria-live="polite"
        >
          <span style={{ color: c.icon, flexShrink: 0 }}>{ICONS[t.type]}</span>
          <span style={{ flex: 1 }}>{t.message}</span>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 18, lineHeight: 1 }}>×</span>
        </div>
      );
    })}
    <style>{`
      @keyframes toastIn {
        from { opacity: 0; transform: translateX(40px) scale(0.95); }
        to   { opacity: 1; transform: translateX(0) scale(1); }
      }
      @keyframes toastOut {
        from { opacity: 1; transform: translateX(0) scale(1); }
        to   { opacity: 0; transform: translateX(40px) scale(0.95); }
      }
    `}</style>
  </div>
);
