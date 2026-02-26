import React, { useEffect, useState } from 'react';
import TabBarAdmin from '../../components/TabBarAdmin';
import { GlobalState, Screen } from '../../state/useAppState';

interface Props {
  go: (screen: Screen) => void;
  state: GlobalState;
}

const MONTHS = ['Aou', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Fev'];
const MONTH_DATA = [320, 480, 390, 620, 540, 710, 723];

const TRANSACTIONS = [
  { id: 'tx1', date: '26.02', type: 'Commission', pro: 'Jean B.', montant: 5.25 },
  { id: 'tx2', date: '25.02', type: 'Abonnement', pro: 'Sophie L.', montant: 19.90 },
  { id: 'tx3', date: '24.02', type: 'Commission', pro: 'Marc T.', montant: 12.00 },
  { id: 'tx4', date: '23.02', type: 'Abonnement', pro: 'Jean B.', montant: 19.90 },
  { id: 'tx5', date: '22.02', type: 'Commission', pro: 'Sophie L.', montant: 6.00 },
  { id: 'tx6', date: '21.02', type: 'Commission', pro: 'Marc T.', montant: 9.00 },
];

export default function AdminRevenusScreen({ go, state }: Props) {
  const [barHeights, setBarHeights] = useState(MONTH_DATA.map(() => 0));

  useEffect(() => {
    const t = setTimeout(() => setBarHeights(MONTH_DATA), 200);
    return () => clearTimeout(t);
  }, []);

  const maxBar = Math.max(...MONTH_DATA);
  const total = MONTH_DATA[MONTH_DATA.length - 1];

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: 'var(--void)' }}>
      {/* Header */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', background: 'rgba(5,5,7,0.95)', backdropFilter: 'blur(12px)', zIndex: 100, borderBottom: '1px solid var(--d3)' }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--alert)', letterSpacing: 1 }}>NEXUS ADMIN</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--t2)' }}>Revenus</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingTop: 72, paddingBottom: 16 }}>
        {/* Total card */}
        <div style={{ margin: '20px 20px 0', background: 'var(--d2)', borderRadius: 16, padding: '20px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--t3)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 }}>Total commissions NEXUS</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--gold)', fontFamily: 'Inter, sans-serif' }}>{total.toFixed(2)} CHF</div>
          <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 4 }}>Fevrier 2026</div>
        </div>

        {/* Bar chart */}
        <div style={{ margin: '16px 20px 0', background: 'var(--d2)', borderRadius: 16, padding: '16px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--t3)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 16 }}>Revenus par mois</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 100 }}>
            {MONTH_DATA.map((val, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ fontSize: 9, color: 'var(--t4)', fontWeight: 600 }}>{val}</div>
                <div style={{
                  width: '100%', borderRadius: 4,
                  background: i === MONTH_DATA.length - 1
                    ? 'linear-gradient(180deg, var(--gold), var(--gold2))'
                    : 'var(--d4)',
                  height: `${(barHeights[i] / maxBar) * 72}px`,
                  transition: 'height 0.8s cubic-bezier(0.34,1.56,0.64,1)',
                  minHeight: 2,
                }} />
                <div style={{ fontSize: 9, color: 'var(--t4)' }}>{MONTHS[i]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions */}
        <div style={{ margin: '16px 20px 0' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--t3)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 12 }}>Transactions NEXUS</div>
          {TRANSACTIONS.map(tx => (
            <div key={tx.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--d3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: tx.type === 'Abonnement' ? 'var(--gold)' : 'var(--flash)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, color: 'var(--t1)', fontWeight: 500 }}>{tx.type} · {tx.pro}</div>
                  <div style={{ fontSize: 11, color: 'var(--t4)', marginTop: 1 }}>{tx.date}</div>
                </div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gold)', flexShrink: 0 }}>
                +{tx.montant.toFixed(2)} CHF
              </div>
            </div>
          ))}
        </div>
        <div style={{ height: 20 }} />
      </div>

      <TabBarAdmin active="revenus" go={go} />
    </div>
  );
}
