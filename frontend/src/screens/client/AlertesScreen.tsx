import React, { useState, useEffect } from 'react';
import { GlobalState, Screen, ToastType, AppNotification } from '../../state/useAppState';
import Header from '../../components/Header';
import TabBarClient from '../../components/TabBarClient';

interface Props {
  go: (screen: Screen) => void;
  state: GlobalState;
  update: (patch: Partial<GlobalState>) => void;
  showToast: (message: string, type?: ToastType) => void;
}

const DEMO_NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', type: 'booking_confirme', message: 'Votre reservation avec Sofia Martins a ete confirmee pour demain a 14h00.', read: false, time: 'Il y a 1h' },
  { id: 'n2', type: 'paiement_confirme', message: 'Paiement de 65 CHF confirme pour votre reservation.', read: false, time: 'Il y a 2h' },
  { id: 'n3', type: 'nouvelle_demande', message: 'Rappel : votre RDV avec Lea Dupont est dans 24h.', read: true, time: 'Hier' },
  { id: 'n4', type: 'avis_recu', message: 'Sofia Martins vous a laisse un message.', read: true, time: 'Il y a 2 jours' },
];

const TYPE_ICONS: Record<string, React.ReactNode> = {
  booking_confirme: (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  paiement_confirme: (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  ),
  nouvelle_demande: (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  avis_recu: (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  fonds_liberes: (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
};

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  booking_confirme: { bg: 'rgba(0,217,122,0.12)', color: '#00D97A' },
  paiement_confirme: { bg: 'rgba(242,208,107,0.12)', color: '#F2D06B' },
  nouvelle_demande: { bg: 'rgba(91,127,255,0.12)', color: '#5B7FFF' },
  avis_recu: { bg: 'rgba(242,208,107,0.12)', color: '#F2D06B' },
  fonds_liberes: { bg: 'rgba(91,127,255,0.12)', color: '#5B7FFF' },
};

export default function AlertesScreen({ go, state, update, showToast }: Props) {
  const [notifications, setNotifications] = useState<AppNotification[]>(DEMO_NOTIFICATIONS);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const allRead = unreadCount === 0;

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: '#050507' }}>
      <Header title="Alertes" onLogoClick={() => go('explorer')} />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any, overscrollBehavior: 'contain', paddingTop: 72 }}>
        {/* Header row */}
        <div style={{ padding: '8px 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            fontFamily: 'Inter, sans-serif', fontSize: 13,
            color: allRead ? '#00D97A' : '#9898B4',
          }}>
            {allRead ? 'Tout lu' : `${unreadCount} non lu${unreadCount > 1 ? 's' : ''}`}
          </span>
          {!allRead && (
            <button
              onClick={markAllRead}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600, color: '#F2D06B',
                background: 'none', border: 'none', cursor: 'pointer',
              }}
            >
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#F2D06B" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Tout marquer lu
            </button>
          )}
        </div>

        <div style={{ padding: '0 20px' }}>
          {allRead && notifications.length === 0 && (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '60px 0', gap: 12,
            }}>
              <svg width={64} height={64} viewBox="0 0 24 24" fill="none" stroke="#1C1C26" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 500, color: '#54546C' }}>
                Vous etes a jour
              </div>
            </div>
          )}

          {notifications.map((notif, i) => {
            const cfg = TYPE_COLORS[notif.type] || { bg: 'rgba(152,152,180,0.1)', color: '#9898B4' };
            const icon = TYPE_ICONS[notif.type];
            return (
              <div
                key={notif.id}
                onClick={() => markRead(notif.id)}
                style={{
                  background: notif.read ? 'transparent' : 'rgba(242,208,107,0.03)',
                  border: notif.read ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(242,208,107,0.1)',
                  borderLeft: notif.read ? '1px solid rgba(255,255,255,0.04)' : '3px solid #F2D06B',
                  borderRadius: 14,
                  padding: '14px',
                  marginBottom: 10,
                  display: 'flex',
                  gap: 12,
                  cursor: 'pointer',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(-10px)',
                  transition: `opacity 200ms ease-out ${i * 50}ms, transform 200ms ease-out ${i * 50}ms`,
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: cfg.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, color: cfg.color,
                }}>
                  {icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'Inter, sans-serif', fontSize: 13,
                    color: notif.read ? '#9898B4' : '#F4F4F8',
                    lineHeight: 1.5, marginBottom: 4,
                    fontWeight: notif.read ? 400 : 500,
                  }}>
                    {notif.message}
                  </div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#54546C' }}>
                    {notif.time}
                  </div>
                </div>
                {!notif.read && (
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: '#F2D06B', flexShrink: 0, marginTop: 4,
                  }} />
                )}
              </div>
            );
          })}
        </div>

        <div style={{ height: 16 }} />
      </div>

      <TabBarClient current="client_alertes" go={go} notifsCount={unreadCount} />
    </div>
  );
}
