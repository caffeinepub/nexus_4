import React from 'react';
import { GlobalState, Screen, ToastType } from '../../state/useAppState';
import Header from '../../components/Header';

interface Props {
  state: GlobalState;
  go: (screen: Screen) => void;
  update: (partial: Partial<GlobalState>) => void;
  showToast: (message: string, type?: ToastType) => void;
}

export default function RoleScreen({ state, go, update, showToast }: Props) {
  const handleSelect = (role: 'client' | 'pro') => {
    update({ role });
    go('otp');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#050507',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Header
        showBack
        onBack={() => go('login')}
        title="Choisir votre role"
        onLogoClick={() => go('login')}
      />

      <div style={{
        flex: 1,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch' as any,
        overscrollBehavior: 'contain',
        paddingTop: 72,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '72px 24px 32px',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h1 style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 800,
              fontSize: 28,
              color: '#F4F4F8',
              margin: 0,
              letterSpacing: '-0.03em',
            }}>
              Qui etes-vous ?
            </h1>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 15,
              color: '#9898B4',
              marginTop: 10,
              lineHeight: 1.5,
            }}>
              Selectionnez votre profil pour continuer
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Client card */}
            <button
              onClick={() => handleSelect('client')}
              style={{
                background: '#0D0D13',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 18,
                padding: 24,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 150ms',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(242,208,107,0.3)';
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(242,208,107,0.04)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.08)';
                (e.currentTarget as HTMLButtonElement).style.background = '#0D0D13';
              }}
              onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.98)'; }}
              onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
            >
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: 'rgba(242,208,107,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#F2D06B" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: 18,
                  color: '#F4F4F8',
                  marginBottom: 4,
                }}>
                  Je suis client
                </div>
                <div style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 14,
                  color: '#9898B4',
                  lineHeight: 1.4,
                }}>
                  Trouvez et reservez des professionnels pres de chez vous
                </div>
              </div>
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#54546C" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            {/* Pro card */}
            <button
              onClick={() => handleSelect('pro')}
              style={{
                background: '#0D0D13',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 18,
                padding: 24,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 150ms',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(91,127,255,0.3)';
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(91,127,255,0.04)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.08)';
                (e.currentTarget as HTMLButtonElement).style.background = '#0D0D13';
              }}
              onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.98)'; }}
              onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
            >
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: 'rgba(91,127,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#5B7FFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: 18,
                  color: '#F4F4F8',
                  marginBottom: 4,
                }}>
                  Je suis professionnel
                </div>
                <div style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 14,
                  color: '#9898B4',
                  lineHeight: 1.4,
                }}>
                  Developpez votre activite et gerez vos reservations
                </div>
              </div>
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#54546C" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
