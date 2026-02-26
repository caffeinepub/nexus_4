import React, { useState } from 'react';
import TabBarAdmin from '../../components/TabBarAdmin';
import { GlobalState, Screen } from '../../state/useAppState';

interface Props {
  go: (screen: Screen) => void;
  state: GlobalState;
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'var(--gold)', confirmed: 'var(--blue)',
  completed: 'var(--flash)', cancelled: 'var(--t3)', disputed: 'var(--alert)',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'EN ATTENTE', confirmed: 'CONFIRME',
  completed: 'TERMINE', cancelled: 'ANNULE', disputed: 'LITIGE',
};

const MOCK_BOOKINGS = [
  { id: 'b001', client: 'Marc D.', pro: 'Jean B.', service: 'Coupe homme', date: '26.02.2026', heure: '14:30', montant: 35, statut: 'confirmed' },
  { id: 'b002', client: 'Luca M.', pro: 'Sophie L.', service: 'Soin visage', date: '25.02.2026', heure: '10:00', montant: 70, statut: 'completed' },
  { id: 'b003', client: 'Alex R.', pro: 'Marc T.', service: 'Massage relaxant', date: '24.02.2026', heure: '16:00', montant: 80, statut: 'pending' },
  { id: 'b004', client: 'Tom B.', pro: 'Jean B.', service: 'Barbe design', date: '23.02.2026', heure: '11:00', montant: 30, statut: 'cancelled' },
  { id: 'b005', client: 'Sara K.', pro: 'Sophie L.', service: 'Manucure', date: '22.02.2026', heure: '09:30', montant: 40, statut: 'completed' },
  { id: 'b006', client: 'Paul M.', pro: 'Marc T.', service: 'Dos', date: '21.02.2026', heure: '15:00', montant: 60, statut: 'disputed' },
];

const FILTERS = ['Tous', 'En attente', 'Confirmes', 'Termines', 'Annules'];

export default function AdminBookingsScreen({ go, state }: Props) {
  const [filter, setFilter] = useState('Tous');

  const filterMap: Record<string, string> = {
    'Tous': '',
    'En attente': 'pending',
    'Confirmes': 'confirmed',
    'Termines': 'completed',
    'Annules': 'cancelled',
  };

  const filtered = MOCK_BOOKINGS.filter(b => {
    if (filter === 'Tous') return true;
    return b.statut === filterMap[filter];
  });

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: 'var(--void)' }}>
      {/* Header */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', background: 'rgba(5,5,7,0.95)', backdropFilter: 'blur(12px)', zIndex: 100, borderBottom: '1px solid var(--d3)' }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--alert)', letterSpacing: 1 }}>NEXUS ADMIN</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--t2)' }}>Rendez-vous</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingTop: 72, paddingBottom: 16 }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, padding: '16px 20px 0', overflowX: 'auto' }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                flexShrink: 0, padding: '7px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
                background: filter === f ? 'var(--alert)' : 'var(--d2)',
                color: filter === f ? '#fff' : 'var(--t2)',
                fontSize: 12, fontWeight: 600,
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Count */}
        <div style={{ padding: '12px 20px 0', fontSize: 12, color: 'var(--t3)' }}>
          {filtered.length} rendez-vous
        </div>

        {/* List */}
        <div style={{ padding: '12px 20px 0' }}>
          {filtered.map(b => (
            <div key={b.id} style={{ background: 'var(--d2)', borderRadius: 14, padding: '14px', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--t4)', fontFamily: 'monospace' }}>#{b.id}</span>
                    <div style={{ padding: '2px 8px', borderRadius: 8, background: STATUS_COLORS[b.statut] + '22' }}>
                      <span style={{ fontSize: 9, fontWeight: 700, color: STATUS_COLORS[b.statut] }}>{STATUS_LABELS[b.statut]}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>{b.service}</div>
                  <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>{b.client} - {b.pro}</div>
                  <div style={{ fontSize: 11, color: 'var(--t4)', marginTop: 2 }}>{b.date} · {b.heure}</div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gold)', flexShrink: 0, marginLeft: 12 }}>
                  {b.montant} CHF
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ height: 20 }} />
      </div>

      <TabBarAdmin active="bookings" go={go} />
    </div>
  );
}
