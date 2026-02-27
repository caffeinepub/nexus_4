import React from 'react';
import { Screen } from '../state/useAppState';

interface TabBarProProps {
  current: Screen;
  go: (screen: Screen) => void;
}

const tabs = [
  {
    screen: 'pro_radar' as Screen,
    label: 'Radar',
    icon: (active: boolean) => (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={active ? '#F2D06B' : '#2E2E3E'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M19.07 4.93A10 10 0 0 0 6.99 3.34" /><path d="M4 6h.01" /><path d="M2.29 9.62A10 10 0 1 0 21.31 8.35" /><path d="M16.24 7.76A6 6 0 1 0 8.23 16.67" /><circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  {
    screen: 'pro_wallet' as Screen,
    label: 'Wallet',
    icon: (active: boolean) => (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={active ? '#F2D06B' : '#2E2E3E'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
      </svg>
    ),
  },
  {
    screen: 'pro_dashboard' as Screen,
    label: 'Accueil',
    icon: (active: boolean) => (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={active ? '#F2D06B' : '#2E2E3E'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    screen: 'pro_business' as Screen,
    label: 'Business',
    icon: (active: boolean) => (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={active ? '#F2D06B' : '#2E2E3E'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
];

export default function TabBarPro({ current, go }: TabBarProProps) {
  return (
    <nav
      aria-label="Navigation pro"
      style={{
        flexShrink: 0,
        background: 'rgba(5,5,7,0.97)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'stretch',
        paddingBottom: 'env(safe-area-inset-bottom, 8px)',
      }}
      className="tab-bar-mobile"
    >
      {tabs.map(tab => {
        const active = current === tab.screen;
        return (
          <button
            key={tab.screen}
            aria-label={tab.label}
            onClick={() => go(tab.screen)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              padding: '10px 0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              transition: 'transform 100ms',
            }}
            onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.9)'; }}
            onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
            onTouchStart={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.9)'; }}
            onTouchEnd={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
          >
            {active && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 24,
                height: 2,
                borderRadius: 999,
                background: '#F2D06B',
                animation: 'scaleIn 200ms ease-out',
              }} />
            )}
            <div style={{ transform: active ? 'scale(1.1)' : 'scale(1)', transition: 'transform 150ms' }}>
              {tab.icon(active)}
            </div>
            <span style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: active ? 600 : 400,
              fontSize: 10,
              color: active ? '#F2D06B' : '#2E2E3E',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}>
              {tab.label}
            </span>
          </button>
        );
      })}
      <style>{`
        @media (min-width: 900px) {
          .tab-bar-mobile { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
