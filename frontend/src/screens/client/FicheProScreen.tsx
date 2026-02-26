import React, { useEffect, useState } from 'react';
import { Screen, GlobalState } from '../../state/useAppState';

interface FicheProScreenProps {
  go: (screen: Screen) => void;
  state: GlobalState;
  update: (partial: Partial<GlobalState>) => void;
}

function StarIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="#C9A84C" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 1l1.39 2.82L10.5 4.27l-2.25 2.19.53 3.09L6 8.02 3.22 9.55l.53-3.09L1.5 4.27l3.11-.45L6 1z"/>
    </svg>
  );
}

function BackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F4F4F8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5"/>
      <path d="m12 19-7-7 7-7"/>
    </svg>
  );
}

function FlashBadge() {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: 'linear-gradient(135deg, #C9A84C, #E8C96D)',
      borderRadius: 8, padding: '4px 10px',
      fontSize: 11, fontWeight: 700, color: '#050507',
      letterSpacing: '0.05em'
    }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="#050507"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
      FLASH
    </div>
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  Barber: '#4A9EFF',
  Coiffure: '#A855F7',
  Esthetique: '#EC4899',
  Massage: '#10B981',
  Onglerie: '#F59E0B',
  Maquillage: '#EF4444',
};

export default function FicheProScreen({ go, state, update }: FicheProScreenProps) {
  const pro = state.selectedPro;
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!pro) {
      go('explorer');
    }
  }, [pro, go]);

  if (!pro) return null;

  const catColor = CATEGORY_COLORS[pro.categorie] || '#C9A84C';

  const mockServices = [
    { name: 'Coupe classique', duree: 30, prix: pro.prix },
    { name: 'Coupe + barbe', duree: 45, prix: Math.round(pro.prix * 1.4) },
    { name: 'Rasage traditionnel', duree: 30, prix: Math.round(pro.prix * 0.8) },
  ];

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      background: '#050507',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Scrollable content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
      }}>
        {/* Cover image */}
        <div style={{
          position: 'relative',
          height: 320,
          background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D4E 100%)',
          flexShrink: 0,
        }}>
          {!imgError ? (
            <img
              src={pro.image}
              alt={pro.prenom}
              onError={() => setImgError(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: `linear-gradient(135deg, #1A1A2E 0%, ${catColor}33 50%, #1A1A2E 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 64, fontWeight: 900, color: catColor, opacity: 0.4,
            }}>
              {pro.prenom[0]}
            </div>
          )}
          {/* Gradient overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(5,5,7,0.4) 0%, transparent 40%, rgba(5,5,7,0.8) 100%)'
          }} />
          {/* Back button */}
          <button
            onClick={() => go('explorer')}
            style={{
              position: 'absolute', top: 16, left: 16,
              width: 40, height: 40, borderRadius: 12,
              background: 'rgba(5,5,7,0.7)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <BackIcon />
          </button>
          {/* Flash badge */}
          {pro.flash && (
            <div style={{ position: 'absolute', top: 16, right: 16 }}>
              <FlashBadge />
            </div>
          )}
        </div>

        {/* Pro info */}
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
            <div>
              <h1 style={{
                fontSize: 26, fontWeight: 900, color: '#F4F4F8',
                margin: 0, marginBottom: 4, lineHeight: 1.1
              }}>
                {pro.prenom}
              </h1>
              <div style={{ fontSize: 14, color: '#A0A0B8', marginBottom: 8 }}>
                {pro.nom}
              </div>
            </div>
            <div style={{
              padding: '6px 14px', borderRadius: 20,
              background: `${catColor}22`,
              border: `1px solid ${catColor}44`,
              fontSize: 12, fontWeight: 700, color: catColor,
            }}>
              {pro.categorie}
            </div>
          </div>

          {/* Stats row */}
          <div style={{
            display: 'flex', gap: 20, marginBottom: 20,
            padding: '14px 0',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
                <StarIcon size={14} />
                <span style={{ fontSize: 18, fontWeight: 800, color: '#C9A84C' }}>{pro.note}</span>
              </div>
              <div style={{ fontSize: 11, color: '#54546C', marginTop: 2 }}>{pro.nbAvis} avis</div>
            </div>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.06)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#F4F4F8' }}>{pro.reponsMin}min</div>
              <div style={{ fontSize: 11, color: '#54546C', marginTop: 2 }}>Reponse moy.</div>
            </div>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.06)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#F4F4F8' }}>{pro.ville}</div>
              <div style={{ fontSize: 11, color: '#54546C', marginTop: 2 }}>Ville</div>
            </div>
          </div>

          {/* Services */}
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#F4F4F8', marginBottom: 12 }}>
              Services
            </h2>
            {mockServices.map((service, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 16px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 12,
                  marginBottom: 8,
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#F4F4F8', marginBottom: 3 }}>
                    {service.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#54546C' }}>{service.duree} min</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#C9A84C' }}>
                  {service.prix} CHF
                </div>
              </div>
            ))}
          </div>

          {/* About */}
          <div style={{ marginBottom: 100 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#F4F4F8', marginBottom: 10 }}>
              A propos
            </h2>
            <p style={{ fontSize: 14, color: '#A0A0B8', lineHeight: 1.6, margin: 0 }}>
              Expert {pro.categorie.toLowerCase()} base a {pro.ville}, {pro.prenom} propose des prestations
              de qualite avec une disponibilite rapide. Note moyenne de {pro.note}/5 sur {pro.nbAvis} avis clients.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky booking CTA */}
      <div style={{
        flexShrink: 0,
        padding: '16px 20px',
        background: 'rgba(5,5,7,0.96)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
      }}>
        <button
          onClick={() => go('booking_1')}
          style={{
            width: '100%',
            height: 56,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #C9A84C, #E8C96D)',
            border: 'none',
            fontSize: 16, fontWeight: 800,
            color: '#050507',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '0.02em',
          }}
        >
          Reserver maintenant — {pro.prix} CHF
        </button>
      </div>
    </div>
  );
}
