import React from 'react';
import { IconUser, IconGrid } from '../../components/icons';
import type { Screen, GlobalState, ToastType } from '../../state/useAppState';

interface RoleScreenProps {
  go: (screen: Screen) => void;
  update: (partial: Partial<GlobalState>) => void;
  showToast: (msg: string, type?: ToastType, duration?: number) => void;
}

export default function RoleScreen({ go, update }: RoleScreenProps) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      background: '#050507',
      overflow: 'hidden',
    }}>
      {/* Header — logo only */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        background: 'rgba(5,5,7,0.85)',
        backdropFilter: 'blur(20px)',
      }}>
        <div style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 900,
          fontSize: '22px',
          letterSpacing: '-2px',
          color: '#F4F4F8',
          display: 'inline-flex',
          alignItems: 'baseline',
        }}>
          NEXUS<span style={{ color: '#5B7FFF' }}>.</span>
        </div>
      </div>

      {/* Content zone */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '72px 24px 32px',
        gap: '16px',
      }}>
        <div style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 700,
          fontSize: '22px',
          color: '#F4F4F8',
          textAlign: 'center',
          marginBottom: '8px',
          animation: 'fadeIn 0.4s ease forwards',
        }}>
          Qui etes-vous ?
        </div>
        <div style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          fontSize: '14px',
          color: '#54546C',
          textAlign: 'center',
          marginBottom: '24px',
          animation: 'fadeIn 0.4s ease 0.05s both',
        }}>
          Choisissez votre profil pour continuer
        </div>

        {/* CLIENT card */}
        <button
          onClick={() => {
            update({ role: 'client' });
            go('otp');
          }}
          style={{
            width: '100%',
            minHeight: '100px',
            borderRadius: '20px',
            background: '#0D0D13',
            border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            padding: '24px 20px',
            cursor: 'pointer',
            transition: 'all 180ms ease',
            animation: 'fadeIn 0.4s ease 0.1s both',
            textAlign: 'left',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.border = '1px solid rgba(91,127,255,0.5)';
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(91,127,255,0.06)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.border = '1px solid rgba(255,255,255,0.06)';
            (e.currentTarget as HTMLButtonElement).style.background = '#0D0D13';
          }}
        >
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'rgba(91,127,255,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <IconUser size={26} color="#5B7FFF" />
          </div>
          <div>
            <div style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 800,
              fontSize: '20px',
              color: '#F4F4F8',
              marginBottom: '4px',
            }}>
              Je suis client
            </div>
            <div style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: '13px',
              color: '#54546C',
            }}>
              Reservez un expert a domicile
            </div>
          </div>
        </button>

        {/* PRO card */}
        <button
          onClick={() => {
            update({ role: 'pro' });
            go('otp');
          }}
          style={{
            width: '100%',
            minHeight: '100px',
            borderRadius: '20px',
            background: '#0D0D13',
            border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            padding: '24px 20px',
            cursor: 'pointer',
            transition: 'all 180ms ease',
            animation: 'fadeIn 0.4s ease 0.15s both',
            textAlign: 'left',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.border = '1px solid rgba(242,208,107,0.4)';
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(242,208,107,0.04)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.border = '1px solid rgba(255,255,255,0.06)';
            (e.currentTarget as HTMLButtonElement).style.background = '#0D0D13';
          }}
        >
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'rgba(242,208,107,0.10)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <IconGrid size={26} color="#F2D06B" />
          </div>
          <div>
            <div style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 800,
              fontSize: '20px',
              color: '#F4F4F8',
              marginBottom: '4px',
            }}>
              Je suis professionnel
            </div>
            <div style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: '13px',
              color: '#54546C',
            }}>
              Deployez votre activite beaute
            </div>
          </div>
        </button>

        {/* Admin link */}
        <button
          onClick={() => go('admin_login')}
          style={{
            marginTop: '16px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: '13px',
            color: '#2E2E3E',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '12px 16px',
            minHeight: '44px',
            animation: 'fadeIn 0.4s ease 0.2s both',
          }}
        >
          Acces administration
        </button>
      </div>
    </div>
  );
}
