import React, { useState } from 'react';
import { GlobalState, Screen, ToastType } from '../../state/useAppState';
import Header from '../../components/Header';
import TabBarClient from '../../components/TabBarClient';

interface Props {
  go: (screen: Screen) => void;
  state: GlobalState;
  update: (patch: Partial<GlobalState>) => void;
  showToast: (message: string, type?: ToastType) => void;
}

type TabType = 'upcoming' | 'completed';

const UPCOMING_BOOKINGS = [
  { id: 'b1', pro: 'Sofia Martins', service: 'Coupe + Brushing', date: new Date(Date.now()), amount: 65, status: 'confirmed' },
  { id: 'b2', pro: 'Amira Benali', service: 'Soin visage', date: new Date(Date.now() + 86400000), amount: 55, status: 'pending' },
  { id: 'b3', pro: 'Lea Dupont', service: 'Massage relaxant', date: new Date(Date.now() + 86400000 * 5), amount: 80, status: 'confirmed' },
];

const COMPLETED_BOOKINGS = [
  { id: 'c1', pro: 'Sofia Martins', service: 'Balayage', date: new Date(Date.now() - 86400000 * 7), amount: 150, status: 'completed' },
  { id: 'c2', pro: 'Nadia Rousseau', service: 'Pose gel', date: new Date(Date.now() - 86400000 * 14), amount: 45, status: 'cancelled' },
  { id: 'c3', pro: 'Lea Dupont', service: 'Massage therapeutique', date: new Date(Date.now() - 86400000 * 21), amount: 90, status: 'completed' },
];

function getCountdownChip(date: Date) {
  const diffDays = Math.floor((date.getTime() - Date.now()) / 86400000);
  if (diffDays === 0) return { label: "Aujourd'hui", bg: 'rgba(0,217,122,0.1)', color: '#00D97A' };
  if (diffDays === 1) return { label: 'Demain', bg: 'rgba(242,208,107,0.1)', color: '#F2D06B' };
  return { label: `Dans ${diffDays}j`, bg: 'rgba(152,152,180,0.1)', color: '#9898B4' };
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'confirmed': return { label: 'Confirme', bg: 'rgba(0,217,122,0.1)', color: '#00D97A' };
    case 'pending': return { label: 'En attente', bg: 'rgba(242,208,107,0.1)', color: '#F2D06B' };
    case 'completed': return { label: 'Termine', bg: 'rgba(91,127,255,0.1)', color: '#5B7FFF' };
    case 'cancelled': return { label: 'Annule', bg: 'rgba(255,61,90,0.1)', color: '#FF3D5A' };
    default: return { label: status, bg: 'rgba(152,152,180,0.1)', color: '#9898B4' };
  }
}

export default function ReservationsScreen({ go, state, update, showToast }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const bookings = activeTab === 'upcoming' ? UPCOMING_BOOKINGS : COMPLETED_BOOKINGS;

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: '#050507' }}>
      <Header title="Reservations" onLogoClick={() => go('explorer')} />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any, overscrollBehavior: 'contain', paddingTop: 72 }}>
        <div style={{ display: 'flex', padding: '8px 20px 16px', gap: 8 }}>
          {(['upcoming', 'completed'] as TabType[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1, height: 40, borderRadius: 10,
                background: activeTab === tab ? 'rgba(242,208,107,0.1)' : '#0D0D13',
                border: activeTab === tab ? '1px solid rgba(242,208,107,0.3)' : '1px solid rgba(255,255,255,0.06)',
                color: activeTab === tab ? '#F2D06B' : '#9898B4',
                fontFamily: 'Inter, sans-serif', fontWeight: activeTab === tab ? 600 : 400,
                fontSize: 13, cursor: 'pointer', transition: 'all 150ms',
              }}
            >
              {tab === 'upcoming' ? `A venir (${UPCOMING_BOOKINGS.length})` : `Termines (${COMPLETED_BOOKINGS.length})`}
            </button>
          ))}
        </div>

        <div style={{ padding: '0 20px' }}>
          {bookings.map(booking => {
            const status = getStatusBadge(booking.status);
            return (
              <div key={booking.id} style={{
                background: '#0D0D13', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16, padding: '14px 16px', marginBottom: 10,
                display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'rgba(242,208,107,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#F2D06B" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14,
                    color: booking.status === 'cancelled' ? '#54546C' : '#F4F4F8',
                    marginBottom: 2,
                    textDecoration: booking.status === 'cancelled' ? 'line-through' : 'none',
                  }}>
                    {booking.service}
                  </div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#9898B4', marginBottom: 4 }}>{booking.pro}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#54546C' }}>
                      {booking.date.toLocaleDateString('fr-CH', { day: 'numeric', month: 'short' })}
                    </span>
                    {activeTab === 'upcoming' && (
                      <span style={{
                        fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 600,
                        padding: '2px 7px', borderRadius: 999,
                        background: getCountdownChip(booking.date).bg,
                        color: getCountdownChip(booking.date).color,
                      }}>
                        {getCountdownChip(booking.date).label}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14, color: '#F2D06B', marginBottom: 4 }}>
                    {booking.amount} CHF
                  </div>
                  <span style={{
                    fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 600,
                    padding: '2px 7px', borderRadius: 999,
                    background: status.bg, color: status.color,
                  }}>
                    {status.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ height: 16 }} />
      </div>

      <TabBarClient current="client_reservations" go={go} />
    </div>
  );
}
