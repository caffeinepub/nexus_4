import React, { useEffect, useState, useRef } from 'react';
import Header from '../../components/Header';
import TabBarPro from '../../components/TabBarPro';
import { GlobalState, Screen, ToastType } from '../../state/useAppState';

interface Props {
  go: (screen: Screen) => void;
  state: GlobalState;
  update: (partial: Partial<GlobalState>) => void;
  showToast: (msg: string, type?: ToastType, duration?: number) => void;
}

const BARS_DATA = [42, 78, 55, 90, 63, 110, 85];
const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const TRANSACTIONS = [
  { id: 't1', label: 'Coupe homme - Marc D.', montant: 35, type: 'booking', date: '26.02' },
  { id: 't2', label: 'Degrade premium - Luca M.', montant: 45, type: 'booking', date: '25.02' },
  { id: 't3', label: 'Abonnement NEXUS Pro', montant: -19.90, type: 'subscription', date: '01.02' },
  { id: 't4', label: 'Virement bancaire', montant: -200, type: 'virement', date: '15.01' },
  { id: 't5', label: 'Coupe + Barbe - Alex R.', montant: 55, type: 'booking', date: '24.01' },
];

function typeColor(type: string) {
  if (type === 'booking') return 'var(--flash)';
  if (type === 'subscription') return 'var(--gold)';
  if (type === 'virement') return 'var(--blue)';
  if (type === 'refund') return 'var(--alert)';
  return 'var(--t3)';
}

export default function ProWalletScreen({ go, state, update, showToast }: Props) {
  const [barHeights, setBarHeights] = useState(BARS_DATA.map(() => 0));
  const [cooldown, setCooldown] = useState(0);
  const [solde] = useState(320.50);
  const [sequestre] = useState(135.00);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setBarHeights(BARS_DATA), 200);
    return () => clearTimeout(t);
  }, []);

  const handleVirement = () => {
    if (cooldown > 0) return;
    showToast('Virement initie · Delai 48h', 'success');
    setCooldown(30);
    cooldownRef.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => () => { if (cooldownRef.current) clearInterval(cooldownRef.current); }, []);

  const maxBar = Math.max(...BARS_DATA);

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: 'var(--void)' }}>
      <Header role="pro" onSwitchRole={() => go('role')} notifsCount={0} onNotifs={() => update({ notifsOpen: true })} />

      <div style={{ flex: 1, overflowY: 'auto', paddingTop: 72, paddingBottom: 16 }}>
        {/* Balance card */}
        <div style={{ margin: '20px 20px 0', borderRadius: 20, padding: '24px 20px', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', position: 'relative', overflow: 'visible' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 20, background: 'linear-gradient(90deg, transparent 0%, rgba(242,208,107,0.08) 50%, transparent 100%)', animation: 'shimmer 2.5s ease-in-out infinite' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, textTransform: 'uppercase' }}>Solde disponible</div>
            <div style={{ fontSize: 52, fontWeight: 900, color: '#fff', fontFamily: 'Inter, sans-serif', lineHeight: 1.1, marginTop: 6 }}>
              {solde.toFixed(2)}
              <span style={{ fontSize: 20, fontWeight: 400, marginLeft: 6 }}>CHF</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Sequestre: {sequestre.toFixed(2)} CHF · Liberation 48h apres prestation</span>
            </div>
          </div>
        </div>

        {/* Transfer button */}
        <div style={{ padding: '14px 20px 0' }}>
          <button
            onClick={handleVirement}
            style={{
              width: '100%', padding: '14px', borderRadius: 14, border: 'none', cursor: cooldown > 0 ? 'not-allowed' : 'pointer',
              background: cooldown > 0 ? 'var(--d4)' : 'linear-gradient(135deg, var(--gold), var(--gold2))',
              color: cooldown > 0 ? 'var(--t3)' : '#050507',
              fontSize: 14, fontWeight: 700,
            }}
          >
            {cooldown > 0 ? `Virement disponible dans ${cooldown}s` : 'Demander un virement'}
          </button>
        </div>

        {/* Revenue bars */}
        <div style={{ margin: '20px 20px 0', background: 'var(--d2)', borderRadius: 16, padding: '16px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--t3)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 16 }}>Revenus 7 derniers jours</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80 }}>
            {BARS_DATA.map((val, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: '100%', borderRadius: 4,
                  background: 'linear-gradient(180deg, var(--gold), var(--gold2))',
                  height: `${(barHeights[i] / maxBar) * 64}px`,
                  transition: 'height 0.8s cubic-bezier(0.34,1.56,0.64,1)',
                  minHeight: 2,
                }} />
                <div style={{ fontSize: 9, color: 'var(--t4)' }}>{DAYS[i]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions */}
        <div style={{ margin: '16px 20px 0' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--t3)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 12 }}>Transactions</div>
          {TRANSACTIONS.map(tx => (
            <div key={tx.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--d3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: typeColor(tx.type), flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, color: 'var(--t1)', fontWeight: 500 }}>{tx.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--t4)', marginTop: 1 }}>{tx.date}</div>
                </div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: tx.montant > 0 ? 'var(--flash)' : 'var(--alert)', flexShrink: 0 }}>
                {tx.montant > 0 ? '+' : ''}{tx.montant.toFixed(2)} CHF
              </div>
            </div>
          ))}
        </div>
        <div style={{ height: 20 }} />
      </div>

      <TabBarPro active="wallet" go={go} />
    </div>
  );
}
