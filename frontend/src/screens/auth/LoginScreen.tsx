import React, { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { IconLock } from '../../components/icons';
import type { Screen, GlobalState, ToastType } from '../../state/useAppState';

interface LoginScreenProps {
  go: (screen: Screen) => void;
  update: (partial: Partial<GlobalState>) => void;
  showToast: (msg: string, type?: ToastType, duration?: number) => void;
}

const orbs = [
  { size: 320, top: '-100px', left: '-80px', color: 'var(--gold)', opacity: 0.10, delay: '0s', duration: '7s' },
  { size: 220, top: '25%', right: '-60px', color: 'var(--blue)', opacity: 0.08, delay: '1.8s', duration: '9s' },
  { size: 180, bottom: '22%', left: '5%', color: 'var(--gold)', opacity: 0.06, delay: '0.9s', duration: '8s' },
  { size: 140, bottom: '-50px', right: '15%', color: 'var(--blue)', opacity: 0.09, delay: '2.4s', duration: '6s' },
];

export default function LoginScreen({ go, update, showToast }: LoginScreenProps) {
  const { login, isLoggingIn, loginStatus, identity } = useInternetIdentity();
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    if (connecting || isLoggingIn) return;
    setConnecting(true);
    try {
      await login();
      update({ isAuthenticated: true });
      go('role');
    } catch (err: any) {
      if (err?.message === 'User is already authenticated') {
        update({ isAuthenticated: true });
        go('role');
      } else {
        showToast('Erreur de connexion. Veuillez reessayer.', 'error');
      }
    } finally {
      setConnecting(false);
    }
  };

  const isLoading = connecting || isLoggingIn || loginStatus === 'logging-in';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--void)',
      overflow: 'hidden',
    }}>
      {/* Animated orbs */}
      {orbs.map((orb, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            opacity: orb.opacity,
            top: (orb as any).top,
            left: (orb as any).left,
            right: (orb as any).right,
            bottom: (orb as any).bottom,
            filter: 'blur(40px)',
            animation: `float ${orb.duration} ease-in-out ${orb.delay} infinite`,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      ))}

      {/* Main content — centered vertically */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 32px 120px',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{
          textAlign: 'center',
          marginBottom: '10px',
          animation: 'fadeIn 0.6s ease forwards',
        }}>
          <div style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 900,
            fontSize: '64px',
            letterSpacing: '-4px',
            lineHeight: 1,
            color: 'var(--t1)',
            display: 'inline-flex',
            alignItems: 'baseline',
          }}>
            NEXUS<span style={{ color: 'var(--blue)' }}>.</span>
          </div>
        </div>

        {/* Tagline */}
        <div style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 300,
          fontSize: '16px',
          color: 'var(--t3)',
          fontStyle: 'italic',
          textAlign: 'center',
          marginBottom: '36px',
          animation: 'fadeIn 0.6s ease 0.1s both',
        }}>
          L excellence a votre porte
        </div>

        {/* Gold gradient divider */}
        <div style={{
          width: '48px',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
          marginBottom: '40px',
          animation: 'fadeIn 0.6s ease 0.15s both',
        }} />

        {/* Connect button */}
        <button
          onClick={handleConnect}
          disabled={isLoading}
          style={{
            width: '100%',
            height: '62px',
            borderRadius: '18px',
            background: isLoading
              ? 'var(--d4)'
              : 'linear-gradient(135deg, var(--gold) 0%, var(--gold2) 100%)',
            color: '#050507',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 800,
            fontSize: '16px',
            letterSpacing: '0.02em',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: isLoading ? 'none' : '0 8px 32px rgba(242, 208, 107, 0.28)',
            transition: 'all 120ms ease',
            animation: 'fadeIn 0.6s ease 0.2s both',
          }}
        >
          {isLoading ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#050507" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
              <line x1="12" y1="2" x2="12" y2="6" />
              <line x1="12" y1="18" x2="12" y2="22" />
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
              <line x1="2" y1="12" x2="6" y2="12" />
              <line x1="18" y1="12" x2="22" y2="12" />
              <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
              <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
            </svg>
          ) : (
            <IconLock size={20} color="#050507" />
          )}
          {isLoading ? 'Connexion en cours...' : 'SE CONNECTER'}
        </button>

        {/* Security sub-text */}
        <div style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          fontSize: '12px',
          color: 'var(--t4)',
          textAlign: 'center',
          marginTop: '14px',
          animation: 'fadeIn 0.6s ease 0.3s both',
        }}>
          Connexion securisee · Internet Identity
        </div>
      </div>

      {/* Legal links — absolute bottom */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        zIndex: 2,
        animation: 'fadeIn 0.6s ease 0.4s both',
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {['CGV', 'Confidentialite', 'Contact'].map((link, i) => (
            <React.Fragment key={link}>
              {i > 0 && <span style={{ color: 'var(--t4)', fontSize: '11px' }}>·</span>}
              <button style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: '11px',
                color: 'var(--t4)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}>
                {link}
              </button>
            </React.Fragment>
          ))}
        </div>
        <div style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          fontSize: '10px',
          color: 'var(--t3)',
          textAlign: 'center',
        }}>
          Built with{' '}
          <span style={{ color: 'var(--alert)' }}>&#9829;</span>
          {' '}using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'nexus-app')}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--gold)', textDecoration: 'none' }}
          >
            caffeine.ai
          </a>
          {' '}· {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
