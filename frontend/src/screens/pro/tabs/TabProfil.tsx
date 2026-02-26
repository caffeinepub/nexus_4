import React, { useState } from 'react';

interface TabProfilData {
  prenom: string;
  nom: string;
  slogan: string;
  bio: string;
  categorie: string;
  lieu: string;
  rayonKm: number;
  adresseSalon: string;
  ville: string;
}

interface Props {
  data: TabProfilData;
  onChange: (data: TabProfilData) => void;
}

const CATEGORIES = [
  { key: 'barber', label: 'Barber' },
  { key: 'coiffure', label: 'Coiffure' },
  { key: 'esthetique', label: 'Esthetique' },
  { key: 'massage', label: 'Massage' },
];

const VILLES = [
  'Geneve', 'Lausanne', 'Fribourg', 'Neuchatel', 'Sion',
  'Sierre', 'Monthey', 'Yverdon', 'Morges', 'Nyon', 'Vevey', 'Montreux',
];

const LIEUX = [
  { key: 'domicile', label: 'A domicile' },
  { key: 'salon', label: 'En salon' },
  { key: 'both', label: 'Les deux' },
];

const inputStyle: React.CSSProperties = {
  width: '100%', height: 52, borderRadius: 12, border: '1px solid var(--d4)',
  background: 'var(--d2)', color: 'var(--t1)', fontSize: 16, padding: '0 14px',
  outline: 'none', boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: 'var(--t3)', letterSpacing: 0.5,
  textTransform: 'uppercase', marginBottom: 6, display: 'block',
};

export default function TabProfil({ data, onChange }: Props) {
  const set = (key: keyof TabProfilData, val: string | number) => onChange({ ...data, [key]: val });

  return (
    <div style={{ paddingBottom: 20 }}>
      {/* Prenom / Nom */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>Prenom *</label>
          <input style={inputStyle} value={data.prenom} onChange={e => set('prenom', e.target.value)} placeholder="Jean" />
        </div>
        <div>
          <label style={labelStyle}>Nom *</label>
          <input style={inputStyle} value={data.nom} onChange={e => set('nom', e.target.value)} placeholder="Dupont" />
        </div>
      </div>

      {/* Slogan */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Slogan</label>
        <input style={inputStyle} value={data.slogan} onChange={e => set('slogan', e.target.value)} placeholder="Votre expertise, votre style" />
      </div>

      {/* Bio */}
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Bio</label>
        <textarea
          value={data.bio}
          onChange={e => { if (e.target.value.length <= 200) set('bio', e.target.value); }}
          placeholder="Decrivez votre experience et votre approche..."
          style={{ ...inputStyle, height: 100, padding: '12px 14px', resize: 'none', lineHeight: 1.5 }}
        />
        <div style={{ fontSize: 11, color: data.bio.length >= 180 ? 'var(--alert)' : 'var(--t4)', textAlign: 'right', marginTop: 4 }}>
          {data.bio.length}/200
        </div>
      </div>

      {/* Categorie */}
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Categorie</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => set('categorie', cat.key)}
              style={{
                padding: '14px', borderRadius: 12, border: `2px solid ${data.categorie === cat.key ? 'var(--gold)' : 'var(--d4)'}`,
                background: data.categorie === cat.key ? 'rgba(242,208,107,0.06)' : 'var(--d2)',
                color: data.categorie === cat.key ? 'var(--gold)' : 'var(--t2)',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lieu */}
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Lieu d intervention</label>
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          {LIEUX.map(l => (
            <button
              key={l.key}
              onClick={() => set('lieu', l.key)}
              style={{
                flex: 1, padding: '12px 8px', borderRadius: 12,
                border: `2px solid ${data.lieu === l.key ? 'var(--gold)' : 'var(--d4)'}`,
                background: data.lieu === l.key ? 'rgba(242,208,107,0.06)' : 'var(--d2)',
                color: data.lieu === l.key ? 'var(--gold)' : 'var(--t2)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}
            >
              {l.label}
            </button>
          ))}
        </div>

        {(data.lieu === 'domicile' || data.lieu === 'both') && (
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Rayon de deplacement</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input
                type="range" min={1} max={50} value={data.rayonKm}
                onChange={e => set('rayonKm', Number(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--gold)' }}
              />
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--gold)', minWidth: 50 }}>{data.rayonKm} km</span>
            </div>
          </div>
        )}

        {(data.lieu === 'salon' || data.lieu === 'both') && (
          <div>
            <label style={labelStyle}>Adresse du salon</label>
            <input style={inputStyle} value={data.adresseSalon} onChange={e => set('adresseSalon', e.target.value)} placeholder="Rue de Rive 12, Geneve" />
          </div>
        )}
      </div>

      {/* Ville */}
      <div>
        <label style={labelStyle}>Ville</label>
        <select
          value={data.ville}
          onChange={e => set('ville', e.target.value)}
          style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
        >
          <option value="">Choisir une ville</option>
          {VILLES.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
    </div>
  );
}
