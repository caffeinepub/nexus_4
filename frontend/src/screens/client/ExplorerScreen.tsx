import React, { useState } from 'react';
import { Screen, GlobalState, ProDemo } from '../../state/useAppState';

const PROS_DEMO: ProDemo[] = [
  {
    id: '1',
    prenom: 'Alexandre',
    nom: 'Studio Blade',
    categorie: 'Barber',
    ville: 'Geneve',
    note: 4.9,
    nbAvis: 127,
    prix: 35,
    flash: true,
    reponsMin: 8,
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=500&fit=crop&q=80'
  },
  {
    id: '2',
    prenom: 'Karim',
    nom: 'Karim Cuts',
    categorie: 'Barber',
    ville: 'Lausanne',
    note: 4.8,
    nbAvis: 89,
    prix: 40,
    flash: true,
    reponsMin: 12,
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=500&fit=crop&q=80'
  },
  {
    id: '3',
    prenom: 'Elise',
    nom: 'Elise Coiffure',
    categorie: 'Coiffure',
    ville: 'Geneve',
    note: 4.9,
    nbAvis: 203,
    prix: 55,
    flash: false,
    reponsMin: 25,
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=500&fit=crop&q=80'
  },
  {
    id: '4',
    prenom: 'Nadia',
    nom: 'Nadia Beauty',
    categorie: 'Esthetique',
    ville: 'Lausanne',
    note: 4.7,
    nbAvis: 156,
    prix: 70,
    flash: true,
    reponsMin: 5,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=500&fit=crop&q=80'
  },
  {
    id: '5',
    prenom: 'Marco',
    nom: 'Zen by Marco',
    categorie: 'Massage',
    ville: 'Berne',
    note: 4.8,
    nbAvis: 94,
    prix: 80,
    flash: false,
    reponsMin: 30,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=500&fit=crop&q=80'
  },
  {
    id: '6',
    prenom: 'Clara',
    nom: 'Clara Nails',
    categorie: 'Esthetique',
    ville: 'Geneve',
    note: 4.6,
    nbAvis: 78,
    prix: 40,
    flash: true,
    reponsMin: 15,
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=500&fit=crop&q=80'
  }
];

const FILTERS = ['Tous', 'Flash', 'Barber', 'Coiffure', 'Esthetique', 'Massage'];

interface ExplorerScreenProps {
  go: (screen: Screen) => void;
  state: GlobalState;
  update: (partial: Partial<GlobalState>) => void;
}

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="#C9A84C" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 1l1.39 2.82L10.5 4.27l-2.25 2.19.53 3.09L6 8.02 3.22 9.55l.53-3.09L1.5 4.27l3.11-.45L6 1z"/>
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#54546C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.35-4.35"/>
    </svg>
  );
}

function BellIcon({ count }: { count: number }) {
  return (
    <div style={{ position: 'relative', cursor: 'pointer' }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F4F4F8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
      {count > 0 && (
        <div style={{
          position: 'absolute', top: -4, right: -4,
          width: 16, height: 16, borderRadius: '50%',
          background: '#FF3D5A',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 9, fontWeight: 700, color: '#fff'
        }}>
          {count}
        </div>
      )}
    </div>
  );
}

function FlashBadge() {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      background: 'linear-gradient(135deg, #C9A84C, #E8C96D)',
      borderRadius: 6, padding: '2px 6px',
      fontSize: 9, fontWeight: 700, color: '#050507',
      letterSpacing: '0.05em'
    }}>
      <svg width="8" height="8" viewBox="0 0 24 24" fill="#050507"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
      FLASH
    </div>
  );
}

function ProCardHorizontal({ pro, onPress }: { pro: ProDemo; onPress: () => void }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={onPress}
      style={{
        width: 168, minWidth: 168, height: 228,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        background: 'linear-gradient(135deg, #1A1A2E, #16213E)',
        flexShrink: 0,
      }}
    >
      {!imgError ? (
        <img
          src={pro.image}
          alt={pro.prenom}
          onError={(e) => { e.currentTarget.style.display = 'none'; setImgError(true); }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <div style={{
          width: '100%', height: '100%',
          background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D4E 50%, #1A1A2E 100%)'
        }} />
      )}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(5,5,7,0.92) 0%, rgba(5,5,7,0.3) 50%, transparent 100%)'
      }} />
      {pro.flash && (
        <div style={{ position: 'absolute', top: 10, left: 10 }}>
          <FlashBadge />
        </div>
      )}
      <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#F4F4F8', marginBottom: 2 }}>
          {pro.prenom}
        </div>
        <div style={{ fontSize: 11, color: '#A0A0B8', marginBottom: 6 }}>
          {pro.categorie} · {pro.ville}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <StarIcon />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#C9A84C' }}>{pro.note}</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#F4F4F8' }}>dès {pro.prix} CHF</span>
        </div>
      </div>
    </div>
  );
}

