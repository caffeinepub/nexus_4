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

const CITIES = ['Geneve', 'Lausanne', 'Zurich', 'Berne', 'Bale', 'Lucerne', 'Fribourg', 'Neuchatel', 'Sion', 'Lugano', 'Winterthur', 'St-Gall'];

export default function Booking3Screen({ state, go, update, showToast }: Props) {
  const [adresse, setAdresse] = useState(state.bookingAdresse || '');
  const [ville, setVille] = useState(state.bookingVille || '');
  const [phone, setPhone] = useState(state.bookingPhone || state.userPhone || '');
  const [note, setNote] = useState(state.bookingNote || '');
  const [adresseError, setAdresseError] = useState('');
  const [villeError, setVilleError] = useState('');

  const pro = state.selectedPro;
  if (!pro) { go('explorer'); return null; }

  const handleNext = () => {
    let valid = true;
    if (!adresse.trim()) { setAdresseError('Adresse requise'); valid = false; } else setAdresseError('');
    if (!ville) { setVilleError('Ville requise'); valid = false; } else setVilleError('');
    if (!valid) return;

    update({
      bookingAdresse: adresse,
      bookingVille: ville,
      bookingPhone: phone,
      bookingNote: note,
    });
    go('booking_4');
  };

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%', height: 52, background: '#0D0D13',
    border: `1px solid ${hasError ? '#FF3D5A' : 'rgba(255,255,255,0.08)'}`,
    borderRadius: 12, padding: '0 16px',
    fontFamily: 'Inter, sans-serif', fontSize: 16, color: '#F4F4F8',
    outline: 'none', boxSizing: 'border-box', transition: 'border-color 150ms',
  });

  const labelStyle: React.CSSProperties = {
    display: 'block', fontFamily: 'Inter, sans-serif', fontWeight: 600,
    fontSize: 12, color: '#9898B4', letterSpacing: '0.08em',
    textTransform: 'uppercase', marginBottom: 8,
  };

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: '#050507' }}>
      <Header showBack onBack={() => go('booking_2')} title="Vos coordonnees" />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any, overscrollBehavior: 'contain', paddingTop: 72 }}>
        <div style={{ padding: '0 20px', maxWidth: 560, margin: '0 auto' }}>
          <StepIndicator current={3} />

          <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 20, fontWeight: 800, marginBottom: 24, color: '#F4F4F8' }}>
            Vos informations
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={labelStyle}>Adresse de prestation</label>
              <input
                type="text"
                value={adresse}
                onChange={e => { setAdresse(e.target.value); setAdresseError(''); }}
                placeholder="Rue et numero"
                style={inputStyle(!!adresseError)}
                onFocus={e => { if (!adresseError) e.target.style.borderColor = 'rgba(242,208,107,0.4)'; }}
                onBlur={e => { if (!adresseError) e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              />
              {adresseError && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#FF3D5A', marginTop: 6 }}>{adresseError}</p>}
            </div>

            <div>
              <label style={labelStyle}>Ville</label>
              <select
                value={ville}
                onChange={e => { setVille(e.target.value); setVilleError(''); }}
                style={{
                  ...inputStyle(!!villeError),
                  cursor: 'pointer',
                  appearance: 'none' as any,
                }}
              >
                <option value="">Selectionnez une ville</option>
                {CITIES.map(c => <option key={c} value={c} style={{ background: '#0D0D13' }}>{c}</option>)}
              </select>
              {villeError && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#FF3D5A', marginTop: 6 }}>{villeError}</p>}
            </div>

            <div>
              <label style={labelStyle}>Telephone (optionnel)</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+41 79 000 00 00"
                style={inputStyle(false)}
                onFocus={e => { e.target.style.borderColor = 'rgba(242,208,107,0.4)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              />
            </div>

            <div>
              <label style={labelStyle}>Notes (optionnel)</label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Demandes speciales, acces, code porte..."
                rows={3}
                style={{
                  width: '100%', background: '#0D0D13',
                  border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12,
                  padding: '14px 16px', fontFamily: 'Inter, sans-serif', fontSize: 16,
                  color: '#F4F4F8', outline: 'none', resize: 'none', boxSizing: 'border-box',
                  minHeight: 96, transition: 'border-color 150ms',
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(242,208,107,0.4)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              />
            </div>
          </div>

          <div style={{ height: 20 }} />
        </div>
      </div>

      <div style={{
        flexShrink: 0, padding: '12px 20px calc(12px + env(safe-area-inset-bottom, 8px))',
        background: 'rgba(5,5,7,0.97)', borderTop: '1px solid rgba(255,255,255,0.04)',
      }}>
        <BtnPrimary label="Continuer" onClick={handleNext} />
      </div>
    </div>
  );
}
