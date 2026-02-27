import React from 'react';

interface BtnPrimaryProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  danger?: boolean;
  small?: boolean;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
}

export default function BtnPrimary({
  label,
  onClick,
  disabled = false,
  loading = false,
  danger = false,
  small = false,
  icon,
  style,
  type = 'button',
}: BtnPrimaryProps) {
  const isDisabled = disabled || loading;

  let background = 'linear-gradient(135deg, #F2D06B 0%, #E8B84B 100%)';
  let color = '#050507';
  let boxShadow = '0 6px 28px rgba(242,208,107,0.3)';

  if (danger) {
    background = '#FF3D5A';
    color = '#fff';
    boxShadow = '0 6px 24px rgba(255,61,90,0.3)';
  }

  if (isDisabled) {
    background = '#1C1C26';
    color = '#54546C';
    boxShadow = 'none';
  }

  return (
    <button
      type={type}
      onClick={!isDisabled ? onClick : undefined}
      disabled={isDisabled}
      style={{
        width: '100%',
        height: small ? 44 : 56,
        borderRadius: 14,
        border: 'none',
        background,
        color,
        fontFamily: 'Inter, sans-serif',
        fontWeight: 700,
        fontSize: small ? 14 : 15,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        boxShadow,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        flexShrink: 0,
        transition: 'box-shadow 200ms, transform 100ms',
        letterSpacing: '-0.01em',
        ...style,
      }}
      onMouseDown={e => {
        if (!isDisabled) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.96)';
      }}
      onMouseUp={e => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
      }}
      onTouchStart={e => {
        if (!isDisabled) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.96)';
      }}
      onTouchEnd={e => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
      }}
    >
      {loading ? (
        <span style={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          border: `2px solid ${color}`,
          borderTopColor: 'transparent',
          animation: 'spin 0.8s linear infinite',
          display: 'inline-block',
        }} />
      ) : (
        <>
          {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
          {label}
        </>
      )}
    </button>
  );
}
