import React, { useState } from 'react';
import { GlobalState, Screen, ToastType } from '../../state/useAppState';
import Header from '../../components/Header';
import TabBarPro from '../../components/TabBarPro';
import { useActor } from '../../hooks/useActor';

interface Props {
  go: (screen: Screen) => void;
  state: GlobalState;
  update: (partial: Partial<GlobalState>) => void;
  showToast: (msg: string, type?: ToastType, duration?: number) => void;
}

type TabType = 'pending' | 'confirmed' | 'history';

const PENDING_REQUESTS = [
  { id: 'r1', client: 'Marie L.', service: 'Coupe + Brushing', date: "Aujourd'hui 15h00", amount: 65, distance: '1.2 km', countdown: 3 },
  { id: 'r2', client: 'Sophie R.', service: 'Coloration', date: 'Demain 10h00', amount: 120, distance: '2.8 km', countdown: 12 },
];

const CONFIRMED_BOOKINGS = [
  { id: 'c1', client: 'Anna K.', service: 'Massage relaxant', date: 'Demain 11h00', amount: 80 },
  { id: 'c2', client: 'Laura B.', service: 'Coupe enfant', date: 'Vendredi 16h00', amount: 35 },
];

const HISTORY_BOOKINGS = [
  { id: 'h1', client: 'Emma D.', service: 'Coloration', date: '20 fev', amount: 120 },
  { id: 'h2', client: 'Chloe P.', service: 'Balayage', date: '18 fev', amount: 150 },
  { id: 'h3', client: 'Nora S.', service: 'Coupe + Brushing', date: '15 fev', amount: 65 },
];

function getUrgencyColor(countdown: number): string {
  if (countdown < 5) return '#FF3D5A';
  if (countdown < 15) return '#F2D06B';
  return 'transparent';
}

