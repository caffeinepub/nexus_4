import React from 'react';

interface HeaderProps {
  role?: 'client' | 'pro' | 'admin';
  title?: string;
  onBack?: () => void;
  onSwitchRole?: () => void;
  notifsCount?: number;
  onNotifs?: () => void;
}

export default function Header({ role, title, onBack, onSwitchRole, notifsCount = 0, onNotifs }: HeaderProps) {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 56,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      background: 'rgba(5,5,7,0.92)',
      backdropFilter: 'blur(20px)',
      zIndex: 100,
      borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 80 }}>
        {onBack ? (
          <button
            onClick={onBack}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t2)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, padding: 0 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Retour
          </button>
        ) : (
          <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: 20, letterSpacing: '-1.5px', color: 'var(--t1)', display: 'inline-flex', alignItems: 'baseline' }}>
            NEXUS<span style={{ color: 'var(--blue)' }}>.</span>
          </div>
        )}
      </div>

      {/* Center title */}
      {title && (
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: 15, fontWeight: 700, color: 'var(--t1)' }}>
          {title}
        </div>
      )}

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 80, justifyContent: 'flex-end' }}>
        {onSwitchRole && (
          <button
            onClick={onSwitchRole}
            style={{
              background: 'var(--d3)', border: '1px solid var(--d4)', borderRadius: 20,
              color: 'var(--t3)', fontSize: 11, fontWeight: 600, padding: '5px 10px', cursor: 'pointer',
            }}
          >
            {role === 'pro' ? 'Client' : 'Pro'}
          </button>
        )}
        {onNotifs && (
          <button
            onClick={onNotifs}
            style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: 4, color: 'var(--t2)' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {notifsCount > 0 && (
              <div style={{
                position: 'absolute', top: 0, right: 0, width: 16, height: 16, borderRadius: '50%',
                background: 'var(--alert)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 9, fontWeight: 800, color: '#fff' }}>{notifsCount > 9 ? '9+' : notifsCount}</span>
              </div>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
