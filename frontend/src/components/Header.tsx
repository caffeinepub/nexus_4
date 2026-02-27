import React from 'react';
import { Role } from '../state/useAppState';

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
  role?: Role;
  notifsCount?: number;
  onNotifs?: () => void;
  onSwitchRole?: () => void;
  onLogoClick?: () => void;
}

export default function Header({
  showBack = false,
  onBack,
  title,
  role,
  notifsCount = 0,
  onNotifs,
  onSwitchRole,
  onLogoClick,
}: HeaderProps) {
  const switchLabel = role === 'client' ? 'Pro' : role === 'pro' ? 'Client' : null;

  return (
    <header style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 56,
      background: 'rgba(5,5,7,0.97)',
      backdropFilter: 'blur(32px)',
      WebkitBackdropFilter: 'blur(32px)',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: 12,
    }}>
      {/* Left */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        {showBack ? (
          <button
            onClick={onBack}
            aria-label="Retour"
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#0D0D13',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#F4F4F8" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
        ) : (
          <button
            onClick={onLogoClick}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 900,
              fontSize: 22,
              color: '#F4F4F8',
              letterSpacing: '-0.05em',
            }}>
              NEXUS<span style={{ color: '#5B7FFF' }}>.</span>
            </span>
          </button>
        )}
      </div>

      {/* Center */}
      {title && (
        <div style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          animation: 'fadeIn 300ms ease-out',
        }}>
          <span style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: 16,
            color: '#F4F4F8',
            whiteSpace: 'nowrap',
          }}>
            {title}
          </span>
        </div>
      )}

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {switchLabel && onSwitchRole && (
          <button
            onClick={onSwitchRole}
            style={{
              height: 32,
              padding: '0 14px',
              borderRadius: 999,
              border: '1px solid rgba(242,208,107,0.3)',
              background: 'rgba(242,208,107,0.06)',
              color: '#F2D06B',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: 12,
              cursor: 'pointer',
              transition: 'border-color 150ms',
              letterSpacing: '0.04em',
            }}
          >
            {switchLabel}
          </button>
        )}
        {onNotifs && (
          <button
            onClick={onNotifs}
            aria-label="Notifications"
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#0D0D13',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              flexShrink: 0,
            }}
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#F4F4F8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {notifsCount > 0 && (
              <span style={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#FF3D5A',
                animation: 'scaleIn 200ms ease-out',
              }} />
            )}
          </button>
        )}
      </div>
    </header>
  );
}
