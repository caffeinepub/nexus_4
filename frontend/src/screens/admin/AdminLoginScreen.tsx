import React, { useState } from 'react';
import BtnPrimary from '../../components/BtnPrimary';
import { GlobalState, Screen, ToastType } from '../../state/useAppState';

interface Props {
  go: (screen: Screen) => void;
  update: (partial: Partial<GlobalState>) => void;
  showToast: (msg: string, type?: ToastType, duration?: number) => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%', height: 52, borderRadius: 12, border: '1px solid var(--d4)',
  background: 'var(--d2)', color: 'var(--t1)', fontSize: 16, padding: '0 14px',
  outline: 'none', boxSizing: 'border-box',
};

export default function AdminLoginScreen({ go, update, showToast }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      showToast('Veuillez remplir tous les champs', 'error');
      return;
    }
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      if (email === 'admin@nexus.ch' && password === 'nexus2026') {
        update({ adminAuthenticated: true });
        go('admin_dashboard');
      } else {
        showToast('Identifiants incorrects', 'error');
      }
    } catch {
      showToast('Erreur de connexion', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: 'var(--void)', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 380, padding: '0 24px' }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--alert)', fontFamily: 'Inter, sans-serif', letterSpacing: 2 }}>NEXUS</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--alert)', letterSpacing: 4, marginTop: 4 }}>ADMIN</div>
          <div style={{ width: 40, height: 2, background: 'var(--alert)', margin: '12px auto 0' }} />
        </div>

        {/* Inputs */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--t3)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Email</label>
          <input
            style={inputStyle}
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="admin@nexus.ch"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--t3)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Mot de passe</label>
          <input
            style={inputStyle}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%', padding: '15px', borderRadius: 14, border: 'none',
            background: loading ? 'var(--d4)' : 'var(--alert)',
            color: '#fff', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Connexion...' : 'Connexion'}
        </button>
      </div>
    </div>
  );
}
