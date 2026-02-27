import React, { useState } from 'react';
import { GlobalState, Screen, ToastType } from '../../state/useAppState';
import BtnPrimary from '../../components/BtnPrimary';
import Header from '../../components/Header';

interface Props {
  state: GlobalState;
  go: (screen: Screen) => void;
  update: (partial: Partial<GlobalState>) => void;
  showToast: (message: string, type?: ToastType) => void;
}

export default function AdminLoginScreen({ state, go, update, showToast }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = () => {
    let valid = true;
    if (!email) { setEmailError('Email requis'); valid = false; }
    else setEmailError('');
    if (!password) { setPasswordError('Mot de passe requis'); valid = false; }
    else setPasswordError('');
    if (!valid) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (email === 'admin@nexus.ch' && password === 'Admin2024!') {
        update({ adminAuthenticated: true, role: 'admin' });
        go('admin_dashboard');
      } else {
        showToast('Identifiants incorrects', 'error');
        setEmailError('Email ou mot de passe incorrect');
      }
    }, 600);
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
        title="Administration"
        onLogoClick={() => go('login')}
      />

      <div style={{
        flex: 1,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch' as any,
        overscrollBehavior: 'contain',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '72px 24px 32px',
      }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <div style={{
            background: '#0D0D13',
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
                Espace administrateur
              </h2>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 14,
                color: '#9898B4',
                margin: '6px 0 0',
              }}>
                Acces reserve aux administrateurs NEXUS
              </p>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: 12,
                color: '#9898B4',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setEmailError(''); }}
                placeholder="admin@nexus.ch"
                style={{
                  width: '100%',
                  height: 52,
                  background: '#121219',
                  border: `1px solid ${emailError ? '#FF3D5A' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 12,
                  padding: '0 16px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 16,
                  color: '#F4F4F8',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={e => { if (!emailError) e.target.style.borderColor = 'rgba(255,61,90,0.4)'; }}
                onBlur={e => { if (!emailError) e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              />
              {emailError && (
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#FF3D5A', marginTop: 6 }}>
                  {emailError}
                </p>
              )}
            </div>

            <div>
              <label style={{
                display: 'block',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: 12,
                color: '#9898B4',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}>
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setPasswordError(''); }}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  height: 52,
                  background: '#121219',
                  border: `1px solid ${passwordError ? '#FF3D5A' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 12,
                  padding: '0 16px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 16,
                  color: '#F4F4F8',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={e => { if (!passwordError) e.target.style.borderColor = 'rgba(255,61,90,0.4)'; }}
                onBlur={e => { if (!passwordError) e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                onKeyDown={e => { if (e.key === 'Enter') handleLogin(); }}
              />
              {passwordError && (
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#FF3D5A', marginTop: 6 }}>
                  {passwordError}
                </p>
              )}
            </div>

            <BtnPrimary
              label="Se connecter"
              onClick={handleLogin}
              loading={loading}
              danger
            />
          </div>
        </div>
      </div>
    </div>
  );
}
