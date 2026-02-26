import React, { useRef, useState } from 'react';
import { useActor } from '../../../hooks/useActor';

interface Props {
  photos: string[];
  onChange: (photos: string[]) => void;
}

const TIPS = [
  'Lumiere naturelle pour des photos nettes',
  'Montrez votre espace de travail propre',
  'Incluez des photos avant/apres',
  'Sourire et contact visuel avec le client',
];

export default function TabGalerie({ photos, onChange }: Props) {
  const fileRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const [uploading, setUploading] = useState<number | null>(null);
  const { actor } = useActor();

  const handleFile = (idx: number, file: File) => {
    setUploading(idx);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      const newPhotos = [...photos];
      newPhotos[idx] = dataUrl;
      onChange(newPhotos);
      setUploading(null);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = (idx: number) => {
    const newPhotos = [...photos];
    newPhotos[idx] = '';
    onChange(newPhotos.filter((_, i) => i !== idx).concat(['']));
  };

  const count = photos.filter(p => p && p.length > 0).length;
  const progress = (count / 4) * 100;

  return (
    <div style={{ paddingBottom: 20 }}>
      {/* Counter + bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--t2)' }}>Photos</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: count >= 3 ? 'var(--flash)' : 'var(--gold)' }}>{count}/4</span>
        </div>
        <div style={{ height: 4, background: 'var(--d3)', borderRadius: 2 }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, var(--gold), var(--flash))', borderRadius: 2, transition: 'width 0.4s' }} />
        </div>
        {count < 3 && (
          <div style={{ fontSize: 12, color: 'var(--alert)', marginTop: 8, fontWeight: 600 }}>
            3 photos minimum requises
          </div>
        )}
      </div>

      {/* Tips */}
      <div style={{ background: 'var(--d2)', borderRadius: 14, padding: '14px', marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10 }}>Conseils photo</div>
        {TIPS.map((tip, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: i < TIPS.length - 1 ? 8 : 0 }}>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--gold)', marginTop: 6, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.5 }}>{tip}</span>
          </div>
        ))}
      </div>

      {/* Grid 2x2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        {[0, 1, 2, 3].map(idx => {
          const photo = photos[idx];
          const hasPhoto = photo && photo.length > 0;
          return (
            <div key={idx} style={{ position: 'relative', aspectRatio: '1', borderRadius: 14, overflow: 'visible' }}>
              {idx === 0 && (
                <div style={{ position: 'absolute', top: -8, left: 8, zIndex: 2, background: 'var(--gold)', color: '#050507', fontSize: 9, fontWeight: 800, borderRadius: 6, padding: '3px 8px', letterSpacing: 0.5 }}>
                  COUVERTURE
                </div>
              )}
              {hasPhoto ? (
                <div style={{ width: '100%', height: '100%', borderRadius: 14, overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={photo}
                    alt={`Photo ${idx + 1}`}
                    onError={e => { (e.target as HTMLImageElement).src = ''; }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <button
                    onClick={() => removePhoto(idx)}
                    style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    X
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileRefs[idx].current?.click()}
                  disabled={uploading === idx}
                  style={{
                    width: '100%', height: '100%', borderRadius: 14, border: '2px dashed rgba(242,208,107,0.4)',
                    background: 'var(--d2)', cursor: 'pointer', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  {uploading === idx ? (
                    <div style={{ fontSize: 12, color: 'var(--t3)' }}>Chargement...</div>
                  ) : (
                    <>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(242,208,107,0.5)" strokeWidth="1.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                      <span style={{ fontSize: 11, color: 'rgba(242,208,107,0.5)' }}>Ajouter</span>
                    </>
                  )}
                </button>
              )}
              <input
                ref={fileRefs[idx]}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(idx, f); }}
              />
            </div>
          );
        })}
      </div>

      {/* Preview card */}
      {count > 0 && (
        <div style={{ background: 'var(--d2)', borderRadius: 14, padding: '14px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10 }}>Apercu Explorer</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {photos[0] && (
              <img
                src={photos[0]}
                alt="Cover"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }}
              />
            )}
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>Votre profil</div>
              <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>{count} photo{count > 1 ? 's' : ''}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
