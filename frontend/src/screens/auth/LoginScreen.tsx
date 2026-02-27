import React, { useState } from 'react';
import { GlobalState, Screen, ToastType } from '../../state/useAppState';
import BtnPrimary from '../../components/BtnPrimary';

interface Props {
  state: GlobalState;
  go: (screen: Screen) => void;
  update: (partial: Partial<GlobalState>) => void;
  showToast: (message: string, type?: ToastType) => void;
}

export default function LoginScreen({ state, go, update, showToast }: Props) {
  const [loading, setLoading] = useState(false);

  const handleConnect = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      go('role');
    }, 800);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#050507',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Animated orbs */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        left: '-10%',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(242,208,107,0.08) 0%, transparent 70%)',
        animation: 'float 8s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-10%',
        width: 350,
        height: 350,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(91,127,255,0.06) 0%, transparent 70%)',
        animation: 'float 10s ease-in-out infinite reverse',
        pointerEvents: 'none',
      }} />

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: 380,
        padding: '0 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 32,
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 900,
            fontSize: 48,
            color: '#F4F4F8',
            letterSpacing: '-0.05em',
            lineHeight: 1,
          }}>
            NEXUS<span style={{ color: '#5B7FFF' }}>.</span>
          </div>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: 15,
            color: '#9898B4',
            marginTop: 12,
            lineHeight: 1.5,
          }}>
            La plateforme des professionnels a domicile
          </p>
        </div>

        {/* Glass card */}
        <div style={{
          width: '100%',
          background: 'rgba(13,13,19,0.8)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 24,
          padding: 28,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}>
          <div>
            <h2 style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 800,
              fontSize: 22,
              color: '#F4F4F8',
              margin: 0,
              letterSpacing: '-0.03em',
            }}>
              Bienvenue
            </h2>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 14,
              color: '#9898B4',
              margin: '6px 0 0',
              lineHeight: 1.5,
            }}>
              Connectez-vous pour acceder a votre espace
            </p>
          </div>

          <BtnPrimary
            label="SE CONNECTER"
            onClick={handleConnect}
            loading={loading}
          />

          <button
            onClick={() => {
              update({ role: 'admin' });
              go('admin_login');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#54546C',
              fontFamily: 'Inter, sans-serif',
              fontSize: 13,
              cursor: 'pointer',
              textAlign: 'center',
              padding: '4px 0',
              transition: 'color 150ms',
            }}
          >
            Acces administration
          </button>
        </div>

        {/* Footer */}
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 12,
          color: '#54546C',
          textAlign: 'center',
          lineHeight: 1.5,
        }}>
          En continuant, vous acceptez nos{' '}
          <span style={{ color: '#9898B4', textDecoration: 'underline', cursor: 'pointer' }}>
            conditions d'utilisation
          </span>
        </p>
      </div>

      {/* Attribution */}
      <div style={{
        position: 'absolute',
        bottom: 16,
        left: 0,
        right: 0,
        textAlign: 'center',
      }}>
        <a
          href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'nexus-app')}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 11,
            color: '#54546C',
            textDecoration: 'none',
          }}
        >
          Built with love using caffeine.ai
        </a>
      </div>
    </div>
  );
}
