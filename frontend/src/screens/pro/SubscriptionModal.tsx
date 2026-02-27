import React from 'react';
import BtnPrimary from '../../components/BtnPrimary';
import { createSubscriptionUrl } from '../../lib/payrexx';
import { GlobalState, Screen, ToastType } from '../../state/useAppState';

interface Props {
  go: (screen: Screen) => void;
  state: GlobalState;
  update: (partial: Partial<GlobalState>) => void;
  showToast?: (msg: string, type?: ToastType) => void;
  removeToast?: (id: string) => void;
}

const AVANTAGES = [
  'Reservations illimitees via NEXUS',
  'Paiements TWINT instantanes',
  'Mode Flash pour demandes urgentes',
  'Tableau de bord et statistiques pro',
  'Partage de profil multi-reseaux',
  'Programme de parrainage — gagnez des mois gratuits',
  'Support prioritaire 7j/7',
];

function GoldCheck() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="rgba(242,208,107,0.15)" />
      <path d="M6 10l3 3 5-5" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SubscriptionModal({ go, state, update }: Props) {
  const handleStart = () => {
    const proId = state.principal || 'unknown';
    const email = state.userEmail || '';
    const phone = state.userPhone || '';
    const url = createSubscriptionUrl(proId, email, phone);

    if (!import.meta.env.VITE_PAYREXX_SECRET) {
      update({ proActif: true });
      go('pro_success');
      return;
    }

    window.location.href = url;
  };

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: 'var(--void)' }}>
      {/* Back button */}
      <div style={{ padding: '16px 20px 0', flexShrink: 0 }}>
        <button
          onClick={() => go('pro_pitch')}
          style={{ background: 'none', border: 'none', color: 'var(--t3)', fontSize: 13, cursor: 'pointer', padding: 0 }}
        >
          Retour
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gold)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
            NEXUS PRO
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--t1)', fontFamily: 'Inter, sans-serif', lineHeight: 1.2 }}>
            Lancez votre activite
          </div>
        </div>

        <div style={{ background: 'var(--d2)', borderRadius: 20, padding: '20px', marginBottom: 28 }}>
          {AVANTAGES.map((av, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: i < AVANTAGES.length - 1 ? 16 : 0 }}>
              <GoldCheck />
              <span style={{ fontSize: 14, color: 'var(--t1)', fontWeight: 500 }}>{av}</span>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--t1)', fontFamily: 'Inter, sans-serif' }}>
            7 JOURS GRATUITS
          </div>
          <div style={{ fontSize: 15, color: 'var(--t3)', marginTop: 6 }}>Puis 29.90 CHF / mois</div>
        </div>
      </div>

      <div style={{ flexShrink: 0, padding: '16px 24px', background: 'var(--void)', borderTop: '1px solid var(--d3)' }}>
        <BtnPrimary label="Commencer gratuitement" onClick={handleStart} />
        <div style={{ textAlign: 'center', marginTop: 10, fontSize: 11, color: 'var(--t4)', fontWeight: 500, letterSpacing: 0.3 }}>
          Paiement securise · TWINT uniquement
        </div>
      </div>
    </div>
  );
}
