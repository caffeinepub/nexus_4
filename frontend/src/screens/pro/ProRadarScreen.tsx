import React, { useEffect, useState, useRef } from 'react';
import Header from '../../components/Header';
import TabBarPro from '../../components/TabBarPro';
import { GlobalState, Screen, ToastType } from '../../state/useAppState';
import { useActor } from '../../hooks/useActor';

interface Props {
  go: (screen: Screen) => void;
  state: GlobalState;
  update: (partial: Partial<GlobalState>) => void;
  showToast: (msg: string, type?: ToastType, duration?: number) => void;
}

type TabType = 'pending' | 'confirmed' | 'history';

interface MockBooking {
  id: string;
  service: string;
  duree: number;
  montant: number;
  client: string;
  date: string;
  heure: string;
  statut: string;
  createdAt: number;
}

function CountdownTimer({ createdAt, onExpire }: { createdAt: number; onExpire: () => void }) {
  const [remaining, setRemaining] = useState(0);
  const expireRef = useRef(onExpire);
  expireRef.current = onExpire;

  useEffect(() => {
    const expiresAt = createdAt + 15 * 60 * 1000;
    const calc = () => {
      const diff = Math.max(0, expiresAt - Date.now());
      setRemaining(diff);
      if (diff === 0) expireRef.current();
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [createdAt]);

  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);
  const isUrgent = remaining < 2 * 60 * 1000;

  return (
    <span style={{
      fontSize: 12, fontWeight: 700,
      color: isUrgent ? 'var(--alert)' : 'var(--t3)',
      animation: isUrgent ? 'breathe 1.5s ease-in-out infinite' : 'none',
    }}>
      {mins}:{secs.toString().padStart(2, '0')}
    </span>
  );
}

export default function ProRadarScreen({ go, state, update, showToast }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [bookings, setBookings] = useState<MockBooking[]>([
    { id: 'b1', service: 'Coupe homme', duree: 30, montant: 35, client: 'Marc D.', date: '2026-02-26', heure: '14:30', statut: 'pending', createdAt: Date.now() - 5 * 60 * 1000 },
    { id: 'b2', service: 'Degrade premium', duree: 45, montant: 45, client: 'Luca M.', date: '2026-02-26', heure: '16:00', statut: 'pending', createdAt: Date.now() - 12 * 60 * 1000 },
    { id: 'b3', service: 'Coupe + Barbe', duree: 60, montant: 55, client: 'Alex R.', date: '2026-02-25', heure: '10:00', statut: 'confirmed', createdAt: Date.now() - 2 * 3600 * 1000 },
    { id: 'b4', service: 'Barbe design', duree: 30, montant: 30, client: 'Tom B.', date: '2026-02-24', heure: '11:00', statut: 'completed', createdAt: Date.now() - 24 * 3600 * 1000 },
  ]);
  const { actor } = useActor();

  const pending = bookings.filter(b => b.statut === 'pending');
  const confirmed = bookings.filter(b => b.statut === 'confirmed');
  const history = bookings.filter(b => b.statut === 'completed' || b.statut === 'cancelled');

  const handleAccept = async (id: string) => {
    try {
      if (actor) await actor.confirmBooking(id);
    } catch {
      // continue with local update
    }
    setBookings(prev => prev.map(b => b.id === id ? { ...b, statut: 'confirmed' } : b));
    showToast('Reservation confirmee', 'success');
  };

  const handleDecline = async (id: string) => {
    try {
      if (actor) await actor.cancelBooking(id);
    } catch {
      // continue with local update
    }
    setBookings(prev => prev.map(b => b.id === id ? { ...b, statut: 'cancelled' } : b));
    showToast('Reservation declinee', 'info');
  };

  const statusColor: Record<string, string> = {
    pending: 'var(--gold)',
    confirmed: 'var(--blue)',
    completed: 'var(--flash)',
    cancelled: 'var(--t3)',
  };

  const tabs: { key: TabType; label: string }[] = [
    { key: 'pending', label: 'En attente' },
    { key: 'confirmed', label: 'Confirmees' },
    { key: 'history', label: 'Historique' },
  ];

  const currentList = activeTab === 'pending' ? pending : activeTab === 'confirmed' ? confirmed : history;

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: 'var(--void)' }}>
      <Header role="pro" onSwitchRole={() => go('role')} notifsCount={0} onNotifs={() => update({ notifsOpen: true })} />

      <div style={{ flex: 1, overflowY: 'auto', paddingTop: 72 }}>
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{ fontWeight: 900, fontSize: 40, color: 'var(--t1)', fontFamily: 'Inter, sans-serif', lineHeight: 1 }}>Radar</div>
          <div style={{ fontSize: 13, color: 'var(--t3)', marginTop: 4 }}>Demandes en temps reel</div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, padding: '16px 20px 0', overflowX: 'auto' }}>
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                flexShrink: 0, padding: '8px 16px', borderRadius: 20, border: 'none', cursor: 'pointer',
                background: activeTab === t.key ? 'var(--gold)' : 'var(--d2)',
                color: activeTab === t.key ? '#050507' : 'var(--t2)',
                fontSize: 13, fontWeight: 600,
              }}
            >
              {t.label}
              {t.key === 'pending' && pending.length > 0 && (
                <span style={{ marginLeft: 6, background: 'var(--alert)', color: '#fff', borderRadius: 10, padding: '1px 6px', fontSize: 10, fontWeight: 700 }}>
                  {pending.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div style={{ padding: '16px 20px 0' }}>
          {currentList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--d2)', borderRadius: 16 }}>
              <div style={{ fontSize: 14, color: 'var(--t3)' }}>Aucune demande</div>
              <div style={{ fontSize: 12, color: 'var(--t4)', marginTop: 6 }}>Activez le mode Flash pour recevoir des demandes instantanees</div>
            </div>
          ) : (
            currentList.map(booking => (
              <div key={booking.id} style={{ background: 'var(--d2)', borderRadius: 16, padding: '16px', marginBottom: 12 }}>
                {activeTab === 'pending' && (
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--alert)', letterSpacing: 0.8, marginBottom: 8 }}>NOUVELLE DEMANDE</div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)' }}>{booking.service}</div>
                    <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>{booking.duree} min · {booking.client}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gold)', marginTop: 4 }}>{booking.montant} CHF</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, color: 'var(--t3)' }}>{booking.date}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t2)', marginTop: 2 }}>{booking.heure}</div>
                    {activeTab === 'pending' && (
                      <div style={{ marginTop: 4 }}>
                        <CountdownTimer createdAt={booking.createdAt} onExpire={() => handleDecline(booking.id)} />
                      </div>
                    )}
                    {activeTab !== 'pending' && (
                      <div style={{ marginTop: 4, padding: '2px 8px', borderRadius: 10, background: statusColor[booking.statut] + '22', display: 'inline-block' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: statusColor[booking.statut] }}>{booking.statut.toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                </div>
                {activeTab === 'pending' && (
                  <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                    <button
                      onClick={() => handleDecline(booking.id)}
                      style={{ flex: 1, padding: '11px', borderRadius: 12, border: 'none', background: 'var(--d4)', color: 'var(--t2)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                    >
                      Decliner
                    </button>
                    <button
                      onClick={() => handleAccept(booking.id)}
                      style={{ flex: 1, padding: '11px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, var(--gold), var(--gold2))', color: '#050507', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                    >
                      Accepter
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        <div style={{ height: 20 }} />
      </div>

      <TabBarPro active="radar" go={go} />
    </div>
  );
}
