import React from 'react';
import { Screen } from '../state/useAppState';

interface TabBarClientProps {
  current: Screen;
  go: (screen: Screen) => void;
  notifsCount?: number;
}

const tabs = [
  {
    screen: 'explorer' as Screen,
    label: 'Explorer',
    icon: (active: boolean) => (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={active ? '#F2D06B' : '#2E2E3E'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
    ),
  },
  {
    screen: 'client_reservations' as Screen,
    label: 'Reservations',
    icon: (active: boolean) => (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={active ? '#F2D06B' : '#2E2E3E'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    screen: 'client_alertes' as Screen,
    label: 'Alertes',
    icon: (active: boolean) => (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={active ? '#F2D06B' : '#2E2E3E'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  {
    screen: 'client_profil' as Screen,
    label: 'Profil',
    icon: (active: boolean) => (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={active ? '#F2D06B' : '#2E2E3E'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function TabBarClient({ current, go, notifsCount = 0 }: TabBarClientProps) {
  return (
    <nav
      aria-label="Navigation client"
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
            <div style={{ position: 'relative', transform: active ? 'scale(1.1)' : 'scale(1)', transition: 'transform 150ms' }}>
              {tab.icon(active)}
              {tab.screen === 'client_alertes' && notifsCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  minWidth: 16,
                  height: 16,
                  borderRadius: 999,
                  background: '#FF3D5A',
                  border: '2px solid #050507',
                  fontSize: 9,
                  fontWeight: 700,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 3px',
                }}>
                  {notifsCount > 9 ? '9+' : notifsCount}
                </span>
              )}
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
