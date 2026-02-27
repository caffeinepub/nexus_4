import React, { useState } from 'react';
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

const SLOTS = [
  { id: 's1', label: 'Dans 1 heure', sub: 'Disponible maintenant', flash: true },
  { id: 's2', label: 'Dans 2 heures', sub: 'Disponible maintenant', flash: true },
  { id: 's3', label: 'Ce soir', sub: 'Apres 18h00', flash: false },
  { id: 's4', label: 'Demain matin', sub: 'Avant 12h00', flash: false },
  { id: 's5', label: 'Demain apres-midi', sub: 'Apres 14h00', flash: false },
  { id: 's6', label: 'Apres-demain', sub: 'Journee complete', flash: false },
];

export default function Booking2Screen({ state, go, update, showToast }: Props) {
  const [selected, setSelected] = useState(state.bookingCreneau || '');
  const pro = state.selectedPro;
  if (!pro) { go('explorer'); return null; }

  const handleNext = () => {
    if (!selected) { showToast('Selectionnez un creneau', 'error'); return; }
    update({ bookingCreneau: selected });
    go('booking_3');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: '#050507' }}>
      <Header showBack onBack={() => go('booking_1')} title="Date et heure" />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any, overscrollBehavior: 'contain', paddingTop: 72 }}>
        <div style={{ padding: '0 20px', maxWidth: 560, margin: '0 auto' }}>
          <StepIndicator current={2} />

          <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 20, fontWeight: 800, marginBottom: 20, color: '#F4F4F8' }}>
            Choisissez un creneau
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {SLOTS.map(slot => {
              const isSelected = selected === slot.id;
              return (
                <button
                  key={slot.id}
                  onClick={() => setSelected(slot.id)}
                  style={{
                    background: isSelected ? 'rgba(242,208,107,0.08)' : '#0D0D13',
                    border: isSelected ? '1px solid rgba(242,208,107,0.4)' : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 16, padding: '16px 20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    cursor: 'pointer', transition: 'all 150ms', textAlign: 'left', width: '100%',
                  }}
                >
                  <div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 15, color: '#F4F4F8', marginBottom: 4 }}>
                      {slot.label}
                    </div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#54546C' }}>{slot.sub}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {slot.flash && (
                      <span style={{ background: 'rgba(0,217,122,0.1)', color: '#00D97A', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999 }}>
                        FLASH
                      </span>
                    )}
                    {isSelected && (
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%', background: '#F2D06B',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#050507" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div style={{ height: 20 }} />
        </div>
      </div>

      <div style={{
        flexShrink: 0, padding: '12px 20px calc(12px + env(safe-area-inset-bottom, 8px))',
        background: 'rgba(5,5,7,0.97)', borderTop: '1px solid rgba(255,255,255,0.04)',
      }}>
        <BtnPrimary label="Continuer" onClick={handleNext} disabled={!selected} />
      </div>
    </div>
  );
}
