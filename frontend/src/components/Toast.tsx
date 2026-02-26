import React, { useEffect } from 'react';
import { Toast } from '../state/useAppState';

interface ToastProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

const BORDER_COLORS: Record<string, string> = {
  success: 'var(--flash)',
  error: 'var(--alert)',
  info: 'var(--blue)',
  warning: 'var(--gold)',
};

function ToastItem({ toast, removeToast }: { toast: Toast; removeToast: (id: string) => void }) {
  useEffect(() => {
    const t = setTimeout(() => removeToast(toast.id), 3000);
    return () => clearTimeout(t);
  }, [toast.id, removeToast]);

  return (
    <div
      onClick={() => removeToast(toast.id)}
      style={{
        background: 'rgba(9,9,13,0.97)',
        backdropFilter: 'blur(24px)',
        borderLeft: `3px solid ${BORDER_COLORS[toast.type] || 'var(--blue)'}`,
        borderRadius: 14,
        padding: '14px 16px',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 500,
        fontSize: 13,
        color: 'var(--t1)',
        animation: 'slideDown 0.3s ease forwards',
        cursor: 'pointer',
      }}
    >
      {toast.message}
    </div>
  );
}

export default function ToastContainer({ toasts, removeToast }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 72,
      left: 16,
      right: 16,
      maxWidth: 398,
      margin: '0 auto',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      pointerEvents: 'none',
    }}>
      {toasts.map(toast => (
        <div key={toast.id} style={{ pointerEvents: 'auto' }}>
          <ToastItem toast={toast} removeToast={removeToast} />
        </div>
      ))}
    </div>
  );
}