function ProCardVertical({ pro, onPress }: { pro: ProDemo; onPress: () => void }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={onPress}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 0',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        cursor: 'pointer',
      }}
    >
      <div style={{
        width: 64, height: 64, borderRadius: 14,
        overflow: 'hidden', flexShrink: 0,
        background: 'linear-gradient(135deg, #1A1A2E, #2D2D4E)'
      }}>
        {!imgError ? (
          <img
            src={pro.image}
            alt={pro.prenom}
            onError={(e) => { e.currentTarget.style.display = 'none'; setImgError(true); }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D4E 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, color: '#C9A84C', fontWeight: 700
          }}>
            {pro.prenom[0]}
          </div>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#F4F4F8' }}>{pro.prenom}</span>
          {pro.flash && <FlashBadge />}
        </div>
        <div style={{ fontSize: 12, color: '#A0A0B8', marginBottom: 4 }}>
          {pro.categorie} · {pro.ville}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <StarIcon />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#C9A84C' }}>{pro.note}</span>
            <span style={{ fontSize: 11, color: '#54546C' }}>({pro.nbAvis})</span>
          </div>
          <span style={{ fontSize: 11, color: '#54546C' }}>·</span>
          <span style={{ fontSize: 11, color: '#54546C' }}>Rep. {pro.reponsMin}min</span>
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#F4F4F8' }}>{pro.prix} CHF</div>
        <div style={{ fontSize: 11, color: '#54546C' }}>/ séance</div>
      </div>
    </div>
  );
}

