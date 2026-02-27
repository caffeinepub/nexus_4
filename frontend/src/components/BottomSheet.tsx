import React from 'react';

interface BottomSheetProps {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function BottomSheet({ title, onClose, children, footer }: BottomSheetProps) {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5,5,7,0.85)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 300,
        }}
      />
      {/* Sheet */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: 'calc(100dvh - 64px - env(safe-area-inset-bottom, 0px))',
          background: '#0D0D13',
          borderRadius: '24px 24px 0 0',
          zIndex: 301,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 250ms cubic-bezier(0.32,0.72,0,1)',
        }}
        className="bottom-sheet-inner"
      >
        {/* Drag handle */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '12px 0 4px',
          flexShrink: 0,
        }}>
          <div style={{
            width: 36,
            height: 4,
            borderRadius: 999,
            background: 'rgba(255,255,255,0.12)',
          }} />
        </div>

        {/* Header */}
        {title && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 20px 16px',
            flexShrink: 0,
          }}>
            <span style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: 18,
              color: '#F4F4F8',
            }}>
              {title}
            </span>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#1C1C26',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#9898B4" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch' as any,
          overscrollBehavior: 'contain',
          padding: '0 20px',
        }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={{
            flexShrink: 0,
            padding: '12px 20px calc(12px + env(safe-area-inset-bottom, 8px))',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            background: 'rgba(5,5,7,0.97)',
          }}>
            {footer}
          </div>
        )}
      </div>
      <style>{`
        @media (min-width: 768px) {
          .bottom-sheet-inner {
            left: 50% !important;
            right: auto !important;
            bottom: 50% !important;
            transform: translate(-50%, 50%) !important;
            width: 100% !important;
            max-width: 560px !important;
            border-radius: 24px !important;
            max-height: 85vh !important;
            animation: scaleIn 250ms cubic-bezier(0.32,0.72,0,1) !important;
          }
        }
      `}</style>
    </>
  );
}