export default function ProRadarScreen({ go, state, update, showToast }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [accepted, setAccepted] = useState<string[]>([]);
  const [declined, setDeclined] = useState<string[]>([]);
  const { actor } = useActor();

  const pendingCount = PENDING_REQUESTS.filter(r => !accepted.includes(r.id) && !declined.includes(r.id)).length;

  const handleAccept = async (id: string) => {
    try {
      if (actor) await actor.confirmBooking(id);
    } catch { /* continue with local update */ }
    setAccepted(prev => [...prev, id]);
    showToast('Demande acceptee', 'success');
  };

  const handleDecline = async (id: string) => {
    try {
      if (actor) await actor.cancelBooking(id);
    } catch { /* continue with local update */ }
    setDeclined(prev => [...prev, id]);
    showToast('Demande refusee', 'warning');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: '#050507' }}>
      <Header
        role="pro"
        onSwitchRole={() => { update({ role: 'client' }); go('explorer'); }}
        notifsCount={state.notifications?.filter(n => !n.read).length || 0}
        onNotifs={() => update({ notifsOpen: true })}
        onLogoClick={() => go('pro_dashboard')}
      />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any, overscrollBehavior: 'contain', paddingTop: 72, paddingBottom: 16 }}>
        {/* Title */}
        <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ position: 'relative', width: 12, height: 12, flexShrink: 0 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF3D5A', position: 'relative', zIndex: 2 }} />
            <div style={{
              position: 'absolute', top: 0, left: 0, width: 12, height: 12,
              borderRadius: '50%', background: 'rgba(255,61,90,0.4)',
              animation: 'breathe 1.5s ease-in-out infinite',
            }} />
          </div>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 22, fontWeight: 800, color: '#F4F4F8' }}>Radar</span>
        </div>

        {/* Tabs */}
        <div style={{ padding: '0 20px 16px', display: 'flex', gap: 8 }}>
          {(['pending', 'confirmed', 'history'] as TabType[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1, height: 38, borderRadius: 10,
                background: activeTab === tab ? 'rgba(242,208,107,0.12)' : '#0D0D13',
                border: activeTab === tab ? '1px solid rgba(242,208,107,0.3)' : '1px solid rgba(255,255,255,0.06)',
                color: activeTab === tab ? '#F2D06B' : '#9898B4',
                fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 12, cursor: 'pointer',
                position: 'relative', transition: 'all 150ms',
              }}
            >
              {tab === 'pending' ? 'En attente' : tab === 'confirmed' ? 'Confirmes' : 'Historique'}
              {tab === 'pending' && pendingCount > 0 && (
                <span style={{
                  position: 'absolute', top: -6, right: -6,
                  background: '#FF3D5A', color: '#fff',
                  fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 700,
                  width: 18, height: 18, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <div style={{ padding: '0 20px' }}>
          {activeTab === 'pending' && (
            <>
              {PENDING_REQUESTS.filter(r => !accepted.includes(r.id) && !declined.includes(r.id)).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: 'Inter, sans-serif', color: '#54546C', fontSize: 14 }}>
                  Aucune demande en attente
                </div>
              ) : (
                PENDING_REQUESTS.filter(r => !accepted.includes(r.id) && !declined.includes(r.id)).map(req => {
                  const urgencyColor = getUrgencyColor(req.countdown);
                  return (
                    <div key={req.id} style={{
                      background: '#0D0D13', border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 16, marginBottom: 12, overflow: 'hidden', display: 'flex',
                    }}>
                      <div style={{ width: 4, flexShrink: 0, background: urgencyColor, transition: 'background 300ms' }} />
                      <div style={{ flex: 1, padding: '14px 14px 14px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                          <div>
                            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14, color: '#F4F4F8', marginBottom: 2 }}>{req.client}</div>
                            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#9898B4' }}>{req.service}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 15, color: '#F2D06B' }}>{req.amount} CHF</div>
                            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#54546C', display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'flex-end' }}>
                              <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#54546C" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                              </svg>
                              {req.countdown} min
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#54546C' }}>{req.date}</span>
                          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#54546C', display: 'flex', alignItems: 'center', gap: 3 }}>
                            <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="#54546C" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                            </svg>
                            {req.distance}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            onClick={() => handleDecline(req.id)}
                            style={{
                              flex: 1, height: 38, borderRadius: 10,
                              background: 'rgba(255,61,90,0.08)', border: '1px solid rgba(255,61,90,0.2)',
                              color: '#FF3D5A', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13, cursor: 'pointer',
                            }}
                          >
                            Decliner
                          </button>
                          <button
                            onClick={() => handleAccept(req.id)}
                            style={{
                              flex: 2, height: 38, borderRadius: 10,
                              background: 'linear-gradient(135deg, #F2D06B, #D4A050)',
                              border: 'none', color: '#050507',
                              fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                            }}
                          >
                            Accepter
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}

          {activeTab === 'confirmed' && (
            <>
              {CONFIRMED_BOOKINGS.map(booking => (
                <div key={booking.id} style={{
                  background: '#0D0D13', border: '1px solid rgba(0,217,122,0.15)',
                  borderRadius: 16, padding: '14px 16px', marginBottom: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14, color: '#F4F4F8', marginBottom: 2 }}>{booking.client}</div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#9898B4', marginBottom: 4 }}>{booking.service}</div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#54546C' }}>{booking.date}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 15, color: '#F2D06B', marginBottom: 6 }}>{booking.amount} CHF</div>
                    <span style={{ background: 'rgba(0,217,122,0.1)', color: '#00D97A', fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999 }}>
                      CONFIRME
                    </span>
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === 'history' && (
            <>
              {HISTORY_BOOKINGS.map(booking => (
                <div key={booking.id} style={{
                  background: '#0D0D13', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 16, padding: '14px 16px', marginBottom: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14, color: '#F4F4F8', marginBottom: 2 }}>{booking.client}</div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#9898B4', marginBottom: 4 }}>{booking.service}</div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#54546C' }}>{booking.date}</div>
                  </div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 15, color: '#F2D06B' }}>{booking.amount} CHF</div>
                </div>
              ))}
            </>
          )}
        </div>
        <div style={{ height: 16 }} />
      </div>

      <TabBarPro current="pro_radar" go={go} />
    </div>
  );
}
