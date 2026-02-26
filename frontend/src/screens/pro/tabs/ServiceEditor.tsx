import React, { useState, useEffect } from 'react';
import BottomSheet from '../../../components/BottomSheet';

interface ServiceItem {
  id: string;
  name: string;
  prix: number;
  duree: number;
  description: string;
  badge: string;
  mode: string;
  actif: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  service: ServiceItem | null;
  onSaved: (service: ServiceItem) => void;
}

const BADGES = ['Flash', 'Popular', 'New', 'Premium', 'Promo'];
const MODES = [
  { key: 'domicile', label: 'Domicile' },
  { key: 'salon', label: 'Salon' },
  { key: 'both', label: 'Les deux' },
];

const inputStyle: React.CSSProperties = {
  width: '100%', height: 52, borderRadius: 12, border: '1px solid var(--d4)',
  background: 'var(--d3)', color: 'var(--t1)', fontSize: 16, padding: '0 14px',
  outline: 'none', boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: 'var(--t3)', letterSpacing: 0.5,
  textTransform: 'uppercase', marginBottom: 6, display: 'block',
};

export default function ServiceEditor({ open, onClose, service, onSaved }: Props) {
  const [name, setName] = useState('');
  const [prix, setPrix] = useState(30);
  const [duree, setDuree] = useState(30);
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('');
  const [mode, setMode] = useState('both');

  useEffect(() => {
    if (service) {
      setName(service.name);
      setPrix(service.prix);
      setDuree(service.duree);
      setDescription(service.description);
      setBadge(service.badge);
      setMode(service.mode);
    } else {
      setName('');
      setPrix(30);
      setDuree(30);
      setDescription('');
      setBadge('');
      setMode('both');
    }
  }, [service, open]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSaved({
      id: service?.id || '',
      name: name.trim(),
      prix,
      duree,
      description,
      badge,
      mode,
      actif: service?.actif ?? true,
    });
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={service ? 'Modifier le service' : 'Nouveau service'}
      footer={
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '14px', borderRadius: 14, border: 'none',
              background: 'var(--d4)', color: 'var(--t2)', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            style={{
              flex: 2, padding: '14px', borderRadius: 14, border: 'none',
              cursor: name.trim() ? 'pointer' : 'not-allowed',
              background: name.trim() ? 'linear-gradient(135deg, var(--gold), var(--gold2))' : 'var(--d4)',
              color: name.trim() ? '#050507' : 'var(--t3)',
              fontSize: 14, fontWeight: 700,
            }}
          >
            Sauvegarder
          </button>
        </div>
      }
    >
      <div style={{ paddingBottom: 8 }}>
        {/* Name */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Nom *</label>
          <input
            style={inputStyle}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ex: Coupe homme"
          />
        </div>

        {/* Prix + Duree */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Prix (CHF)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => setPrix(p => Math.max(0, p - 5))}
                style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: 'var(--d4)', color: 'var(--t1)', fontSize: 18, cursor: 'pointer', flexShrink: 0 }}
              >
                -
              </button>
              <div style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: 700, color: 'var(--gold)' }}>{prix}</div>
              <button
                onClick={() => setPrix(p => p + 5)}
                style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: 'var(--d4)', color: 'var(--t1)', fontSize: 18, cursor: 'pointer', flexShrink: 0 }}
              >
                +
              </button>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Duree (min)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => setDuree(d => Math.max(15, d - 15))}
                style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: 'var(--d4)', color: 'var(--t1)', fontSize: 18, cursor: 'pointer', flexShrink: 0 }}
              >
                -
              </button>
              <div style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: 700, color: 'var(--t1)' }}>{duree}</div>
              <button
                onClick={() => setDuree(d => d + 15)}
                style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: 'var(--d4)', color: 'var(--t1)', fontSize: 18, cursor: 'pointer', flexShrink: 0 }}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description optionnelle..."
            style={{ ...inputStyle, height: 80, padding: '12px 14px', resize: 'none' }}
          />
        </div>

        {/* Badge */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Badge</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {BADGES.map(b => (
              <button
                key={b}
                onClick={() => setBadge(badge === b ? '' : b)}
                style={{
                  padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
                  background: badge === b ? 'var(--gold)' : 'var(--d4)',
                  color: badge === b ? '#050507' : 'var(--t2)',
                  fontSize: 12, fontWeight: 600,
                }}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Mode */}
        <div>
          <label style={labelStyle}>Mode</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {MODES.map(m => (
              <button
                key={m.key}
                onClick={() => setMode(m.key)}
                style={{
                  flex: 1, padding: '10px', borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: mode === m.key ? 'var(--gold)' : 'var(--d4)',
                  color: mode === m.key ? '#050507' : 'var(--t2)',
                  fontSize: 12, fontWeight: 600,
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}
