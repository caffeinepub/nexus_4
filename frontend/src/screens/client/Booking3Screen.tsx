import React, { useState } from 'react';
import { IconArrowLeft, IconPhone, IconMapPin, IconMessage } from '../../components/icons';
import type { Screen, GlobalState, ToastType } from '../../state/useAppState';

interface Booking3Props {
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

export default function Booking3Screen({ go, update, showToast, state }: Booking3Props) {
  const [phone, setPhone] = useState(state.bookingData.phone || state.userPhone || '');
  const [adresse, setAdresse] = useState(state.bookingData.adresse || '');
  const [ville, setVille] = useState(state.bookingData.ville || '');
  const [note, setNote] = useState(state.bookingData.note || '');

  const isValid = phone.trim().length >= 10 && adresse.trim().length >= 5 && ville.trim().length >= 2;

  const handleContinue = () => {
    if (!isValid) {
      showToast('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }
    update({
      bookingData: {
        ...state.bookingData,
        phone,
        adresse,
        ville,
        note,
      },
    });
    go('booking_confirm');
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
        <button onClick={() => go('booking_2')} style={{
          width: '40px', height: '40px', borderRadius: '12px', background: 'var(--d3)',
          border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
        }}>
          <IconArrowLeft size={20} color="var(--t1)" />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px', color: 'var(--t3)', marginBottom: '2px' }}>
            Etape 3 sur 4
          </div>
          <ProgressNodes step={3} />
        </div>
      </div>

      {/* Scroll zone */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '72px 16px 16px' }}>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '22px',
          color: 'var(--t1)', marginBottom: '6px', animation: 'fadeIn 0.4s ease forwards',
        }}>
          Vos coordonnees
        </div>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px',
          color: 'var(--t3)', marginBottom: '28px', animation: 'fadeIn 0.4s ease 0.05s both',
        }}>
          L expert se deplacera a votre adresse
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Phone */}
          <div style={{ animation: 'fadeIn 0.4s ease 0.1s both' }}>
            <label style={{
              display: 'block', fontFamily: 'Inter, sans-serif', fontWeight: 600,
              fontSize: '13px', color: 'var(--t2)', marginBottom: '6px',
            }}>
              Telephone *
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}>
                <IconPhone size={18} color="var(--t3)" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+41 XX XXX XX XX"
                style={{
                  width: '100%', height: '52px', paddingLeft: '44px', paddingRight: '16px',
                  background: 'var(--d3)', border: '1px solid var(--d4)', borderRadius: '14px',
                  fontFamily: 'Inter, sans-serif', fontSize: '16px', color: 'var(--t1)', outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Address */}
          <div style={{ animation: 'fadeIn 0.4s ease 0.15s both' }}>
            <label style={{
              display: 'block', fontFamily: 'Inter, sans-serif', fontWeight: 600,
              fontSize: '13px', color: 'var(--t2)', marginBottom: '6px',
            }}>
              Adresse *
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}>
                <IconMapPin size={18} color="var(--t3)" />
              </div>
              <input
                type="text"
                value={adresse}
                onChange={e => setAdresse(e.target.value)}
                placeholder="Rue et numero"
                style={{
                  width: '100%', height: '52px', paddingLeft: '44px', paddingRight: '16px',
                  background: 'var(--d3)', border: '1px solid var(--d4)', borderRadius: '14px',
                  fontFamily: 'Inter, sans-serif', fontSize: '16px', color: 'var(--t1)', outline: 'none',
                }}
              />
            </div>
          </div>

          {/* City */}
          <div style={{ animation: 'fadeIn 0.4s ease 0.2s both' }}>
            <label style={{
              display: 'block', fontFamily: 'Inter, sans-serif', fontWeight: 600,
              fontSize: '13px', color: 'var(--t2)', marginBottom: '6px',
            }}>
              Ville *
            </label>
            <input
              type="text"
              value={ville}
              onChange={e => setVille(e.target.value)}
              placeholder="Geneve, Lausanne..."
              style={{
                width: '100%', height: '52px', padding: '0 16px',
                background: 'var(--d3)', border: '1px solid var(--d4)', borderRadius: '14px',
                fontFamily: 'Inter, sans-serif', fontSize: '16px', color: 'var(--t1)', outline: 'none',
              }}
            />
          </div>

          {/* Note */}
          <div style={{ animation: 'fadeIn 0.4s ease 0.25s both' }}>
            <label style={{
              display: 'block', fontFamily: 'Inter, sans-serif', fontWeight: 600,
              fontSize: '13px', color: 'var(--t2)', marginBottom: '6px',
            }}>
              Note pour l expert (optionnel)
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '14px', top: '16px', zIndex: 1 }}>
                <IconMessage size={18} color="var(--t3)" />
              </div>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Instructions d acces, preferences..."
                rows={3}
                style={{
                  width: '100%', padding: '14px 16px 14px 44px',
                  background: 'var(--d3)', border: '1px solid var(--d4)', borderRadius: '14px',
                  fontFamily: 'Inter, sans-serif', fontSize: '15px', color: 'var(--t1)',
                  outline: 'none', resize: 'none', lineHeight: 1.5,
                }}
              />
            </div>
          </div>
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
          disabled={!isValid}
          style={{
            width: '100%', height: '58px', borderRadius: '18px',
            background: isValid ? 'linear-gradient(135deg, var(--gold) 0%, var(--gold2) 100%)' : 'var(--d4)',
            color: isValid ? '#050507' : 'var(--t4)',
            fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '16px',
            border: 'none', cursor: isValid ? 'pointer' : 'not-allowed',
            boxShadow: isValid ? '0 8px 32px rgba(242,208,107,0.28)' : 'none',
            transition: 'all 200ms ease',
          }}
        >
          Continuer
        </button>
      </div>
    </div>
  );
}
