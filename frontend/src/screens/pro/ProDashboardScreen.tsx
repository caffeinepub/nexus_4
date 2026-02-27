import React, { useState, useEffect } from 'react';
import { GlobalState, Screen, ToastType } from '../../state/useAppState';
import Header from '../../components/Header';
import TabBarPro from '../../components/TabBarPro';

interface Props {
  go: (screen: Screen) => void;
  state: GlobalState;
  update: (partial: Partial<GlobalState>) => void;
  showToast: (msg: string, type?: ToastType, duration?: number) => void;
  removeToast?: (id: string) => void;
}

function useCountUp(target: number, duration = 1500) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) return;
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

const METRICS = [
  { label: 'RDV ce mois', value: 24, suffix: '', color: '#5B7FFF' },
  { label: 'Revenus', value: 1840, suffix: ' CHF', color: '#F2D06B' },
  { label: 'Note moy.', value: 49, suffix: '', color: '#00D97A', display: (v: number) => (v / 10).toFixed(1) },
];

export default function ProDashboardScreen({ go, state, update, showToast }: Props) {
  const [flashMode, setFlashMode] = useState(state.proData?.flashMode || false);
  const m0 = useCountUp(METRICS[0].value);
  const m1 = useCountUp(METRICS[1].value);
  const m2 = useCountUp(METRICS[2].value);
  const metricValues = [m0, m1, m2];

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const prenom = state.userName ? state.userName.split(' ')[0] : 'Pro';
  const notifsUnread = state.notifications?.filter(n => !n.read).length || 0;

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: '#050507' }}>
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
      <Header
        role="pro"
        onSwitchRole={() => { update({ role: 'client' }); go('explorer'); }}
        notifsCount={notifsUnread}
        onNotifs={() => update({ notifsOpen: true })}
        onLogoClick={() => go('pro_dashboard')}
      />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any, overscrollBehavior: 'contain', paddingTop: 72, paddingBottom: 16 }}>
        {/* Greeting */}
        <div style={{ padding: '20px 20px 0', marginBottom: 12 }}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 26, color: '#F4F4F8', lineHeight: 1.2 }}>
            Bonjour, {prenom}
          </div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#54546C', fontWeight: 400, marginTop: 4, textTransform: 'capitalize' }}>
            {today}
          </div>
          {/* Share my profile pill */}
          <button
            onClick={() => go('pro_share')}
            style={{
              marginTop: 12,
              background: 'rgba(242,208,107,0.08)',
              border: '1px solid rgba(242,208,107,0.2)',
              borderRadius: 999,
              padding: '8px 16px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13, color: '#F2D06B' }}>Partager mon profil</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="#F2D06B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Flash toggle */}
        <div style={{
          margin: '0 20px 16px',
          background: flashMode ? 'rgba(0,217,122,0.06)' : '#0D0D13',
          border: flashMode ? '1px solid rgba(0,217,122,0.3)' : '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16, padding: '16px',
          transition: 'border-color 300ms, background 300ms',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <svg width={18} height={18} viewBox="0 0 24 24" fill={flashMode ? '#00D97A' : '#9898B4'} stroke="none">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 15, color: flashMode ? '#00D97A' : '#F4F4F8' }}>
                  Mode Flash
                </span>
                {flashMode && (
                  <span style={{
                    background: 'rgba(0,217,122,0.12)', color: '#00D97A',
                    fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 700,
                    padding: '2px 7px', borderRadius: 999,
                    animation: 'breathe 2s ease-in-out infinite',
                  }}>ACTIF</span>
                )}
              </div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#54546C' }}>
                {flashMode ? 'Vous etes visible pour les clients proches' : 'Activez pour recevoir des demandes immediates'}
              </div>
            </div>
            <button
              onClick={() => {
                const next = !flashMode;
                setFlashMode(next);
                update({ proData: { ...state.proData, flashMode: next } });
                showToast(next ? 'Mode Flash active' : 'Mode Flash desactive', 'success');
              }}
              style={{
                width: 52, height: 28, borderRadius: 999,
                background: flashMode ? '#00D97A' : '#1C1C26',
                border: '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer', position: 'relative',
                transition: 'background 300ms', flexShrink: 0,
              }}
            >
              <div style={{
                position: 'absolute', top: 3,
                left: flashMode ? 26 : 3,
                width: 20, height: 20, borderRadius: '50%',
                background: flashMode ? '#050507' : '#9898B4',
                transition: 'left 300ms',
              }} />
            </button>
          </div>
        </div>

        {/* Stats label */}
        <div style={{ padding: '0 20px', fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#54546C', marginBottom: 10 }}>
          Statistiques rapides
        </div>

        {/* Metric cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, padding: '0 20px', marginBottom: 12 }}>
          {METRICS.map((m, i) => (
            <div key={i} style={{
              background: '#0D0D13', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 14, padding: '14px 12px', textAlign: 'center',
            }}>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 22, fontWeight: 800, color: m.color }}>
                {m.display ? m.display(metricValues[i]) : metricValues[i]}{m.suffix}
              </div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#54546C', marginTop: 4 }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Why NEXUS Pro link */}
        <div style={{ padding: '0 20px', marginBottom: 16 }}>
          <button
            onClick={() => go('pro_pitch')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0' }}
          >
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 13, color: '#F2D06B' }}>
              Pourquoi NEXUS Pro — decouvrir toutes les fonctionnalites
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="#F2D06B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Boost my visibility */}
        <div style={{ margin: '0 20px 16px', background: '#0D0D13', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ borderLeft: '3px solid #F2D06B', padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14, color: '#F4F4F8' }}>Booster ma visibilite</div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 12, color: '#9898B4', marginTop: 2 }}>Apparaissez en tete des resultats</div>
          </div>
          {/* Standard */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13, color: '#F4F4F8' }}>Standard</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 11, color: '#9898B4' }}>Inclus dans votre abonnement</div>
            </div>
            <div style={{ background: 'rgba(0,217,122,0.1)', border: '1px solid rgba(0,217,122,0.3)', borderRadius: 999, padding: '4px 10px', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 11, color: '#00D97A' }}>
              Actif
            </div>
          </div>
          {/* Premium */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13, color: '#F4F4F8' }}>Premium</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 11, color: '#9898B4' }}>En tete de liste 1 semaine · +5 CHF/sem</div>
            </div>
            <button
              onClick={() => showToast('Boost Premium active via TWINT — bientot disponible', 'info')}
              style={{ background: 'rgba(242,208,107,0.1)', border: '1px solid rgba(242,208,107,0.3)', borderRadius: 999, padding: '4px 12px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 11, color: '#F2D06B' }}
            >
              Activer
            </button>
          </div>
          {/* Flash 24h */}
          <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13, color: '#F4F4F8' }}>Flash 24h</span>
                <div style={{ background: 'linear-gradient(135deg, #F2D06B, #D4A050)', borderRadius: 999, padding: '2px 7px', animation: 'breathe 2s ease-in-out infinite' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 9, color: '#050507' }}>BOOST</span>
                </div>
              </div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 11, color: '#9898B4' }}>Badge BOOST dans l'Explorer · +2 CHF/jour</div>
            </div>
            <button
              onClick={() => showToast('Boost Flash 24h active via TWINT — bientot disponible', 'info')}
              style={{ background: 'rgba(242,208,107,0.1)', border: '1px solid rgba(242,208,107,0.3)', borderRadius: 999, padding: '4px 12px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 11, color: '#F2D06B' }}
            >
              Activer
            </button>
          </div>
        </div>

        {/* Next appointment */}
        <div style={{ margin: '0 20px 16px' }}>
          <div style={{ background: '#0D0D13', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#F2D06B" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14, color: '#F4F4F8' }}>Prochain RDV</span>
              </div>
              <button
                onClick={() => go('pro_stats')}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 500, color: '#F2D06B',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                Voir mes stats
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#F2D06B" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
            <div style={{
              background: '#1C1C26', borderRadius: 12, padding: '12px 14px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'rgba(242,208,107,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#F2D06B" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14, color: '#F4F4F8', marginBottom: 2 }}>Coupe + Brushing</div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#54546C' }}>Demain · 14h00 · Marie L.</div>
              </div>
            </div>
          </div>
        </div>

        {/* My Network row */}
        <div style={{ margin: '0 20px 16px' }}>
          <button
            onClick={() => go('pro_network')}
            style={{
              width: '100%', background: '#0D0D13', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16, padding: '0 16px', height: 64,
              display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="2" stroke="#5B7FFF" strokeWidth="2"/>
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="#5B7FFF" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 13, color: '#F4F4F8' }}>Mon Reseau — invitez des collegues et gagnez des recompenses</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 11, color: '#9898B4' }}>3 pros dans votre reseau</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="#54546C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Rating card */}
        <div style={{ margin: '0 20px' }}>
          <div style={{ background: '#0D0D13', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="#F2D06B" stroke="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14, color: '#F4F4F8' }}>Votre reputation</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 36, fontWeight: 900, color: '#F2D06B' }}>4.9</div>
              <div>
                <div style={{ display: 'flex', gap: 3, marginBottom: 4 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width={16} height={16} viewBox="0 0 24 24" fill="#F2D06B" stroke="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#54546C' }}>Base sur 127 avis</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ height: 20 }} />
      </div>

      <TabBarPro current="pro_dashboard" go={go} />
    </div>
  );
}
