import React, { useEffect, useState } from 'react';
import { Toast as ToastType, ToastType as TType } from '../state/useAppState';

interface ToastProps {
  toasts: ToastType[];
  removeToast: (id: string) => void;
}

function ToastItem({ toast, onRemove }: { toast: ToastType; onRemove: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const iconColor = {
    success: '#00D97A',
    error: '#FF3D5A',
    info: '#5B7FFF',
    sms: '#F2D06B',
    warning: '#F2D06B',
  }[toast.type];

  const icon = {
    success: (
      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    error: (
      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
    info: (
      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    sms: (
      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    warning: (
      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  }[toast.type];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 16px',
        background: 'rgba(9,9,13,0.97)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderLeft: `3px solid ${iconColor}`,
        borderRadius: 14,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-12px)',
        transition: 'opacity 300ms ease-out, transform 300ms ease-out',
        cursor: 'pointer',
      }}
      onClick={onRemove}
    >
      <div style={{
        width: 24,
        height: 24,
        borderRadius: '50%',
        background: `rgba(${iconColor === '#00D97A' ? '0,217,122' : iconColor === '#FF3D5A' ? '255,61,90' : iconColor === '#5B7FFF' ? '91,127,255' : '242,208,107'},0.15)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <span style={{
        fontFamily: 'Inter, sans-serif',
        fontWeight: 500,
        fontSize: 13,
        color: '#F4F4F8',
        flex: 1,
        lineHeight: 1.4,
      }}>
        {toast.message}
      </span>
    </div>
  );
}

export default function Toast({ toasts, removeToast }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 72,
      left: 16,
      right: 16,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      pointerEvents: 'none',
    }}>
      <style>{`
        @media (min-width: 768px) {
          .toast-container {
            left: auto !important;
            right: 24px !important;
            max-width: 360px !important;
          }
        }
      `}</style>
      {toasts.map(toast => (
        <div key={toast.id} style={{ pointerEvents: 'auto' }}>
          <ToastItem toast={toast} onRemove={() => removeToast(toast.id)} />
        </div>
      ))}
    </div>
  );
}
