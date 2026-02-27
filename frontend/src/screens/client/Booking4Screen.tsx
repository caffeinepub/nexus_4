import React from 'react';
import { GlobalState, Screen, ToastType } from '../../state/useAppState';
import Header from '../../components/Header';
import BtnPrimary from '../../components/BtnPrimary';
import { StepIndicator } from './Booking1Screen';

interface Props {
  state: GlobalState;
  go: (screen: Screen) => void;
  update: (partial: Partial<GlobalState>) => void;
  showToast: (message: string, type?: ToastType) => void;
}

export default function Booking4Screen({ state, go, update, showToast }: Props) {
  const pro = state.selectedPro;
  if (!pro) { go('explorer'); return null; }

  const montant = state.bookingMontant || 65;
  const proName = pro.name;

  const rows = [
    { label: 'Professionnel', value: proName },
    { label: 'Service', value: state.bookingServiceName || 'Service' },
    { label: 'Creneau', value: state.bookingCreneau || 'Dans 1 heure' },
    { label: 'Adresse', value: state.bookingAdresse || pro.ville },
    { label: 'Ville', value: state.bookingVille || pro.ville },
  ];

  const handleConfirm = () => {
    const bookingId = `demo_${Date.now()}`;
    update({ bookingId });
    showToast('Demande de reservation envoyee', 'success');
    go('booking_5');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: '#050507' }}>
      <Header showBack onBack={() => go('booking_3')} title="Recapitulatif" />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any, overscrollBehavior: 'contain', paddingTop: 72 }}>
        <div style={{ padding: '0 20px', maxWidth: 560, margin: '0 auto' }}>
          <StepIndicator current={4} />

          <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 20, fontWeight: 800, marginBottom: 20, color: '#F4F4F8' }}>
            Confirmer la reservation
          </h2>

          {/* Recap card */}
          <div style={{
            background: '#0D0D13', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 20, overflow: 'hidden', marginBottom: 16,
          }}>
            {rows.map((row, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 16px',
                borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#54546C' }}>{row.label}</span>
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 14, color: '#F4F4F8' }}>{row.value}</span>
              </div>
            ))}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '16px', background: 'rgba(242,208,107,0.03)',
              borderTop: '1px solid rgba(242,208,107,0.1)',
            }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 15, color: '#9898B4' }}>Total</span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 28, color: '#F2D06B', letterSpacing: '-0.02em' }}>
                {montant} CHF
              </span>
            </div>
          </div>

          {/* Payment info */}
          <div style={{
            background: '#0D0D13', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 14, padding: '12px 16px', marginBottom: 20,
          }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#54546C', lineHeight: 1.5, margin: 0 }}>
              Paiement via TWINT uniquement. Les fonds sont conserves en sequestre jusqu'a la fin de la prestation.
            </p>
          </div>

          <div style={{ height: 20 }} />
        </div>
      </div>

      <div style={{
        flexShrink: 0, padding: '12px 20px calc(12px + env(safe-area-inset-bottom, 8px))',
        background: 'rgba(5,5,7,0.97)', borderTop: '1px solid rgba(255,255,255,0.04)',
      }}>
        <BtnPrimary label={`Confirmer et payer via TWINT — ${montant} CHF`} onClick={handleConfirm} />
      </div>
    </div>
  );
}
