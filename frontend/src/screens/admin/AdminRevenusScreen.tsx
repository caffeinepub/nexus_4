import React, { useEffect, useState } from 'react';
import TabBarAdmin from '../../components/TabBarAdmin';
import { GlobalState, Screen } from '../../state/useAppState';

interface Props {
  go: (screen: Screen) => void;
  state: GlobalState;
}

const MONTHLY_DATA = [
  { month: 'Aou', amount: 1200 },
  { month: 'Sep', amount: 1850 },
  { month: 'Oct', amount: 2100 },
  { month: 'Nov', amount: 1750 },
  { month: 'Dec', amount: 2800 },
  { month: 'Jan', amount: 3200 },
  { month: 'Fev', amount: 2650 },
];

const TRANSACTIONS = [
  { id: 'tx1', pro: 'Sophie Laurent', type: 'Commission', amount: 9.75, date: '26 fev' },
  { id: 'tx2', pro: 'Amina Benali', type: 'Abonnement', amount: 29.00, date: '25 fev' },
  { id: 'tx3', pro: 'Chloe Martin', type: 'Commission', amount: 11.25, date: '24 fev' },
  { id: 'tx4', pro: 'Fatima Ouali', type: 'Commission', amount: 13.50, date: '23 fev' },
  { id: 'tx5', pro: 'Isabelle Dupont', type: 'Abonnement', amount: 29.00, date: '22 fev' },
];

export default function AdminRevenusScreen({ go, state }: Props) {
  const [barHeights, setBarHeights] = useState(MONTHLY_DATA.map(() => 0));
  const maxAmount = Math.max(...MONTHLY_DATA.map(d => d.amount));

  useEffect(() => {
    MONTHLY_DATA.forEach((_, i) => {
      setTimeout(() => {
        setBarHeights(prev => {
          const next = [...prev];
          next[i] = MONTHLY_DATA[i].amount;
          return next;
        });
      }, i * 100);
    });
  }, []);

  const totalRevenu = TRANSACTIONS.reduce((sum, t) => sum + t.amount, 0);

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
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 600, color: '#9898B4' }}>Revenus</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any, overscrollBehavior: 'contain', paddingTop: 72, paddingBottom: 16 }}>
        {/* Total card */}
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{
            background: '#0D0D13', border: '1px solid rgba(242,208,107,0.15)',
            borderRadius: 20, padding: '24px', marginBottom: 20,
          }}>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#54546C', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
              Commissions ce mois
            </div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 40, fontWeight: 900, color: '#F2D06B', letterSpacing: '-0.04em', marginBottom: 4 }}>
              156.00 CHF
            </div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#9898B4' }}>
              +24 transactions · Taux moyen 15%
            </div>
          </div>
        </div>

        {/* Monthly chart */}
        <div style={{ padding: '0 20px', marginBottom: 24 }}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 15, color: '#F4F4F8', marginBottom: 16 }}>
            Revenus mensuels
          </div>
          <div style={{
            background: '#0D0D13', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 16, padding: '20px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 100 }}>
              {MONTHLY_DATA.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: '100%', borderRadius: 6,
                    background: i === MONTHLY_DATA.length - 1
                      ? 'linear-gradient(to top, #FF3D5A, #FF6B7A)'
                      : 'linear-gradient(to top, #F2D06B, #D4A050)',
                    height: `${(barHeights[i] / maxAmount) * 80}px`,
                    minHeight: 4,
                    transition: 'height 600ms cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: barHeights[i] > 0 ? 1 : 0.3,
                  }} />
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#54546C' }}>{d.month}</span>
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
          {TRANSACTIONS.map(tx => (
            <div key={tx.id} style={{
              background: '#0D0D13', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 14, padding: '12px 16px', marginBottom: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600, color: '#F4F4F8', marginBottom: 2 }}>{tx.pro}</div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#54546C' }}>{tx.type} · {tx.date}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14, color: '#F2D06B' }}>+{tx.amount.toFixed(2)} CHF</div>
                <span style={{
                  fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 600,
                  padding: '2px 7px', borderRadius: 999,
                  background: tx.type === 'Commission' ? 'rgba(91,127,255,0.1)' : 'rgba(242,208,107,0.1)',
                  color: tx.type === 'Commission' ? '#5B7FFF' : '#F2D06B',
                }}>
                  {tx.type}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ height: 16 }} />
      </div>

      <TabBarAdmin current="admin_revenus" go={go} />
    </div>
  );
}
