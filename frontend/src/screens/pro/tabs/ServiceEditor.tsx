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
  width: '100%', height: 52, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.05)', color: '#F4F4F8', fontSize: 16, padding: '0 14px',
  outline: 'none', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif',
};

const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: '#54546C', letterSpacing: 0.5,
  textTransform: 'uppercase', marginBottom: 6, display: 'block',
  fontFamily: 'Inter, sans-serif',
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
      id: service?.id || `svc_${Date.now()}`,
      name: name.trim(),
      prix,
      duree,
      description,
      badge,
      mode,
      actif: true,
    });
    onClose();
  };

  if (!open) return null;

  return (
    <BottomSheet
      title={service ? 'Modifier le service' : 'Nouveau service'}
      onClose={onClose}
      footer={
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, height: 52, borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)',
              background: 'transparent', color: '#9898B4', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            }}
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            style={{
              flex: 2, height: 52, borderRadius: 14, border: 'none',
              background: name.trim() ? 'linear-gradient(135deg, #F2D06B, #D4A050)' : '#1C1C26',
              color: name.trim() ? '#050507' : '#54546C',
              fontSize: 14, fontWeight: 700, cursor: name.trim() ? 'pointer' : 'not-allowed',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {service ? 'Enregistrer' : 'Ajouter'}
          </button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 8 }}>
        {/* Name */}
        <div>
          <label style={labelStyle}>Nom du service</label>
          <input
            style={inputStyle}
            type="text"
            placeholder="Ex: Coupe homme"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        {/* Price & Duration */}
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Prix (CHF)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => setPrix(Math.max(5, prix - 5))}
                style={{
                  width: 40, height: 40, borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.05)', color: '#F4F4F8', fontSize: 18,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                −
              </button>
              <div style={{
                flex: 1, height: 40, borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: 700, fontSize: 16, color: '#F2D06B',
                fontFamily: 'Inter, sans-serif',
              }}>
                {prix}
              </div>
              <button
                onClick={() => setPrix(prix + 5)}
                style={{
                  width: 40, height: 40, borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.05)', color: '#F4F4F8', fontSize: 18,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                +
              </button>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Durée (min)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => setDuree(Math.max(15, duree - 15))}
                style={{
                  width: 40, height: 40, borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.05)', color: '#F4F4F8', fontSize: 18,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                −
              </button>
              <div style={{
                flex: 1, height: 40, borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: 700, fontSize: 16, color: '#F4F4F8',
                fontFamily: 'Inter, sans-serif',
              }}>
                {duree}
              </div>
              <button
                onClick={() => setDuree(duree + 15)}
                style={{
                  width: 40, height: 40, borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.05)', color: '#F4F4F8', fontSize: 18,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label style={labelStyle}>Description (optionnel)</label>
          <textarea
            style={{ ...inputStyle, height: 80, padding: '12px 14px', resize: 'none' }}
            placeholder="Décrivez votre service..."
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        {/* Badge */}
        <div>
          <label style={labelStyle}>Badge</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {BADGES.map(b => (
              <button
                key={b}
                onClick={() => setBadge(badge === b ? '' : b)}
                style={{
                  padding: '6px 14px', borderRadius: 20,
                  background: badge === b ? '#F2D06B' : 'rgba(255,255,255,0.05)',
                  color: badge === b ? '#050507' : '#9898B4',
                  border: badge === b ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Mode */}
        <div>
          <label style={labelStyle}>Mode de travail</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {MODES.map(m => (
              <button
                key={m.key}
                onClick={() => setMode(m.key)}
                style={{
                  flex: 1, padding: '10px 8px', borderRadius: 12,
                  background: mode === m.key ? 'rgba(242,208,107,0.15)' : 'rgba(255,255,255,0.05)',
                  color: mode === m.key ? '#F2D06B' : '#9898B4',
                  border: mode === m.key ? '1px solid rgba(242,208,107,0.3)' : '1px solid rgba(255,255,255,0.1)',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
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
