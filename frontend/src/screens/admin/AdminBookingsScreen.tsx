import React, { useState } from 'react';
import TabBarAdmin from '../../components/TabBarAdmin';
import { GlobalState, Screen } from '../../state/useAppState';

interface Props {
  go: (screen: Screen) => void;
  state: GlobalState;
}

type StatusFilter = 'Tous' | 'pending' | 'confirmed' | 'completed' | 'cancelled';

const DEMO_BOOKINGS = [
  { id: 'b001', client: 'Marc Dupont', pro: 'Sophie Laurent', service: 'Coupe + Brushing', date: '26 fev 2026', montant: 65, statut: 'confirmed' },
  { id: 'b002', client: 'Luca Moretti', pro: 'Amina Benali', service: 'Soin visage', date: '25 fev 2026', montant: 80, statut: 'completed' },
  { id: 'b003', client: 'Alex Roux', pro: 'Fatima Ouali', service: 'Massage relaxant', date: '24 fev 2026', montant: 90, statut: 'pending' },
  { id: 'b004', client: 'Tom Bernard', pro: 'Sophie Laurent', service: 'Balayage', date: '23 fev 2026', montant: 120, statut: 'cancelled' },
  { id: 'b005', client: 'Julie Martin', pro: 'Chloe Martin', service: 'Pose gel', date: '22 fev 2026', montant: 75, statut: 'completed' },
  { id: 'b006', client: 'Pierre Leroy', pro: 'Isabelle Dupont', service: 'Maquillage soiree', date: '21 fev 2026', montant: 80, statut: 'confirmed' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'En attente', color: '#F2D06B', bg: 'rgba(242,208,107,0.1)' },
  confirmed: { label: 'Confirme', color: '#5B7FFF', bg: 'rgba(91,127,255,0.1)' },
  completed: { label: 'Termine', color: '#00D97A', bg: 'rgba(0,217,122,0.1)' },
  cancelled: { label: 'Annule', color: '#FF3D5A', bg: 'rgba(255,61,90,0.1)' },
};

const FILTERS: StatusFilter[] = ['Tous', 'pending', 'confirmed', 'completed', 'cancelled'];

export default function AdminBookingsScreen({ go, state }: Props) {
  const [filter, setFilter] = useState<StatusFilter>('Tous');

  const filtered = DEMO_BOOKINGS.filter(b => filter === 'Tous' || b.statut === filter);

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
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 600, color: '#9898B4' }}>Reservations</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any, overscrollBehavior: 'contain', paddingTop: 72, paddingBottom: 16 }}>
        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 8, padding: '16px 20px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {FILTERS.map(f => {
            const cfg = f !== 'Tous' ? STATUS_CONFIG[f] : null;
            const isActive = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  flexShrink: 0, padding: '7px 14px', borderRadius: 999,
                  background: isActive ? (cfg ? cfg.bg : 'rgba(255,61,90,0.12)') : '#0D0D13',
                  border: isActive ? `1px solid ${cfg ? cfg.color + '44' : 'rgba(255,61,90,0.3)'}` : '1px solid rgba(255,255,255,0.06)',
                  color: isActive ? (cfg ? cfg.color : '#FF3D5A') : '#9898B4',
                  fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                }}
              >
                {f === 'Tous' ? 'Tous' : STATUS_CONFIG[f].label}
              </button>
            );
          })}
        </div>

        {/* Bookings list */}
        <div style={{ padding: '0 20px' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: 'Inter, sans-serif', color: '#54546C', fontSize: 14 }}>
              Aucune reservation trouvee
            </div>
          ) : (
            filtered.map(b => {
              const cfg = STATUS_CONFIG[b.statut] || { label: b.statut, color: '#9898B4', bg: 'rgba(152,152,180,0.1)' };
              return (
                <div key={b.id} style={{
                  background: '#0D0D13', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 14, padding: '14px 16px', marginBottom: 10,
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 700, color: '#F4F4F8', marginBottom: 2 }}>{b.service}</div>
                      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#9898B4' }}>{b.client} avec {b.pro}</div>
                    </div>
                    <span style={{
                      fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 700,
                      padding: '3px 8px', borderRadius: 999,
                      background: cfg.bg, color: cfg.color, flexShrink: 0,
                    }}>
                      {cfg.label}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#54546C' }}>{b.date}</span>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14, color: '#F2D06B' }}>{b.montant} CHF</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div style={{ height: 16 }} />
      </div>

      <TabBarAdmin current="admin_bookings" go={go} />
    </div>
  );
}
