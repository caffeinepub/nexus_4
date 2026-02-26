import React, { useState } from 'react';
import { IconArrowLeft } from '../../components/icons';
import type { Screen, GlobalState, ToastType, AppService } from '../../state/useAppState';

interface Booking1Props {
  go: (screen: Screen) => void;
  update: (partial: Partial<GlobalState>) => void;
  showToast: (msg: string, type?: ToastType, duration?: number) => void;
  state: GlobalState;
}

function ProgressNodes({ step }: { step: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
      {[1, 2, 3, 4].map((n, i) => (
        <React.Fragment key={n}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: n <= step
              ? 'linear-gradient(135deg, var(--gold) 0%, var(--gold2) 100%)'
              : 'var(--d4)',
            border: `2px solid ${n <= step ? 'var(--gold)' : 'var(--d4)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: '12px',
            color: n <= step ? '#050507' : 'var(--t4)',
            flexShrink: 0,
            transition: 'all 200ms ease',
          }}>
            {n}
          </div>
          {i < 3 && (
            <div style={{
              flex: 1,
              height: '2px',
              background: n < step ? 'var(--gold)' : 'var(--d4)',
              minWidth: '20px',
              transition: 'background 200ms ease',
            }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

const DEFAULT_SERVICES: AppService[] = [
  { id: 's1', name: 'Coupe classique', prix: 35, duree: 45, description: 'Coupe et coiffage', actif: true },
  { id: 's2', name: 'Coupe + Barbe', prix: 55, duree: 60, description: 'Coupe et taille de barbe', actif: true },
  { id: 's3', name: 'Soin premium', prix: 75, duree: 90, description: 'Soin complet du visage', actif: true },
];

export default function Booking1Screen({ go, update, showToast, state }: Booking1Props) {
  const pro = state.selectedPro;
  const [selected, setSelected] = useState<AppService | null>(state.selectedService);

  const services: AppService[] = DEFAULT_SERVICES;

  const handleContinue = () => {
    if (!selected) {
      showToast('Veuillez selectionner un service', 'error');
      return;
    }
    update({
      selectedService: selected,
      bookingData: {
        ...state.bookingData,
        serviceId: selected.id,
        serviceName: selected.name,
        montant: selected.prix,
      },
    });
    go('booking_2');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--void)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '8px',
        paddingRight: '16px',
        gap: '12px',
        zIndex: 100,
        background: 'rgba(5,5,7,0.90)',
        backdropFilter: 'blur(20px)',
      }}>
        <button
          onClick={() => go('fiche_pro')}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'var(--d3)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <IconArrowLeft size={20} color="var(--t1)" />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: '13px',
            color: 'var(--t3)',
            marginBottom: '2px',
          }}>
            Etape 1 sur 4
          </div>
          <ProgressNodes step={1} />
        </div>
      </div>

      {/* Scroll zone */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '72px 16px 16px',
      }}>
        <div style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 700,
          fontSize: '22px',
          color: 'var(--t1)',
          marginBottom: '6px',
          animation: 'fadeIn 0.4s ease forwards',
        }}>
          Choisissez un service
        </div>
        <div style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          fontSize: '14px',
          color: 'var(--t3)',
          marginBottom: '24px',
          animation: 'fadeIn 0.4s ease 0.05s both',
        }}>
          {pro?.prenom || 'Expert'} · {pro?.categorie || 'Beaute'}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {services.filter(s => s.actif).map((service, i) => (
            <button
              key={service.id}
              onClick={() => setSelected(service)}
              style={{
                width: '100%',
                padding: '18px 20px',
                borderRadius: '18px',
                background: selected?.id === service.id ? 'rgba(242,208,107,0.08)' : 'var(--d2)',
                border: `2px solid ${selected?.id === service.id ? 'var(--gold)' : 'var(--d4)'}`,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 150ms ease',
                animation: `fadeIn 0.4s ease ${0.1 + i * 0.05}s both`,
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '6px',
              }}>
                <div style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: '16px',
                  color: 'var(--t1)',
                }}>
                  {service.name}
                </div>
                <div style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 800,
                  fontSize: '16px',
                  color: 'var(--gold)',
                }}>
                  {service.prix} CHF
                </div>
              </div>
              {service.description && (
                <div style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  fontSize: '13px',
                  color: 'var(--t3)',
                  marginBottom: '6px',
                }}>
                  {service.description}
                </div>
              )}
              <div style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: '12px',
                color: 'var(--t4)',
              }}>
                {service.duree} minutes
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        flexShrink: 0,
        padding: '12px 16px',
        background: 'rgba(5,5,7,0.97)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--d3)',
        paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
      }}>
        <button
          onClick={handleContinue}
          disabled={!selected}
          style={{
            width: '100%',
            height: '58px',
            borderRadius: '18px',
            background: selected
              ? 'linear-gradient(135deg, var(--gold) 0%, var(--gold2) 100%)'
              : 'var(--d4)',
            color: selected ? '#050507' : 'var(--t4)',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 800,
            fontSize: '16px',
            border: 'none',
            cursor: selected ? 'pointer' : 'not-allowed',
            boxShadow: selected ? '0 8px 32px rgba(242,208,107,0.28)' : 'none',
            transition: 'all 200ms ease',
          }}
        >
          Continuer
        </button>
      </div>
    </div>
  );
}
