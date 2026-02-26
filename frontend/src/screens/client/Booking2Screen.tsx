import React, { useState } from 'react';
import { IconArrowLeft, IconFlash } from '../../components/icons';
import type { Screen, GlobalState, ToastType } from '../../state/useAppState';

interface Booking2Props {
  go: (screen: Screen) => void;
  update: (partial: Partial<GlobalState>) => void;
  showToast: (msg: string, type?: ToastType, duration?: number) => void;
  state: GlobalState;
}

function ProgressNodes({ step }: { step: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {[1, 2, 3, 4].map((n, i) => (
        <React.Fragment key={n}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: n <= step ? 'linear-gradient(135deg, var(--gold) 0%, var(--gold2) 100%)' : 'var(--d4)',
            border: `2px solid ${n <= step ? 'var(--gold)' : 'var(--d4)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '12px',
            color: n <= step ? '#050507' : 'var(--t4)', flexShrink: 0,
          }}>{n}</div>
          {i < 3 && <div style={{ flex: 1, height: '2px', background: n < step ? 'var(--gold)' : 'var(--d4)', minWidth: '20px' }} />}
        </React.Fragment>
      ))}
    </div>
  );
}

function generateSlots() {
  const slots: { date: string; heure: string; flash: boolean }[] = [];
  const now = new Date();
  slots.push({ date: "Aujourd hui", heure: 'Maintenant', flash: true });
  for (let h = now.getHours() + 1; h <= 20; h += 1) {
    if (slots.length >= 4) break;
    slots.push({ date: "Aujourd hui", heure: `${h}:00`, flash: false });
  }
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toLocaleDateString('fr-CH', { weekday: 'short', day: 'numeric', month: 'short' });
  for (let h = 9; h <= 18; h += 2) {
    slots.push({ date: tomorrowStr, heure: `${h}:00`, flash: false });
  }
  return slots;
}

const SLOTS = generateSlots();

export default function Booking2Screen({ go, update, showToast, state }: Booking2Props) {
  const initialSelected = state.bookingData.date
    ? { date: state.bookingData.date, heure: state.bookingData.heure || '' }
    : null;

  const [selected, setSelected] = useState<{ date: string; heure: string } | null>(initialSelected);

  const handleContinue = () => {
    if (!selected) {
      showToast('Veuillez selectionner un creneau', 'error');
      return;
    }
    update({
      bookingData: {
        ...state.bookingData,
        date: selected.date,
        heure: selected.heure,
      },
    });
    go('booking_3');
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column',
      background: 'var(--void)', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '56px',
        display: 'flex', alignItems: 'center', paddingLeft: '8px', paddingRight: '16px',
        gap: '12px', zIndex: 100, background: 'rgba(5,5,7,0.90)', backdropFilter: 'blur(20px)',
      }}>
        <button onClick={() => go('booking_1')} style={{
          width: '40px', height: '40px', borderRadius: '12px', background: 'var(--d3)',
          border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
        }}>
          <IconArrowLeft size={20} color="var(--t1)" />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px', color: 'var(--t3)', marginBottom: '2px' }}>
            Etape 2 sur 4
          </div>
          <ProgressNodes step={2} />
        </div>
      </div>

      {/* Scroll zone */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '72px 16px 16px' }}>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '22px',
          color: 'var(--t1)', marginBottom: '6px', animation: 'fadeIn 0.4s ease forwards',
        }}>
          Choisissez un creneau
        </div>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px',
          color: 'var(--t3)', marginBottom: '24px', animation: 'fadeIn 0.4s ease 0.05s both',
        }}>
          {state.bookingData.serviceName} · {state.bookingData.montant} CHF
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {SLOTS.map((slot, i) => {
            const isSelected = selected?.date === slot.date && selected?.heure === slot.heure;
            return (
              <button
                key={i}
                onClick={() => setSelected({ date: slot.date, heure: slot.heure })}
                style={{
                  padding: '16px 14px',
                  borderRadius: '16px',
                  background: isSelected
                    ? (slot.flash ? 'rgba(0,217,122,0.08)' : 'rgba(242,208,107,0.08)')
                    : 'var(--d2)',
                  border: `2px solid ${isSelected ? (slot.flash ? 'var(--flash)' : 'var(--gold)') : 'var(--d4)'}`,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 150ms ease',
                  animation: `fadeIn 0.4s ease ${0.05 + i * 0.03}s both`,
                }}
              >
                {slot.flash && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px',
                    animation: 'breathe 2s ease-in-out infinite',
                  }}>
                    <IconFlash size={14} color="var(--flash)" />
                    <span style={{
                      fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '11px', color: 'var(--flash)',
                    }}>
                      Flash
                    </span>
                  </div>
                )}
                <div style={{
                  fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '15px',
                  color: isSelected ? (slot.flash ? 'var(--flash)' : 'var(--gold)') : 'var(--t1)',
                  marginBottom: '4px',
                }}>
                  {slot.heure}
                </div>
                <div style={{
                  fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '12px', color: 'var(--t3)',
                }}>
                  {slot.date}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        flexShrink: 0, padding: '12px 16px', background: 'rgba(5,5,7,0.97)',
        backdropFilter: 'blur(20px)', borderTop: '1px solid var(--d3)',
        paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
      }}>
        <button
          onClick={handleContinue}
          disabled={!selected}
          style={{
            width: '100%', height: '58px', borderRadius: '18px',
            background: selected ? 'linear-gradient(135deg, var(--gold) 0%, var(--gold2) 100%)' : 'var(--d4)',
            color: selected ? '#050507' : 'var(--t4)',
            fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '16px',
            border: 'none', cursor: selected ? 'pointer' : 'not-allowed',
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
