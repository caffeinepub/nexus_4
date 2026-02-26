import React, { useState } from 'react';

interface DaySchedule {
  actif: boolean;
  debut: string;
  fin: string;
}

interface TarifsData {
  jours: Record<string, DaySchedule>;
  flashActif: boolean;
  flashSupplement: number;
  delaiMin: string;
  annulation: string;
}

interface Props {
  data: TarifsData;
  onChange: (data: TarifsData) => void;
}

const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const JOURS_KEYS = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'];
const DELAIS = ['Immediat', '30 min', '1h', '2h', '4h'];
const ANNULATIONS = ['Flexible', 'Moderee', 'Stricte'];

const inputStyle: React.CSSProperties = {
  height: 44, borderRadius: 10, border: '1px solid var(--d4)',
  background: 'var(--d3)', color: 'var(--t1)', fontSize: 14, padding: '0 10px',
  outline: 'none', width: '100%', boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: 'var(--t3)', letterSpacing: 0.5,
  textTransform: 'uppercase', marginBottom: 10, display: 'block',
};

export default function TabTarifs({ data, onChange }: Props) {
  const set = (key: keyof TarifsData, val: unknown) => onChange({ ...data, [key]: val });

  const toggleJour = (key: string) => {
    const updated = { ...data.jours, [key]: { ...data.jours[key], actif: !data.jours[key]?.actif } };
    set('jours', updated);
  };

  const setJourTime = (key: string, field: 'debut' | 'fin', val: string) => {
    const updated = { ...data.jours, [key]: { ...data.jours[key], [field]: val } };
    set('jours', updated);
  };

  return (
    <div style={{ paddingBottom: 20 }}>
      {/* Jours */}
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Jours de disponibilite</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
          {JOURS.map((j, i) => {
            const key = JOURS_KEYS[i];
            const active = data.jours[key]?.actif;
            return (
              <button
                key={key}
                onClick={() => toggleJour(key)}
                style={{
                  width: 42, height: 42, borderRadius: 21, border: 'none', cursor: 'pointer',
                  background: active ? 'var(--gold)' : 'var(--d2)',
                  color: active ? '#050507' : 'var(--t2)',
                  fontSize: 12, fontWeight: 700,
                }}
              >
                {j}
              </button>
            );
          })}
        </div>

        {JOURS_KEYS.map((key, i) => {
          if (!data.jours[key]?.actif) return null;
          return (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, background: 'var(--d2)', borderRadius: 12, padding: '10px 14px' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gold)', minWidth: 32 }}>{JOURS[i]}</span>
              <div style={{ flex: 1 }}>
                <input type="time" value={data.jours[key]?.debut || '09:00'} onChange={e => setJourTime(key, 'debut', e.target.value)} style={inputStyle} />
              </div>
              <span style={{ color: 'var(--t3)', fontSize: 12 }}>-</span>
              <div style={{ flex: 1 }}>
                <input type="time" value={data.jours[key]?.fin || '18:00'} onChange={e => setJourTime(key, 'fin', e.target.value)} style={inputStyle} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Flash */}
      <div style={{ marginBottom: 20, background: data.flashActif ? 'rgba(0,217,122,0.06)' : 'var(--d2)', borderRadius: 14, padding: '14px', border: data.flashActif ? '1px solid rgba(0,217,122,0.25)' : '1px solid transparent' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: data.flashActif ? 12 : 0 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: data.flashActif ? 'var(--flash)' : 'var(--t1)' }}>Mode Flash</div>
            <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>Supplement pour disponibilite immediate</div>
          </div>
          <button
            onClick={() => set('flashActif', !data.flashActif)}
            style={{ width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', background: data.flashActif ? 'var(--flash)' : 'var(--d4)', position: 'relative', flexShrink: 0 }}
          >
            <div style={{ position: 'absolute', top: 2, left: data.flashActif ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.3s' }} />
          </button>
        </div>
        {data.flashActif && (
          <div>
            <label style={{ ...labelStyle, marginBottom: 6 }}>Supplement Flash (CHF)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button onClick={() => set('flashSupplement', Math.max(0, data.flashSupplement - 5))} style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: 'var(--d4)', color: 'var(--t1)', fontSize: 18, cursor: 'pointer' }}>-</button>
              <div style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: 700, color: 'var(--flash)' }}>{data.flashSupplement} CHF</div>
              <button onClick={() => set('flashSupplement', data.flashSupplement + 5)} style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: 'var(--d4)', color: 'var(--t1)', fontSize: 18, cursor: 'pointer' }}>+</button>
            </div>
          </div>
        )}
      </div>

      {/* Delai minimum */}
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Delai minimum de reservation</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {DELAIS.map(d => (
            <button
              key={d}
              onClick={() => set('delaiMin', d)}
              style={{
                padding: '8px 16px', borderRadius: 20, border: 'none', cursor: 'pointer',
                background: data.delaiMin === d ? 'var(--gold)' : 'var(--d2)',
                color: data.delaiMin === d ? '#050507' : 'var(--t2)',
                fontSize: 12, fontWeight: 600,
              }}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Annulation */}
      <div>
        <label style={labelStyle}>Politique d annulation</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {ANNULATIONS.map(a => (
            <button
              key={a}
              onClick={() => set('annulation', a)}
              style={{
                flex: 1, padding: '10px', borderRadius: 12, border: 'none', cursor: 'pointer',
                background: data.annulation === a ? 'var(--gold)' : 'var(--d2)',
                color: data.annulation === a ? '#050507' : 'var(--t2)',
                fontSize: 12, fontWeight: 600,
              }}
            >
              {a}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