export default function ExplorerScreen({ go, state, update }: ExplorerScreenProps) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tous');

  const allPros = PROS_DEMO;

  const filteredPros = allPros.filter(pro => {
    const matchSearch = search === '' ||
      pro.prenom.toLowerCase().includes(search.toLowerCase()) ||
      pro.nom.toLowerCase().includes(search.toLowerCase()) ||
      pro.categorie.toLowerCase().includes(search.toLowerCase()) ||
      pro.ville.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      activeFilter === 'Tous' ? true :
      activeFilter === 'Flash' ? pro.flash :
      pro.categorie.toLowerCase() === activeFilter.toLowerCase();

    return matchSearch && matchFilter;
  });

  const flashPros = filteredPros.filter(p => p.flash);
  const allFiltered = filteredPros;

  const handleProPress = (pro: ProDemo) => {
    update({ selectedPro: pro });
    go('fiche_pro');
  };

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
      {/* Header - absolute top */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 56,
        zIndex: 100,
        background: 'rgba(5,5,7,0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{
            fontSize: 20, fontWeight: 900, color: '#F4F4F8',
            letterSpacing: '-0.03em'
          }}>NEXUS</span>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#4A9EFF', display: 'inline-block', marginBottom: 8
          }} />
        </div>

        {/* Right: switch pill + notifs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {state.role === 'client' && (
            <button
              onClick={() => go('pro_dashboard')}
              style={{
                padding: '5px 14px',
                borderRadius: 20,
                border: '1.5px solid #C9A84C',
                background: 'transparent',
                color: '#C9A84C',
                fontSize: 12, fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '0.04em',
              }}
            >
              Pro
            </button>
          )}
          <BellIcon count={state.notifCount} />
        </div>
      </div>

      {/* Scrollable content zone */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch' as any,
        paddingTop: 72,
        paddingBottom: 16,
      }}>
        {/* Hero */}
        <div style={{ padding: '24px 20px 0' }}>
          <h1 style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 900,
            fontSize: 36,
            color: '#F4F4F8',
            lineHeight: 1.1,
            margin: 0,
            marginBottom: 6,
          }}>
            Trouvez votre<br />expert
          </h1>
          <p style={{ fontSize: 14, color: '#54546C', margin: 0, marginBottom: 20 }}>
            Réservez en quelques secondes
          </p>

          {/* Search bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            height: 58,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            padding: '0 18px',
            marginBottom: 20,
          }}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Barber, coiffure, massage..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: 15,
                color: '#F4F4F8',
                fontFamily: 'Inter, sans-serif',
              }}
            />
          </div>

          {/* Filter pills */}
          <div style={{
            display: 'flex', gap: 8,
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch' as any,
            paddingBottom: 4,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          } as React.CSSProperties}>
            {FILTERS.map(filter => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  style={{
                    flexShrink: 0,
                    padding: '8px 16px',
                    borderRadius: 20,
                    border: isActive ? 'none' : '1px solid rgba(255,255,255,0.12)',
                    background: isActive
                      ? 'linear-gradient(135deg, #C9A84C, #E8C96D)'
                      : 'rgba(255,255,255,0.04)',
                    color: isActive ? '#050507' : '#A0A0B8',
                    fontSize: 13, fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {filteredPros.length === 0 ? (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '60px 20px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            fontSize: 14,
            color: '#54546C',
          }}>
            Aucun expert disponible
          </div>
        ) : (
          <>
            {/* Flash section - horizontal scroll */}
            {flashPros.length > 0 && (
              <div style={{ marginTop: 28 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0 20px', marginBottom: 14
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#C9A84C"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#F4F4F8' }}>Disponibles maintenant</span>
                  </div>
                  <span style={{ fontSize: 12, color: '#C9A84C', fontWeight: 600 }}>
                    {flashPros.length} expert{flashPros.length > 1 ? 's' : ''}
                  </span>
                </div>
                <div style={{
                  display: 'flex', gap: 12,
                  overflowX: 'auto',
                  WebkitOverflowScrolling: 'touch' as any,
                  padding: '0 20px 8px',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                } as React.CSSProperties}>
                  {flashPros.map(pro => (
                    <ProCardHorizontal
                      key={pro.id}
                      pro={pro}
                      onPress={() => handleProPress(pro)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All experts - vertical list */}
            <div style={{ padding: '0 20px', marginTop: 28 }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 4
              }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#F4F4F8' }}>
                  Experts pour vous
                </span>
                <span style={{ fontSize: 12, color: '#54546C' }}>
                  {allFiltered.length} résultat{allFiltered.length > 1 ? 's' : ''}
                </span>
              </div>
              {allFiltered.map(pro => (
                <ProCardVertical
                  key={pro.id}
                  pro={pro}
                  onPress={() => handleProPress(pro)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Tab bar - in natural flex flow, never fixed */}
      <div style={{ flexShrink: 0 }}>
        <ClientTabBar
          active="explorer"
          onExplorerClick={() => go('explorer')}
          onReservationsClick={() => go('client_reservations')}
          onAlertesClick={() => go('client_alertes')}
          onProfilClick={() => go('client_profil')}
        />
      </div>
    </div>
  );
}

interface ClientTabBarProps {
  active: string;
  onExplorerClick: () => void;
  onReservationsClick: () => void;
  onAlertesClick: () => void;
  onProfilClick: () => void;
}

function ClientTabBar({ active, onExplorerClick, onReservationsClick, onAlertesClick, onProfilClick }: ClientTabBarProps) {
  const tabs = [
    {
      key: 'explorer',
      label: 'Explorer',
      onClick: onExplorerClick,
      icon: (color: string) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
      ),
    },
    {
      key: 'reservations',
      label: 'Réservations',
      onClick: onReservationsClick,
      icon: (color: string) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
    },
    {
      key: 'alertes',
      label: 'Alertes',
      onClick: onAlertesClick,
      icon: (color: string) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      ),
    },
    {
      key: 'profil',
      label: 'Profil',
      onClick: onProfilClick,
      icon: (color: string) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ),
    },
  ];

  return (
    <div style={{
      display: 'flex',
      background: 'rgba(5,5,7,0.96)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    }}>
      {tabs.map(tab => {
        const isActive = active === tab.key;
        const color = isActive ? '#C9A84C' : '#54546C';
        return (
          <button
            key={tab.key}
            onClick={tab.onClick}
            style={{
              flex: 1,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '10px 0 8px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            {isActive && (
              <div style={{
                position: 'absolute', top: 0, left: '50%',
                transform: 'translateX(-50%)',
                width: 32, height: 2,
                background: 'linear-gradient(90deg, #C9A84C, #E8C96D)',
                borderRadius: '0 0 2px 2px',
              }} />
            )}
            {tab.icon(color)}
            <span style={{
              fontSize: 10, fontWeight: isActive ? 700 : 500,
              color, marginTop: 3,
              fontFamily: 'Inter, sans-serif',
            }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
