import React, { useEffect, useState } from 'react';
import TabBarAdmin from '../../components/TabBarAdmin';
import { GlobalState, Screen } from '../../state/useAppState';
import { useActor } from '../../hooks/useActor';
import { Pro } from '../../backend';

interface Props {
  go: (screen: Screen) => void;
  state: GlobalState;
}

const STATUS_FILTERS = ['Tous', 'Actifs', 'En attente'];

export default function AdminProsScreen({ go, state }: Props) {
  const { actor } = useActor();
  const [pros, setPros] = useState<Pro[]>([]);
  const [filter, setFilter] = useState('Tous');
  const [villeFilter, setVilleFilter] = useState('Toutes');

  useEffect(() => {
    if (!actor) return;
    actor.listPros().then(p => { if (p.length > 0) setPros(p); }).catch(() => {});
  }, [actor]);

  const handleValidate = (id: string) => {
    setPros(prev => prev.map(p => p.id.toString() === id ? { ...p, actif: true, subscriptionActive: true } : p));
  };

  const handleRefuse = (id: string) => {
    setPros(prev => prev.filter(p => p.id.toString() !== id));
  };

  const villes = ['Toutes', ...Array.from(new Set(pros.map(p => p.ville).filter(Boolean)))];

  const filtered = pros.filter(p => {
    const statusOk = filter === 'Tous' || (filter === 'Actifs' && p.actif) || (filter === 'En attente' && !p.subscriptionActive);
    const villeOk = villeFilter === 'Toutes' || p.ville === villeFilter;
    return statusOk && villeOk;
  });

  const statusColor = (p: Pro) => p.actif && p.subscriptionActive ? 'var(--flash)' : p.actif ? 'var(--gold)' : 'var(--alert)';
  const statusLabel = (p: Pro) => p.actif && p.subscriptionActive ? 'ACTIF' : p.actif ? 'EN ATTENTE' : 'REFUSE';

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: 'var(--void)' }}>
      {/* Header */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', background: 'rgba(5,5,7,0.95)', backdropFilter: 'blur(12px)', zIndex: 100, borderBottom: '1px solid var(--d3)' }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--alert)', letterSpacing: 1 }}>NEXUS ADMIN</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--t2)' }}>Professionnels</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingTop: 72, paddingBottom: 16 }}>
        {/* Status filters */}
        <div style={{ display: 'flex', gap: 8, padding: '16px 20px 0', overflowX: 'auto' }}>
          {STATUS_FILTERS.map(f => (
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
          {villes.map(v => (
            <button
              key={v}
              onClick={() => setVilleFilter(v)}
              style={{
                flexShrink: 0, padding: '7px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
                background: villeFilter === v ? 'var(--d4)' : 'var(--d2)',
                color: villeFilter === v ? 'var(--t1)' : 'var(--t3)',
                fontSize: 12, fontWeight: 600,
              }}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Count */}
        <div style={{ padding: '12px 20px 0', fontSize: 12, color: 'var(--t3)' }}>
          {filtered.length} professionnel{filtered.length !== 1 ? 's' : ''}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: 'var(--t3)' }}>Aucun professionnel</div>
          </div>
        )}

        {/* List */}
        <div style={{ padding: '12px 20px 0' }}>
          {filtered.map(pro => (
            <div key={pro.id.toString()} style={{ background: 'var(--d2)', borderRadius: 14, padding: '14px', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Avatar */}
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--t2)' }}>{pro.name.charAt(0)}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>{pro.name}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, color: statusColor(pro), background: statusColor(pro) + '22', borderRadius: 6, padding: '2px 6px' }}>{statusLabel(pro)}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>{pro.categorie} · {pro.ville}</div>
                  <div style={{ fontSize: 11, color: 'var(--t4)', marginTop: 1 }}>Note: {pro.rating.toFixed(1)} · {pro.reviewCount.toString()} avis</div>
                </div>
              </div>
              {!pro.subscriptionActive && (
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button onClick={() => handleValidate(pro.id.toString())} style={{ flex: 1, padding: '8px', borderRadius: 10, border: 'none', background: 'var(--flash)', color: '#050507', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Valider</button>
                  <button onClick={() => handleRefuse(pro.id.toString())} style={{ flex: 1, padding: '8px', borderRadius: 10, border: 'none', background: 'var(--alert)', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Refuser</button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ height: 20 }} />
      </div>

      <TabBarAdmin active="pros" go={go} />
    </div>
  );
}
