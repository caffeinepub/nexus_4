import React, { useState } from 'react';
import { GlobalState, Screen, ToastType } from '../../state/useAppState';
import Header from '../../components/Header';
import BtnPrimary from '../../components/BtnPrimary';

interface Props {
  state: GlobalState;
  go: (screen: Screen) => void;
  update: (partial: Partial<GlobalState>) => void;
  showToast: (message: string, type?: ToastType) => void;
}

const DEMO_SERVICES = [
  { id: 'd1', name: 'Coupe femme', prix: 65, duree: 60, description: 'Coupe et brushing inclus', actif: true },
  { id: 'd2', name: 'Coloration', prix: 95, duree: 90, description: 'Coloration complete', actif: true },
  { id: 'd3', name: 'Balayage', prix: 120, duree: 120, description: 'Balayage naturel', actif: true },
  { id: 'd4', name: 'Soin profond', prix: 45, duree: 45, description: 'Masque et soin', actif: true },
];

export function StepIndicator({ current }: { current: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 24 }}>
      {[1, 2, 3, 4].map((step, i) => (
        <React.Fragment key={step}>
          <div style={{
            width: 16, height: 16, borderRadius: '50%',
            background: step <= current ? '#F2D06B' : '#1C1C26',
            border: step === current ? '2px solid #F2D06B' : 'none',
            boxShadow: step === current ? '0 0 0 4px rgba(242,208,107,0.15)' : 'none',
            animation: step === current ? 'breathe 2s ease-in-out infinite' : 'none',
            transition: 'all 300ms', flexShrink: 0,
          }} />
          {i < 3 && (
            <div style={{
              width: 40, height: 2,
              background: step < current ? '#F2D06B' : '#1C1C26',
              transition: 'background 300ms',
            }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function Booking1Screen({ state, go, update, showToast }: Props) {
  const pro = state.selectedPro;
  const services = (pro?.services && pro.services.length > 0) ? pro.services : DEMO_SERVICES;
  const [selected, setSelected] = useState(state.bookingServiceId || '');

  if (!pro) { go('explorer'); return null; }

  const handleNext = () => {
    if (!selected) { showToast('Selectionnez un service', 'error'); return; }
    const service = services.find(s => s.id === selected);
    if (service) {
      update({
        bookingServiceId: service.id,
        bookingServiceName: service.name,
        bookingMontant: service.prix,
      });
    }
    go('booking_2');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: '#050507' }}>
      <Header showBack onBack={() => go('fiche_pro')} title="Reservation" />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any, overscrollBehavior: 'contain', paddingTop: 72 }}>
        <div style={{ padding: '0 20px', maxWidth: 560, margin: '0 auto' }}>
          <StepIndicator current={1} />

          <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 20, fontWeight: 800, marginBottom: 6, color: '#F4F4F8' }}>
            Choisissez un service
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#54546C', marginBottom: 20 }}>
            Avec {pro.name}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {services.map(service => (
              <button
                key={service.id}
                onClick={() => setSelected(service.id)}
                style={{
                  background: selected === service.id ? 'rgba(242,208,107,0.08)' : '#0D0D13',
                  border: selected === service.id ? '1px solid rgba(242,208,107,0.4)' : '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 16, padding: '16px',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 150ms', width: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 80,
                }}
              >
                <div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 15, color: '#F4F4F8', marginBottom: 6 }}>
                    {service.name}
                  </div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '3px 8px', background: '#1C1C26', borderRadius: 999,
                    fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#9898B4',
                  }}>
                    <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#54546C" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                    {service.duree} min
                  </div>
                </div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 16, color: '#F2D06B', flexShrink: 0, marginLeft: 12 }}>
                  {service.prix} CHF
                </div>
              </button>
            ))}
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
