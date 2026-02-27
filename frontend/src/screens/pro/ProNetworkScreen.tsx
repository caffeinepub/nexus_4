import React, { useState } from 'react';
import { Screen, GlobalState, ToastType } from '../../state/useAppState';
import BtnPrimary from '../../components/BtnPrimary';

interface Props {
  go: (screen: Screen) => void;
  state: GlobalState;
  update: (partial: Partial<GlobalState>) => void;
  showToast: (message: string, type?: ToastType) => void;
  removeToast?: (id: string) => void;
}

const NETWORK_PROS = [
  { name: 'Marie L.', category: 'Coiffure', city: 'Lausanne', status: 'active' },
  { name: 'Sofiane R.', category: 'Barbier', city: 'Geneve', status: 'active' },
  { name: 'Emma D.', category: 'Esthetique', city: 'Berne', status: 'pending' },
];

export default function ProNetworkScreen({ go, showToast }: Props) {
  const [codeCopied, setCodeCopied] = useState(false);
  const referralCode = 'NEXUS-DEMO42';

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCodeCopied(true);
      showToast('Code de parrainage copie', 'success');
      setTimeout(() => setCodeCopied(false), 2000);
    } catch {
      showToast('Code: ' + referralCode, 'info');
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#050507', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 56,
        background: 'rgba(5,5,7,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', padding: '0 20px', zIndex: 10,
      }}>
        <button
          onClick={() => go('pro_dashboard')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="#9898B4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 16, color: '#F4F4F8', marginLeft: 8 }}>
          Mon Reseau
        </span>
      </div>

      {/* Scroll zone */}
      <div style={{ flex: 1, overflowY: 'auto', paddingTop: 72, paddingBottom: 32 }}>
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Referral code card */}
          <div style={{ background: '#0D0D13', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px 20px' }}>
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 18, color: '#F4F4F8', marginBottom: 16 }}>
              Mon code de parrainage
            </div>
            <div style={{
              background: '#1C1C26',
              border: '1px dashed rgba(242,208,107,0.3)',
              borderRadius: 12,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: 28, color: '#F2D06B', letterSpacing: '0.08em' }}>
                {referralCode}
              </span>
              <button
                onClick={handleCopyCode}
                style={{
                  background: 'rgba(242,208,107,0.1)',
                  border: '1px solid rgba(242,208,107,0.2)',
                  borderRadius: 8,
                  padding: '8px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {codeCopied ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <polyline points="20 6 9 17 4 12" stroke="#F2D06B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="9" y="9" width="13" height="13" rx="2" stroke="#F2D06B" strokeWidth="2"/>
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="#F2D06B" strokeWidth="2"/>
                  </svg>
                )}
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 12, color: '#F2D06B' }}>
                  Copier
                </span>
              </button>
            </div>

            {/* Reward explanation */}
            <div style={{
              background: 'rgba(242,208,107,0.05)',
              border: '1px solid rgba(242,208,107,0.1)',
              borderRadius: 10,
              padding: '12px 14px',
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                <polygon
                  points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                  stroke="#F2D06B" strokeWidth="2" fill="rgba(242,208,107,0.2)"
                />
              </svg>
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 13, color: '#C8C8D8', lineHeight: 1.5 }}>
                Gagnez <strong style={{ color: '#F2D06B' }}>1 mois gratuit</strong> pour chaque professionnel que vous parrainez qui active un abonnement.
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ background: '#0D0D13', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px' }}>
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: 32, color: '#F2D06B', lineHeight: 1 }}>3</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 12, color: '#9898B4', marginTop: 4 }}>Pros invites</div>
            </div>
            <div style={{ background: '#0D0D13', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px' }}>
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: 32, color: '#00D97A', lineHeight: 1 }}>1</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 12, color: '#9898B4', marginTop: 4 }}>Mois gagnes</div>
            </div>
          </div>

          {/* Network list */}
          <div style={{ background: '#0D0D13', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '3px solid #F2D06B',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="2" stroke="#5B7FFF" strokeWidth="2"/>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="#5B7FFF" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 15, color: '#F4F4F8' }}>Mon reseau</span>
            </div>
            {NETWORK_PROS.map((pro, i) => (
              <div
                key={i}
                style={{
                  padding: '14px 20px',
                  borderBottom: i < NETWORK_PROS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14, color: '#F4F4F8' }}>{pro.name}</div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 12, color: '#9898B4' }}>{pro.category} · {pro.city}</div>
                </div>
                <div style={{
                  background: pro.status === 'active' ? 'rgba(0,217,122,0.1)' : 'rgba(255,61,90,0.1)',
                  border: `1px solid ${pro.status === 'active' ? 'rgba(0,217,122,0.3)' : 'rgba(255,61,90,0.3)'}`,
                  borderRadius: 999,
                  padding: '4px 10px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: 11,
                  color: pro.status === 'active' ? '#00D97A' : '#FF3D5A',
                }}>
                  {pro.status === 'active' ? 'Actif' : 'En attente'}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <BtnPrimary label="Inviter un collegue" onClick={() => go('pro_share')} />

        </div>
      </div>
    </div>
  );
}
