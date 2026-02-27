import React, { useState } from 'react';
import { GlobalState, Screen, ToastType } from '../../state/useAppState';
import Header from '../../components/Header';
import TabBarClient from '../../components/TabBarClient';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  go: (screen: Screen) => void;
  state: GlobalState;
  update: (patch: Partial<GlobalState>) => void;
  showToast: (message: string, type?: ToastType) => void;
}

const PAYMENT_HISTORY = [
  { id: 'p1', service: 'Coupe + Brushing', pro: 'Sofia Martins', amount: 65, date: '24 fev 2026' },
  { id: 'p2', service: 'Soin visage', pro: 'Amira Benali', amount: 55, date: '18 fev 2026' },
  { id: 'p3', service: 'Massage relaxant', pro: 'Lea Dupont', amount: 80, date: '10 fev 2026' },
  { id: 'p4', service: 'Balayage', pro: 'Sofia Martins', amount: 150, date: '2 fev 2026' },
];

export default function ClientProfilScreen({ go, state, update, showToast }: Props) {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [name, setName] = useState(state.userName || 'Utilisateur');
  const [phone, setPhone] = useState(state.userPhone || '+41 79 000 00 00');
  const [email, setEmail] = useState(state.userEmail || 'user@example.com');

  const memberSince = 'Membre depuis janvier 2026';
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const handleSaveName = () => {
    update({ userName: name });
    setEditingName(false);
    showToast('Nom mis a jour', 'success');
  };

  const handleSavePhone = () => {
    update({ userPhone: phone });
    setEditingPhone(false);
    showToast('Telephone mis a jour', 'success');
  };

  const handleSaveEmail = () => {
    update({ userEmail: email });
    setEditingEmail(false);
    showToast('Email mis a jour', 'success');
  };

  const handleLogout = async () => {
    if (!logoutConfirm) {
      setLogoutConfirm(true);
      setTimeout(() => setLogoutConfirm(false), 3000);
      return;
    }
    try {
      await clear();
      queryClient.clear();
    } catch (_) {}
    update({ role: null });
    go('login');
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', height: 44, background: '#121219',
    border: '1px solid rgba(242,208,107,0.3)', borderRadius: 10,
    padding: '0 12px', fontFamily: 'Inter, sans-serif', fontSize: 15,
    color: '#F4F4F8', outline: 'none', boxSizing: 'border-box', marginTop: 8,
  };

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: '#050507' }}>
      <Header title="Mon profil" onLogoClick={() => go('explorer')} />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any, overscrollBehavior: 'contain', paddingTop: 72 }}>
        {/* Avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px 20px' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, #D4A050, #F2D06B)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 800, color: '#050507',
            border: '3px solid #050507',
            boxShadow: '0 0 0 2px #F2D06B',
            marginBottom: 12,
          }}>
            {initials}
          </div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 18, fontWeight: 800, color: '#F4F4F8', marginBottom: 4 }}>{name}</div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#54546C' }}>{memberSince}</div>
        </div>

        {/* Profile fields */}
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{
            fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600,
            color: '#54546C', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            Informations personnelles
          </div>

          {/* Name */}
          <div style={{
            background: '#0D0D13',
            border: editingName ? '1px solid rgba(242,208,107,0.4)' : '1px solid rgba(255,255,255,0.06)',
            borderRadius: 14, padding: '14px 16px', marginBottom: 10,
            transition: 'border-color 200ms',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#54546C" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#54546C' }}>Nom</span>
              </div>
              <button
                onClick={() => editingName ? handleSaveName() : setEditingName(true)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', color: '#F2D06B', fontSize: 12, fontWeight: 600 }}
              >
                {editingName ? 'Sauvegarder' : 'Modifier'}
              </button>
            </div>
            {editingName ? (
              <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} autoFocus />
            ) : (
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 600, color: '#F4F4F8', marginTop: 6 }}>{name}</div>
            )}
          </div>

          {/* Phone */}
          <div style={{
            background: '#0D0D13',
            border: editingPhone ? '1px solid rgba(242,208,107,0.4)' : '1px solid rgba(255,255,255,0.06)',
            borderRadius: 14, padding: '14px 16px', marginBottom: 10,
            transition: 'border-color 200ms',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#54546C" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#54546C' }}>Telephone</span>
              </div>
              <button
                onClick={() => editingPhone ? handleSavePhone() : setEditingPhone(true)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', color: '#F2D06B', fontSize: 12, fontWeight: 600 }}
              >
                {editingPhone ? 'Sauvegarder' : 'Modifier'}
              </button>
            </div>
            {editingPhone ? (
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} autoFocus />
            ) : (
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 600, color: '#F4F4F8', marginTop: 6 }}>{phone}</div>
            )}
          </div>

          {/* Email */}
          <div style={{
            background: '#0D0D13',
            border: editingEmail ? '1px solid rgba(242,208,107,0.4)' : '1px solid rgba(255,255,255,0.06)',
            borderRadius: 14, padding: '14px 16px', marginBottom: 10,
            transition: 'border-color 200ms',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#54546C" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                </svg>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#54546C' }}>Email</span>
              </div>
              <button
                onClick={() => editingEmail ? handleSaveEmail() : setEditingEmail(true)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', color: '#F2D06B', fontSize: 12, fontWeight: 600 }}
              >
                {editingEmail ? 'Sauvegarder' : 'Modifier'}
              </button>
            </div>
            {editingEmail ? (
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} autoFocus />
            ) : (
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 600, color: '#F4F4F8', marginTop: 6 }}>{email}</div>
            )}
          </div>
        </div>

        {/* Payment history */}
        <div style={{ padding: '0 20px 24px' }}>
          <div style={{
            fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600,
            color: '#54546C', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            Historique paiements
          </div>
          <div style={{ background: '#0D0D13', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
            {PAYMENT_HISTORY.map((payment, i) => (
              <div key={payment.id} style={{
                padding: '12px 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: i < PAYMENT_HISTORY.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}>
                <div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600, color: '#F4F4F8', marginBottom: 2 }}>{payment.service}</div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#54546C' }}>{payment.pro} · {payment.date}</div>
                </div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14, color: '#F2D06B' }}>{payment.amount} CHF</div>
              </div>
            ))}
          </div>
        </div>

        {/* Logout */}
        <div style={{ padding: '0 20px 32px' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', height: 52,
              background: logoutConfirm ? 'rgba(255,61,90,0.12)' : '#0D0D13',
              border: logoutConfirm ? '1px solid rgba(255,61,90,0.4)' : '1px solid rgba(255,255,255,0.06)',
              borderRadius: 14,
              color: logoutConfirm ? '#FF3D5A' : '#9898B4',
              fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 200ms',
            }}
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {logoutConfirm ? 'Confirmer la deconnexion ?' : 'Se deconnecter'}
          </button>
        </div>

        <div style={{ height: 16 }} />
      </div>

      <TabBarClient current="client_profil" go={go} />
    </div>
  );
}
