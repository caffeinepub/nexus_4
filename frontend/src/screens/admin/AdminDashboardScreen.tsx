import React, { useEffect, useState } from 'react';
import TabBarAdmin from '../../components/TabBarAdmin';
import { GlobalState, Screen } from '../../state/useAppState';
import { useActor } from '../../hooks/useActor';
import { Pro } from '../../backend';

interface Props {
  go: (screen: Screen) => void;
  state: GlobalState;
  update: (partial: Partial<GlobalState>) => void;
}

function useCountUp(target: number, duration = 800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

const MOCK_BOOKINGS = [
  { id: 'b001', client: 'Marc D.', pro: 'Jean B.', service: 'Coupe homme', date: '26.02', montant: 35, statut: 'confirmed' },
  { id: 'b002', client: 'Luca M.', pro: 'Sophie L.', service: 'Soin visage', date: '25.02', montant: 70, statut: 'completed' },
  { id: 'b003', client: 'Alex R.', pro: 'Marc T.', service: 'Massage relaxant', date: '24.02', montant: 80, statut: 'pending' },
  { id: 'b004', client: 'Tom B.', pro: 'Jean B.', service: 'Barbe design', date: '23.02', montant: 30, statut: 'cancelled' },
];

const STATUS_COLORS: Record<string, string> = {
  pending: '#F2D06B', confirmed: '#5B7FFF',
  completed: '#00D97A', cancelled: '#FF3D5A', disputed: '#FF3D5A',
};

export default function AdminDashboardScreen({ go, state, update }: Props) {
  const { actor } = useActor();
  const [pros, setPros] = useState<Pro[]>([]);

  useEffect(() => {
    if (!actor) return;
    actor.listPros().then(p => setPros(p)).catch(() => {});
  }, [actor]);

  const totalPros = useCountUp(pros.length || 24);
  const totalBookings = useCountUp(156);
  const totalRevenu = useCountUp(4820);
  const activePros = useCountUp(pros.filter(p => p.actif).length || 18);

  const pendingPros = pros.filter(p => !p.subscriptionActive).slice(0, 5);

  const handleValidate = (id: string) => {
    setPros(prev => prev.map(p => p.id.toString() === id ? { ...p, actif: true } : p));
  };

  const handleRefuse = (id: string) => {
    setPros(prev => prev.filter(p => p.id.toString() !== id));
  };

  const handleLogout = () => {
    update({ adminAuthenticated: false, role: null });
    go('login');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: '#050507' }}>
      {/* Header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', background: 'rgba(5,5,7,0.97)',
        backdropFilter: 'blur(32px)', zIndex: 100,
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 800, color: '#FF3D5A', letterSpacing: '0.04em' }}>
          NEXUS ADMIN
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: 'none', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8, fontFamily: 'Inter, sans-serif', color: '#9898B4',
            fontSize: 12, padding: '6px 12px', cursor: 'pointer',
          }}
        >
          Deconnexion
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any, overscrollBehavior: 'contain', paddingTop: 72, paddingBottom: 16 }}>
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '20px 20px 0' }}>
          {[
            { label: 'Total pros', value: totalPros, color: '#00D97A' },
            { label: 'Reservations', value: totalBookings, color: '#5B7FFF' },
            { label: 'Revenus CHF', value: totalRevenu, color: '#F2D06B' },
            { label: 'Pros actifs', value: activePros, color: '#00D97A' },
          ].map((kpi, i) => (
            <div key={i} style={{ background: '#0D0D13', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '16px 14px' }}>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: kpi.color, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{kpi.label}</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 28, fontWeight: 800, color: '#F4F4F8', marginTop: 4 }}>{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* Pending pros */}
        <div style={{ margin: '20px 20px 0' }}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, color: '#54546C', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
            En attente de validation
          </div>
          {pendingPros.length === 0 ? (
            <div style={{ background: '#0D0D13', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '16px', textAlign: 'center' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#54546C' }}>Aucun pro en attente</span>
            </div>
          ) : (
            pendingPros.map(pro => (
              <div key={pro.id.toString()} style={{ background: '#0D0D13', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '14px', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 700, color: '#F4F4F8' }}>{pro.name}</div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#54546C', marginTop: 2 }}>{pro.ville}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => handleValidate(pro.id.toString())} style={{ padding: '7px 14px', borderRadius: 10, border: 'none', background: '#00D97A', color: '#050507', fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Valider</button>
                    <button onClick={() => handleRefuse(pro.id.toString())} style={{ padding: '7px 14px', borderRadius: 10, border: 'none', background: '#FF3D5A', color: '#fff', fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Refuser</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Recent bookings */}
        <div style={{ margin: '20px 20px 0' }}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, color: '#54546C', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
            Derniers rendez-vous
          </div>
          {MOCK_BOOKINGS.map(b => (
            <div key={b.id} style={{ background: '#0D0D13', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '12px 14px', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600, color: '#F4F4F8' }}>{b.client} - {b.pro}</div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#54546C', marginTop: 2 }}>{b.service} · {b.date}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 700, color: '#F2D06B' }}>{b.montant} CHF</div>
                  <div style={{ marginTop: 4, padding: '2px 8px', borderRadius: 8, background: STATUS_COLORS[b.statut] + '22', display: 'inline-block' }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 9, fontWeight: 700, color: STATUS_COLORS[b.statut] }}>{b.statut.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Commissions */}
        <div style={{ margin: '16px 20px 0', background: '#0D0D13', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '16px' }}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, color: '#54546C', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
            Commissions NEXUS
          </div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 22, fontWeight: 800, color: '#F2D06B' }}>723.00 CHF</div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#54546C', marginTop: 4 }}>Total cumule ce mois</div>
        </div>
        <div style={{ height: 20 }} />
      </div>

      <TabBarAdmin current="admin_dashboard" go={go} />
    </div>
  );
}
