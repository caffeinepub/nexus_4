import React, { useEffect, useState } from 'react';
import { GlobalState, Screen, ToastType } from '../../state/useAppState';
import Header from '../../components/Header';
import TabBarPro from '../../components/TabBarPro';

interface Props {
  go: (screen: Screen) => void;
  state: GlobalState;
  update: (partial: Partial<GlobalState>) => void;
  showToast: (msg: string, type?: ToastType, duration?: number) => void;
}

const CHART_DATA = [40, 65, 55, 90, 110, 80, 45];
const CHART_DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const TRANSACTIONS = [
  { id: 't1', label: 'Coupe + Brushing', client: 'Marie L.', amount: 65, type: 'credit', date: '26 fev' },
  { id: 't2', label: 'Coloration', client: 'Sophie R.', amount: 120, type: 'credit', date: '25 fev' },
  { id: 't3', label: 'Virement bancaire', client: '', amount: -200, type: 'debit', date: '24 fev' },
  { id: 't4', label: 'Massage relaxant', client: 'Anna K.', amount: 80, type: 'credit', date: '23 fev' },
  { id: 't5', label: 'Abonnement NEXUS', client: '', amount: -29, type: 'debit', date: '20 fev' },
];

export default function ProWalletScreen({ go, state, update, showToast }: Props) {
  const [barHeights, setBarHeights] = useState(CHART_DATA.map(() => 0));
  const [transferLoading, setTransferLoading] = useState(false);
  const [shimmer, setShimmer] = useState(true);

  const SOLDE = 240;
  const SEQUESTRE = 55;
  const maxBar = Math.max(...CHART_DATA);

  useEffect(() => {
    const t = setTimeout(() => {
      setShimmer(false);
      CHART_DATA.forEach((val, i) => {
        setTimeout(() => {
          setBarHeights(prev => {
            const next = [...prev];
            next[i] = val;
            return next;
          });
        }, i * 80);
      });
    }, 400);
    return () => clearTimeout(t);
  }, []);

  const handleTransfer = () => {
    if (SOLDE < 50) { showToast('Solde minimum 50 CHF pour un virement', 'error'); return; }
    setTransferLoading(true);
    setTimeout(() => {
      setTransferLoading(false);
      showToast('Virement initie — 3 a 5 jours ouvrables', 'success');
    }, 1500);
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
        {/* Balance card */}
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{
            background: shimmer
              ? 'linear-gradient(90deg, #0D0D13 25%, #1C1C26 50%, #0D0D13 75%)'
              : 'linear-gradient(135deg, #0D0D13 0%, #121219 100%)',
            backgroundSize: shimmer ? '200% 100%' : 'auto',
            animation: shimmer ? 'shimmer 1.5s infinite' : 'none',
            border: '1px solid rgba(242,208,107,0.15)',
            borderRadius: 20, padding: '24px', marginBottom: 16,
          }}>
            {!shimmer && (
              <>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#54546C', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                  Solde disponible
                </div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 44, fontWeight: 900, color: '#F2D06B', letterSpacing: '-0.04em', marginBottom: 4 }}>
                  {SOLDE} CHF
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    background: 'rgba(91,127,255,0.1)', border: '1px solid rgba(91,127,255,0.2)',
                    borderRadius: 999, padding: '4px 10px',
                    fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#5B7FFF', fontWeight: 600,
                  }}>
                    {SEQUESTRE} CHF en sequestre
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Transfer button */}
          <button
            onClick={handleTransfer}
            disabled={transferLoading}
            style={{
              width: '100%', height: 52, borderRadius: 14,
              background: transferLoading ? '#1C1C26' : 'linear-gradient(135deg, #F2D06B, #D4A050)',
              border: 'none', color: transferLoading ? '#54546C' : '#050507',
              fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 15, cursor: transferLoading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              marginBottom: 24, transition: 'all 200ms',
            }}
          >
            {transferLoading ? (
              <span style={{
                width: 18, height: 18, borderRadius: '50%',
                border: '2px solid #54546C', borderTopColor: 'transparent',
                animation: 'spin 0.8s linear infinite', display: 'inline-block',
              }} />
            ) : (
              <>
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#050507" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                Virer vers mon compte
              </>
            )}
          </button>
        </div>

        {/* Revenue chart */}
        <div style={{ padding: '0 20px', marginBottom: 24 }}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 15, color: '#F4F4F8', marginBottom: 16 }}>
            Revenus cette semaine
          </div>
          <div style={{
            background: '#0D0D13', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 16, padding: '20px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80 }}>
              {CHART_DATA.map((val, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: '100%', borderRadius: 6,
                    background: barHeights[i] > 0
                      ? `linear-gradient(to top, #F2D06B, #D4A050)`
                      : '#1C1C26',
                    height: `${(barHeights[i] / maxBar) * 64}px`,
                    minHeight: 4,
                    transition: 'height 600ms cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: barHeights[i] > 0 ? 1 : 0.3,
                  }} />
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#54546C' }}>{CHART_DAYS[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div style={{ padding: '0 20px' }}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 15, color: '#F4F4F8', marginBottom: 12 }}>
            Transactions recentes
          </div>
          {TRANSACTIONS.map((tx, i) => (
            <div key={tx.id} style={{
              background: '#0D0D13', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 14, padding: '12px 16px', marginBottom: 8,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                background: tx.type === 'credit' ? 'rgba(0,217,122,0.1)' : 'rgba(255,61,90,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={tx.type === 'credit' ? '#00D97A' : '#FF3D5A'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  {tx.type === 'credit'
                    ? <><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></>
                    : <><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></>
                  }
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13, color: '#F4F4F8', marginBottom: 2 }}>{tx.label}</div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#54546C' }}>
                  {tx.client ? `${tx.client} · ` : ''}{tx.date}
                </div>
              </div>
              <div style={{
                fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14,
                color: tx.type === 'credit' ? '#00D97A' : '#FF3D5A',
                flexShrink: 0,
              }}>
                {tx.type === 'credit' ? '+' : ''}{tx.amount} CHF
              </div>
            </div>
          ))}
        </div>
        <div style={{ height: 16 }} />
      </div>

      <TabBarPro current="pro_wallet" go={go} />
    </div>
  );
}
