import React from 'react';
import { AppNotification } from '../state/useAppState';

interface NotifsPanelProps {
  open: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  markRead: () => void;
}

const TYPE_COLORS: Record<string, string> = {
  nouvelle_demande: 'var(--gold)',
  paiement_confirme: 'var(--flash)',
  fonds_liberes: 'var(--flash)',
  booking_confirme: 'var(--blue)',
  avis_recu: 'var(--gold)',
  profil_active: 'var(--flash)',
};

function formatTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'A l instant';
  if (mins < 60) return `Il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Il y a ${days}j`;
}

export default function NotifsPanel({ open, onClose, notifications, markRead }: NotifsPanelProps) {
  if (!open) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 400 }}>
      {/* Overlay */}
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />

      {/* Panel */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: '85%',
        maxWidth: 380,
        background: 'var(--d1)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideDown 0.3s ease forwards',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 20px 16px', borderBottom: '1px solid var(--d3)', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--t1)' }}>Notifications</div>
            {unreadCount > 0 && (
              <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {unreadCount > 0 && (
              <button onClick={markRead} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--gold)', fontWeight: 600 }}>
                Tout lire
              </button>
            )}
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', padding: 4 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {notifications.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12 }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--t4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <div style={{ fontSize: 13, color: 'var(--t4)' }}>Aucune notification</div>
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                style={{
                  display: 'flex', gap: 12, padding: '14px 20px',
                  background: notif.read ? 'transparent' : 'rgba(255,255,255,0.02)',
                  borderBottom: '1px solid var(--d3)',
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: (TYPE_COLORS[notif.type] || 'var(--blue)') + '22',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: TYPE_COLORS[notif.type] || 'var(--blue)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: notif.read ? 500 : 700, color: 'var(--t1)', lineHeight: 1.4 }}>
                    {notif.message}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--t4)', marginTop: 4 }}>
                    {formatTime(notif.createdAt)}
                  </div>
                </div>
                {!notif.read && (
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--blue)', flexShrink: 0, marginTop: 4 }} />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
