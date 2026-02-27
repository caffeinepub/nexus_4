import React from 'react';
import { AppNotification } from '../state/useAppState';

interface NotifsPanelProps {
  notifications: AppNotification[];
  onClose: () => void;
  onMarkAllRead: () => void;
}

const typeConfig = {
  nouvelle_demande: {
    color: '#F2D06B',
    bg: 'rgba(242,208,107,0.12)',
    icon: (
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#F2D06B" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  paiement_confirme: {
    color: '#00D97A',
    bg: 'rgba(0,217,122,0.12)',
    icon: (
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#00D97A" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
      </svg>
    ),
  },
  fonds_liberes: {
    color: '#5B7FFF',
    bg: 'rgba(91,127,255,0.12)',
    icon: (
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#5B7FFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  booking_confirme: {
    color: '#5B7FFF',
    bg: 'rgba(91,127,255,0.12)',
    icon: (
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#5B7FFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  avis_recu: {
    color: '#F2D06B',
    bg: 'rgba(242,208,107,0.12)',
    icon: (
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#F2D06B" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
};

export default function NotifsPanel({ notifications, onClose, onMarkAllRead }: NotifsPanelProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5,5,7,0.7)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 200,
        }}
      />
      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: 400,
          background: '#0D0D13',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
          zIndex: 201,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 300ms cubic-bezier(0.32,0.72,0,1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: 16,
              color: '#F4F4F8',
            }}>
              Notifications
            </span>
            {unreadCount > 0 && (
              <span style={{
                background: '#F2D06B',
                color: '#050507',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: 11,
                padding: '2px 7px',
                borderRadius: 999,
                animation: 'scaleIn 200ms ease-out',
              }}>
                {unreadCount}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#F2D06B',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: 12,
                  cursor: 'pointer',
                  padding: '4px 8px',
                }}
              >
                Tout lire
              </button>
            )}
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
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {notifications.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: 200,
              gap: 12,
            }}>
              <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="#2E2E3E" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span style={{ color: '#54546C', fontFamily: 'Inter, sans-serif', fontSize: 14 }}>
                Aucune notification
              </span>
            </div>
          ) : (
            notifications.map((notif, i) => {
              const config = typeConfig[notif.type] || typeConfig.booking_confirme;
              return (
                <div
                  key={notif.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: '14px 20px',
                    background: notif.read ? 'transparent' : 'rgba(242,208,107,0.03)',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    animation: `fadeIn 300ms ease-out ${i * 30}ms both`,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: config.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {config.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: notif.read ? 400 : 600,
                      fontSize: 14,
                      color: notif.read ? '#9898B4' : '#F4F4F8',
                      margin: 0,
                      lineHeight: 1.4,
                    }}>
                      {notif.message}
                    </p>
                    <p style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 12,
                      color: '#54546C',
                      margin: '4px 0 0',
                    }}>
                      {notif.time}
                    </p>
                  </div>
                  {!notif.read && (
                    <div style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#F2D06B',
                      flexShrink: 0,
                      marginTop: 4,
                    }} />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
