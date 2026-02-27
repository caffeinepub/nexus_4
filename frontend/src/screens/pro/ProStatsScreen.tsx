import React, { useEffect, useState } from 'react';
import { Screen, GlobalState, ToastType } from '../../state/useAppState';
import TabBarPro from '../../components/TabBarPro';

interface Props {
  go: (screen: Screen) => void;
  state: GlobalState;
  update: (partial: Partial<GlobalState>) => void;
  showToast: (message: string, type?: ToastType) => void;
  removeToast?: (id: string) => void;
}

const REVENUE_DATA = [
  { label: 'Coupe', value: 420, max: 500 },
  { label: 'Barbe', value: 180, max: 500 },
  { label: 'Coupe+Barbe', value: 315, max: 500 },
  { label: 'Rasage', value: 100, max: 500 },
  { label: 'Enfant', value: 80, max: 500 },
  { label: 'Autre', value: 60, max: 500 },
];

const TOP_CLIENTS = [
  { name: 'Thomas M.', bookings: 8 },
  { name: 'Julien R.', bookings: 5 },
  { name: 'Sophie L.', bookings: 4 },
];

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const HOURS = ['8h', '9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h'];

const HEATMAP_DATA = DAYS.map((_, di) =>
  HOURS.map((_, hi) => {
    const base = di < 5 ? 0.3 : 0.5;
    const peak = (hi >= 2 && hi <= 5) || (hi >= 8 && hi <= 10) ? 0.4 : 0;
    return Math.min(1, base + peak + (((di * 12 + hi) * 7919) % 100) / 500);
  })
);

const RATING_TREND = [4.6, 4.7, 4.6, 4.8, 4.7, 4.8, 4.9, 4.8, 4.9, 4.9];

export default function ProStatsScreen({ go }: Props) {
  const [barsVisible, setBarsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBarsVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  const ratingMin = 4.5;
  const ratingMax = 5.0;
  const chartWidth = 260;
  const chartHeight = 60;
  const ratingPoints = RATING_TREND.map((v, i) => ({
    x: (i / (RATING_TREND.length - 1)) * chartWidth,
    y: chartHeight - ((v - ratingMin) / (ratingMax - ratingMin)) * chartHeight,
  }));
  const pathD = ratingPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#050507', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 56, background: 'rgba(5,5,7,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', padding: '0 20px', zIndex: 10 }}>
        <button onClick={() => go('pro_dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="#9898B4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 16, color: '#F4F4F8', marginLeft: 8 }}>Mes statistiques</span>
      </div>

      {/* Scroll zone */}
      <div style={{ flex: 1, overflowY: 'auto', paddingTop: 72, paddingBottom: 80 }}>
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Conversion rate */}
          <div style={{ background: '#0D0D13', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px' }}>
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13, color: '#9898B4', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Taux de conversion</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: 48, color: '#F2D06B', lineHeight: 1 }}>24%</span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 13, color: '#00D97A', marginBottom: 6 }}>+3% ce mois</span>
            </div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 12, color: '#54546C', marginTop: 4 }}>Visiteurs convertis en reservations</div>
          </div>

          {/* Revenue bar chart */}
          <div style={{ background: '#0D0D13', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px' }}>
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14, color: '#F4F4F8', marginBottom: 16 }}>Revenus par service (CHF)</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 120 }}>
              {REVENUE_DATA.map((item, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#9898B4' }}>{item.value}</div>
                  <div style={{ width: '100%', height: 90, display: 'flex', alignItems: 'flex-end' }}>
                    <div
                      style={{
                        width: '100%',
                        height: barsVisible ? `${(item.value / item.max) * 90}px` : '0px',
                        background: 'linear-gradient(180deg, #F2D06B, #D4A050)',
                        borderRadius: '4px 4px 0 0',
                        transition: `height 0.6s ease ${i * 0.1}s`,
                      }}
                    />
                  </div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 9, color: '#54546C', textAlign: 'center', lineHeight: 1.2 }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Heatmap */}
          <div style={{ background: '#0D0D13', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px' }}>
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14, color: '#F4F4F8', marginBottom: 12 }}>Heures de pointe</div>
            <div style={{ overflowX: 'auto' }}>
              <svg width="300" height="130" viewBox="0 0 300 130">
                {DAYS.map((day, di) =>
                  HOURS.map((_, hi) => (
                    <rect
                      key={`${di}-${hi}`}
                      x={di * 40 + 28}
                      y={hi * 9 + 2}
                      width={36}
                      height={7}
                      rx={2}
                      fill={`rgba(242,208,107,${HEATMAP_DATA[di][hi] * 0.6})`}
                    />
                  ))
                )}
                {DAYS.map((day, di) => (
                  <text key={day} x={di * 40 + 46} y={126} textAnchor="middle" fill="#54546C" fontSize="8" fontFamily="Inter, sans-serif">{day}</text>
                ))}
                {HOURS.map((hour, hi) => (
                  <text key={hour} x={2} y={hi * 9 + 8} fill="#54546C" fontSize="7" fontFamily="Inter, sans-serif">{hour}</text>
                ))}
              </svg>
            </div>
          </div>

          {/* Rating trend */}
          <div style={{ background: '#0D0D13', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px' }}>
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14, color: '#F4F4F8', marginBottom: 12 }}>Evolution de la note (30 jours)</div>
            <svg width="100%" height="80" viewBox={`0 0 ${chartWidth} 80`} preserveAspectRatio="none">
              <defs>
                <linearGradient id="ratingGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F2D06B" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#F2D06B" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d={`${pathD} L ${chartWidth} 80 L 0 80 Z`} fill="url(#ratingGrad)"/>
              <path d={pathD} stroke="#F2D06B" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              {ratingPoints.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="3" fill="#F2D06B"/>
              ))}
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#54546C' }}>4.6</span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#F2D06B', fontWeight: 700 }}>4.9 actuel</span>
            </div>
          </div>

          {/* Top clients */}
          <div style={{ background: '#0D0D13', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px' }}>
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14, color: '#F4F4F8', marginBottom: 12 }}>Top clients fideles</div>
            {TOP_CLIENTS.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < TOP_CLIENTS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(242,208,107,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 13, color: '#F2D06B' }}>
                    {i + 1}
                  </div>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 14, color: '#F4F4F8' }}>{c.name}</span>
                </div>
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13, color: '#9898B4' }}>{c.bookings} RDV</span>
              </div>
            ))}
          </div>

          {/* Monthly projection */}
          <div style={{ background: 'linear-gradient(135deg, rgba(242,208,107,0.08), rgba(212,160,80,0.05))', border: '1px solid rgba(242,208,107,0.2)', borderRadius: 16, padding: '20px' }}>
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13, color: '#9898B4', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Projection mensuelle</div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: 40, color: '#F2D06B', lineHeight: 1 }}>340 CHF</div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 12, color: '#9898B4', marginTop: 4 }}>Basee sur votre activite des 7 derniers jours</div>
          </div>

        </div>
      </div>

      <TabBarPro current={'pro_dashboard'} go={go} />
    </div>
  );
}
