import React from 'react';

interface BtnPrimaryProps {
  onClick: () => void;
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  danger?: boolean;
  small?: boolean;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}

export default function BtnPrimary({ onClick, children, loading = false, disabled = false, danger = false, small = false, icon, style }: BtnPrimaryProps) {
  const isDisabled = disabled || loading;

  let background = 'linear-gradient(135deg, var(--gold) 0%, var(--gold2) 100%)';
  let color = '#050507';
  let boxShadow = '0 6px 24px rgba(242,208,107,0.25)';

  if (danger) {
    background = 'var(--alert)';
    color = '#fff';
    boxShadow = '0 6px 24px rgba(255,61,90,0.25)';
  }

  if (isDisabled) {
    background = 'var(--d4)';
    color = 'var(--t3)';
    boxShadow = 'none';
  }

  return (
    <button
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      style={{
        width: '100%',
        height: small ? 44 : 56,
        borderRadius: small ? 12 : 16,
        border: 'none',
        background,
        color,
        fontFamily: 'Inter, sans-serif',
        fontWeight: 700,
        fontSize: small ? 13 : 15,
        letterSpacing: 0.2,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        boxShadow,
        transition: 'all 120ms ease',
        ...style,
      }}
    >
      {loading ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
          <line x1="12" y1="2" x2="12" y2="6" />
          <line x1="12" y1="18" x2="12" y2="22" />
          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
          <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
          <line x1="2" y1="12" x2="6" y2="12" />
          <line x1="18" y1="12" x2="22" y2="12" />
          <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
          <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
        </svg>
      ) : icon ? (
        icon
      ) : null}
      {children}
    </button>
  );
}
