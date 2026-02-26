import React, { useState, useEffect } from 'react';
import ServiceEditor from './ServiceEditor';

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
  categorie: string;
  services: ServiceItem[];
  onChange: (services: ServiceItem[]) => void;
}

const DEFAULTS: Record<string, ServiceItem[]> = {
  barber: [
    { id: 's1', name: 'Coupe homme', prix: 35, duree: 30, description: '', badge: '', mode: 'both', actif: true },
    { id: 's2', name: 'Degrade premium', prix: 45, duree: 45, description: '', badge: 'Popular', mode: 'both', actif: true },
    { id: 's3', name: 'Coupe + Barbe', prix: 55, duree: 60, description: '', badge: '', mode: 'both', actif: true },
    { id: 's4', name: 'Barbe design', prix: 30, duree: 30, description: '', badge: '', mode: 'both', actif: true },
    { id: 's5', name: 'Rasage traditionnel', prix: 40, duree: 45, description: '', badge: 'Premium', mode: 'salon', actif: true },
  ],
  coiffure: [
    { id: 's1', name: 'Coupe femme', prix: 55, duree: 45, description: '', badge: '', mode: 'both', actif: true },
    { id: 's2', name: 'Couleur', prix: 120, duree: 120, description: '', badge: 'Popular', mode: 'salon', actif: true },
    { id: 's3', name: 'Meches', prix: 150, duree: 150, description: '', badge: '', mode: 'salon', actif: true },
    { id: 's4', name: 'Brushing', prix: 45, duree: 45, description: '', badge: '', mode: 'both', actif: true },
    { id: 's5', name: 'Coupe + Brushing', prix: 80, duree: 75, description: '', badge: '', mode: 'both', actif: true },
  ],
  esthetique: [
    { id: 's1', name: 'Soin visage', prix: 70, duree: 60, description: '', badge: 'Popular', mode: 'both', actif: true },
    { id: 's2', name: 'Manucure', prix: 40, duree: 45, description: '', badge: '', mode: 'both', actif: true },
    { id: 's3', name: 'Pedicure', prix: 50, duree: 60, description: '', badge: '', mode: 'both', actif: true },
    { id: 's4', name: 'Pose gel', prix: 60, duree: 75, description: '', badge: 'New', mode: 'both', actif: true },
    { id: 's5', name: 'Epilation jambes', prix: 45, duree: 45, description: '', badge: '', mode: 'both', actif: true },
  ],
  massage: [
    { id: 's1', name: 'Relaxant', prix: 80, duree: 60, description: '', badge: 'Popular', mode: 'both', actif: true },
    { id: 's2', name: 'Sportif', prix: 90, duree: 60, description: '', badge: '', mode: 'both', actif: true },
    { id: 's3', name: 'Dos', prix: 60, duree: 45, description: '', badge: '', mode: 'both', actif: true },
    { id: 's4', name: 'Duo', prix: 150, duree: 90, description: '', badge: 'Premium', mode: 'both', actif: true },
    { id: 's5', name: 'Reflexologie', prix: 70, duree: 60, description: '', badge: '', mode: 'both', actif: true },
  ],
};

export default function TabServices({ categorie, services, onChange }: Props) {
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (services.length === 0 && categorie && DEFAULTS[categorie]) {
      onChange(DEFAULTS[categorie]);
    }
  }, [categorie]);

  const handleSave = (svc: ServiceItem) => {
    if (editingService) {
      onChange(services.map(s => s.id === svc.id ? svc : s));
    } else {
      onChange([...services, { ...svc, id: `s${Date.now()}` }]);
    }
    setEditorOpen(false);
    setEditingService(null);
  };

  const handleDelete = (id: string) => {
    onChange(services.filter(s => s.id !== id));
    setDeleteConfirm(null);
  };

  const toggleActive = (id: string) => {
    onChange(services.map(s => s.id === id ? { ...s, actif: !s.actif } : s));
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const arr = [...services];
    [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
    onChange(arr);
  };

  const moveDown = (idx: number) => {
    if (idx === services.length - 1) return;
    const arr = [...services];
    [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
    onChange(arr);
  };

  return (
    <div style={{ paddingBottom: 20 }}>
      {/* Add button */}
      <button
        onClick={() => { setEditingService(null); setEditorOpen(true); }}
        style={{
          width: '100%', padding: '14px', borderRadius: 14,
          border: '2px dashed rgba(242,208,107,0.4)', background: 'transparent',
          color: 'var(--gold)', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 16,
        }}
      >
        + Ajouter un service
      </button>

      {/* Count */}
      <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 12 }}>
        {services.length} service{services.length !== 1 ? 's' : ''}
      </div>

      {/* List */}
      {services.map((svc, idx) => (
        <div key={svc.id} style={{ background: 'var(--d2)', borderRadius: 14, padding: '14px', marginBottom: 10, opacity: svc.actif ? 1 : 0.5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Reorder */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <button onClick={() => moveUp(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t4)', padding: '2px 4px', fontSize: 10 }}>▲</button>
              <button onClick={() => moveDown(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t4)', padding: '2px 4px', fontSize: 10 }}>▼</button>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>{svc.name}</span>
                {svc.badge && (
                  <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--gold)', background: 'rgba(242,208,107,0.12)', borderRadius: 6, padding: '2px 6px' }}>{svc.badge.toUpperCase()}</span>
                )}
              </div>
              <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>
                <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{svc.prix} CHF</span>
                <span style={{ margin: '0 6px' }}>·</span>
                {svc.duree} min
              </div>
            </div>
            {/* Toggle */}
            <button
              onClick={() => toggleActive(svc.id)}
              style={{
                width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer',
                background: svc.actif ? 'var(--flash)' : 'var(--d4)', position: 'relative', flexShrink: 0,
              }}
            >
              <div style={{ position: 'absolute', top: 2, left: svc.actif ? 20 : 2, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.3s' }} />
            </button>
            {/* Edit */}
            <button
              onClick={() => { setEditingService(svc); setEditorOpen(true); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', padding: '4px 6px', fontSize: 13 }}
            >
              Editer
            </button>
            {/* Delete */}
            {deleteConfirm === svc.id ? (
              <button
                onClick={() => handleDelete(svc.id)}
                style={{ background: 'var(--alert)', border: 'none', cursor: 'pointer', color: '#fff', padding: '4px 8px', borderRadius: 8, fontSize: 11, fontWeight: 700 }}
              >
                Confirmer
              </button>
            ) : (
              <button
                onClick={() => setDeleteConfirm(svc.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--alert)', padding: '4px 6px', fontSize: 13 }}
              >
                X
              </button>
            )}
          </div>
        </div>
      ))}

      <ServiceEditor
        open={editorOpen}
        onClose={() => { setEditorOpen(false); setEditingService(null); }}
        service={editingService}
        onSaved={handleSave}
      />
    </div>
  );
}
