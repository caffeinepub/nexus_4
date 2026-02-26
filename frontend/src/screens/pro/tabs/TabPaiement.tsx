import React, { useState } from 'react';

interface PaiementData {
  twint: string;
  iban: string;
}

interface Props {
  data: PaiementData;
  onChange: (data: PaiementData) => void;
}

function formatIBAN(raw: string): string {
  const clean = raw.replace(/\s/g, '').toUpperCase();
  return clean.match(/.{1,4}/g)?.join(' ') || clean;
}

function isValidSwissPhone(phone: string): boolean {
  const clean = phone.replace(/\s/g, '');
  return /^(\+41|0041|0)[0-9]{9}$/.test(clean);
}

function isValidIBAN(iban: string): boolean {
  const clean = iban.replace(/\s/g, '');
  return /^CH[0-9]{19}$/.test(clean);
}

const inputStyle: React.CSSProperties = {
  width: '100%', height: 52, borderRadius: 12, border: '1px solid var(--d4)',
  background: 'var(--d3)', color: 'var(--t1)', fontSize: 16, padding: '0 14px',
  outline: 'none', boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: 'var(--t3)', letterSpacing: 0.5,
  textTransform: 'uppercase', marginBottom: 6, display: 'block',
};

export default function TabPaiement({ data, onChange }: Props) {
  const twintValid = isValidSwissPhone(data.twint);
  const ibanValid = isValidIBAN(data.iban.replace(/\s/g, ''));

  return (
    <div style={{ paddingBottom: 20 }}>
      {/* TWINT */}
      <div style={{ marginBottom: 20, background: 'rgba(0,217,122,0.06)', borderRadius: 16, padding: '16px', border: `1px solid ${twintValid ? 'var(--flash)' : 'rgba(0,217,122,0.15)'}`, transition: 'border-color 0.3s' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--flash)' }}>TWINT</div>
          {twintValid && <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--flash)', background: 'rgba(0,217,122,0.12)', borderRadius: 10, padding: '2px 8px' }}>Valide</span>}
        </div>
        <div style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 10 }}>Recevez vos paiements directement sur votre TWINT</div>
        <label style={labelStyle}>Numero TWINT *</label>
        <input
          style={{ ...inputStyle, borderColor: twintValid ? 'var(--flash)' : 'var(--d4)' }}
          value={data.twint}
          onChange={e => onChange({ ...data, twint: e.target.value })}
          placeholder="+41 79 123 45 67"
          type="tel"
        />
      </div>

      {/* IBAN */}
      <div style={{ marginBottom: 20, background: 'rgba(242,208,107,0.06)', borderRadius: 16, padding: '16px', border: `1px solid ${ibanValid ? 'var(--flash)' : 'rgba(242,208,107,0.15)'}`, transition: 'border-color 0.3s' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gold)' }}>Virement bancaire</div>
          {ibanValid && <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--flash)', background: 'rgba(0,217,122,0.12)', borderRadius: 10, padding: '2px 8px' }}>Valide</span>}
        </div>
        <div style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 10 }}>Pour les virements mensuels de votre solde</div>
        <label style={labelStyle}>IBAN Suisse *</label>
        <input
          style={{ ...inputStyle, borderColor: ibanValid ? 'var(--flash)' : 'var(--d4)' }}
          value={data.iban}
          onChange={e => onChange({ ...data, iban: formatIBAN(e.target.value) })}
          placeholder="CH56 0483 5012 3456 7800 9"
          maxLength={26}
        />
      </div>

      {/* Recap financier */}
      <div style={{ background: 'var(--d2)', borderRadius: 14, padding: '16px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t3)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 12 }}>Recap financier</div>
        {[
          { label: 'Commission NEXUS', value: '15% par reservation' },
          { label: 'Abonnement mensuel', value: '19.90 CHF / mois' },
          { label: 'Exemple: 10 reservations x 50 CHF', value: 'Net: 405 CHF' },
          { label: 'Virement sous', value: '48h apres prestation' },
        ].map((line, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < 3 ? '1px solid var(--d3)' : 'none' }}>
            <span style={{ fontSize: 12, color: 'var(--t3)' }}>{line.label}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)' }}>{line.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
