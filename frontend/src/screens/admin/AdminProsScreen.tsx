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

const DEMO_PROS: Pro[] = [
  { id: { toString: () => 'd1' } as any, name: 'Sophie Laurent', categorie: 'coiffure' as any, bio: '', adresse: '', ville: 'Geneve', phone: '', email: '', modeTravail: 'domicile' as any, services: [], photos: [], rating: 4.9, reviewCount: BigInt(127), actif: true, subscriptionActive: true, subscriptionExpiry: BigInt(0), createdAt: BigInt(0) },
  { id: { toString: () => 'd2' } as any, name: 'Amina Benali', categorie: 'esthetique' as any, bio: '', adresse: '', ville: 'Lausanne', phone: '', email: '', modeTravail: 'both' as any, services: [], photos: [], rating: 4.8, reviewCount: BigInt(89), actif: true, subscriptionActive: false, subscriptionExpiry: BigInt(0), createdAt: BigInt(0) },
  { id: { toString: () => 'd3' } as any, name: 'Chloe Martin', categorie: 'onglerie' as any, bio: '', adresse: '', ville: 'Zurich', phone: '', email: '', modeTravail: 'domicile' as any, services: [], photos: [], rating: 4.9, reviewCount: BigInt(203), actif: false, subscriptionActive: false, subscriptionExpiry: BigInt(0), createdAt: BigInt(0) },
];

export default function AdminProsScreen({ go, state }: Props) {
  const { actor } = useActor();
  const [pros, setPros] = useState<Pro[]>(DEMO_PROS);
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

  const statusColor = (p: Pro) => p.actif && p.subscriptionActive ? '#00D97A' : p.actif ? '#F2D06B' : '#FF3D5A';
  const statusLabel = (p: Pro) => p.actif && p.subscriptionActive ? 'ACTIF' : p.actif ? 'EN ATTENTE' : 'REFUSE';

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
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 600, color: '#9898B4' }}>Professionnels</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any, overscrollBehavior: 'contain', paddingTop: 72, paddingBottom: 16 }}>
        {/* Status filters */}
        <div style={{ display: 'flex', gap: 8, padding: '16px 20px 0', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {STATUS_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                flexShrink: 0, padding: '7px 14px', borderRadius: 999,
                background: filter === f ? 'rgba(255,61,90,0.12)' : '#0D0D13',
                border: filter === f ? '1px solid rgba(255,61,90,0.3)' : '1px solid rgba(255,255,255,0.06)',
                color: filter === f ? '#FF3D5A' : '#9898B4',
                fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Ville filter */}
        <div style={{ padding: '12px 20px 16px' }}>
          <select
            value={villeFilter}
            onChange={e => setVilleFilter(e.target.value)}
            style={{
              height: 40, background: '#0D0D13', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 10, padding: '0 12px', fontFamily: 'Inter, sans-serif',
              fontSize: 13, color: '#9898B4', cursor: 'pointer', outline: 'none',
            }}
          >
            {villes.map(v => <option key={v} value={v} style={{ background: '#0D0D13' }}>{v}</option>)}
          </select>
        </div>

        {/* Pros list */}
        <div style={{ padding: '0 20px' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: 'Inter, sans-serif', color: '#54546C', fontSize: 14 }}>
              Aucun professionnel trouve
            </div>
          ) : (
            filtered.map(pro => (
              <div key={pro.id.toString()} style={{
                background: '#0D0D13', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 14, padding: '14px 16px', marginBottom: 10,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(255,61,90,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 700, color: '#FF3D5A',
                  }}>
                    {pro.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 700, color: '#F4F4F8', marginBottom: 2 }}>{pro.name}</div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#54546C' }}>{pro.ville} · {String(pro.categorie)}</div>
                  </div>
                  <span style={{
                    fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 700,
                    padding: '3px 8px', borderRadius: 999,
                    background: statusColor(pro) + '22', color: statusColor(pro),
                  }}>
                    {statusLabel(pro)}
                  </span>
                </div>
                {!pro.subscriptionActive && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button
                      onClick={() => handleValidate(pro.id.toString())}
                      style={{ flex: 1, height: 36, borderRadius: 10, border: 'none', background: '#00D97A', color: '#050507', fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                    >
                      Valider
                    </button>
                    <button
                      onClick={() => handleRefuse(pro.id.toString())}
                      style={{ flex: 1, height: 36, borderRadius: 10, border: 'none', background: '#FF3D5A', color: '#fff', fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                    >
                      Refuser
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        <div style={{ height: 16 }} />
      </div>

      <TabBarAdmin current="admin_pros" go={go} />
    </div>
  );
}
