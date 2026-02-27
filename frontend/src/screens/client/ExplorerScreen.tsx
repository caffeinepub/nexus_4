import React, { useState, useEffect } from 'react';
import { GlobalState, Screen, ToastType, ProDemo } from '../../state/useAppState';
import Header from '../../components/Header';
import TabBarClient from '../../components/TabBarClient';

interface Props {
  state: GlobalState;
  go: (screen: Screen) => void;
  update: (partial: Partial<GlobalState>) => void;
  showToast: (message: string, type?: ToastType) => void;
}

const PROS_DEMO: ProDemo[] = [
  {
    id: 'p1', name: 'Sophie Laurent', categorie: 'Coiffure', ville: 'Geneve',
    rating: 4.9, reviewCount: 127, prix: 65,
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=80',
    bio: 'Coiffeuse professionnelle avec 10 ans d\'experience.',
    services: [
      { id: 's1', name: 'Coupe femme', duree: 60, prix: 65, description: 'Coupe et brushing', actif: true },
      { id: 's2', name: 'Coloration', duree: 120, prix: 120, description: 'Coloration complete', actif: true },
    ],
    distance: '1.2 km', flash: true, available: true,
    modeTravail: 'domicile', phone: '+41791234567', email: 'sophie@nexus.ch',
    adresse: 'Rue de Rive 12, Geneve', photos: [],
    reviews: [
      { author: 'Marie D.', note: 5, comment: 'Excellente coiffeuse!', date: '15 jan 2026' },
      { author: 'Julie M.', note: 5, comment: 'Super resultat.', date: '8 jan 2026' },
      { author: 'Claire B.', note: 4.8, comment: 'Tres satisfaite.', date: '2 jan 2026' },
    ],
  },
  {
    id: 'p2', name: 'Amina Benali', categorie: 'Esthetique', ville: 'Lausanne',
    rating: 4.8, reviewCount: 89, prix: 80,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80',
    bio: 'Estheticienne certifiee, specialiste en soins du visage.',
    services: [
      { id: 's1', name: 'Soin visage', duree: 60, prix: 80, description: 'Soin hydratant complet', actif: true },
      { id: 's2', name: 'Epilation jambes', duree: 45, prix: 55, description: 'Epilation a la cire', actif: true },
    ],
    distance: '2.5 km', flash: false, available: true,
    modeTravail: 'both', phone: '+41798765432', email: 'amina@nexus.ch',
    adresse: 'Avenue de la Gare 5, Lausanne', photos: [],
    reviews: [
      { author: 'Sarah K.', note: 5, comment: 'Soin du visage incroyable!', date: '20 jan 2026' },
      { author: 'Nadia R.', note: 4.8, comment: 'Tres professionnelle.', date: '12 jan 2026' },
      { author: 'Leila M.', note: 4.7, comment: 'Je reviendrai.', date: '5 jan 2026' },
    ],
  },
  {
    id: 'p3', name: 'Chloe Martin', categorie: 'Onglerie', ville: 'Zurich',
    rating: 4.9, reviewCount: 203, prix: 55,
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80',
    bio: 'Nail artist passionnee, creations uniques et durables.',
    services: [
      { id: 's1', name: 'Pose gel', duree: 75, prix: 75, description: 'Pose complete gel UV', actif: true },
      { id: 's2', name: 'Nail art', duree: 90, prix: 90, description: 'Decoration personnalisee', actif: true },
    ],
    distance: '0.8 km', flash: true, available: true,
    modeTravail: 'domicile', phone: '+41791111222', email: 'chloe@nexus.ch',
    adresse: 'Bahnhofstrasse 20, Zurich', photos: [],
    reviews: [
      { author: 'Emma S.', note: 5, comment: 'Nail art magnifique!', date: '18 jan 2026' },
      { author: 'Lena W.', note: 5, comment: 'Parfait comme toujours.', date: '10 jan 2026' },
      { author: 'Anna P.', note: 4.9, comment: 'Tres propre et professionnel.', date: '3 jan 2026' },
    ],
  },
  {
    id: 'p4', name: 'Fatima Ouali', categorie: 'Massage', ville: 'Berne',
    rating: 5.0, reviewCount: 56, prix: 90,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80',
    bio: 'Masseuse therapeutique certifiee.',
    services: [
      { id: 's1', name: 'Massage suedois', duree: 60, prix: 90, description: 'Massage relaxant complet', actif: true },
      { id: 's2', name: 'Shiatsu', duree: 75, prix: 110, description: 'Massage energetique japonais', actif: true },
    ],
    distance: '3.1 km', flash: false, available: true,
    modeTravail: 'domicile', phone: '+41793333444', email: 'fatima@nexus.ch',
    adresse: 'Marktgasse 8, Berne', photos: [],
    reviews: [
      { author: 'Thomas B.', note: 5, comment: 'Massage exceptionnel!', date: '22 jan 2026' },
      { author: 'Pierre L.', note: 5, comment: 'Professionnel et efficace.', date: '14 jan 2026' },
      { author: 'Marc D.', note: 5, comment: 'Le meilleur massage.', date: '7 jan 2026' },
    ],
  },
  {
    id: 'p5', name: 'Isabelle Dupont', categorie: 'Maquillage', ville: 'Geneve',
    rating: 4.7, reviewCount: 74, prix: 70,
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80',
    bio: 'Maquilleuse professionnelle pour mariages et evenements.',
    services: [
      { id: 's1', name: 'Maquillage mariage', duree: 90, prix: 150, description: 'Maquillage longue tenue', actif: true },
      { id: 's2', name: 'Maquillage soiree', duree: 60, prix: 80, description: 'Look glamour pour soiree', actif: true },
    ],
    distance: '1.8 km', flash: false, available: true,
    modeTravail: 'both', phone: '+41795555666', email: 'isabelle@nexus.ch',
    adresse: 'Rue du Rhone 30, Geneve', photos: [],
    reviews: [
      { author: 'Camille R.', note: 5, comment: 'Maquillage parfait pour mon mariage!', date: '19 jan 2026' },
      { author: 'Lucie V.', note: 4.8, comment: 'Tres talentueuse.', date: '11 jan 2026' },
      { author: 'Alice M.', note: 4.5, comment: 'Bon travail.', date: '4 jan 2026' },
    ],
  },
  {
    id: 'p6', name: 'Nadia Rousseau', categorie: 'Coiffure', ville: 'Lausanne',
    rating: 4.8, reviewCount: 112, prix: 75,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80',
    bio: 'Coiffeuse specialisee en cheveux afro et textures.',
    services: [
      { id: 's1', name: 'Tresses africaines', duree: 180, prix: 120, description: 'Tresses box braids', actif: true },
      { id: 's2', name: 'Soin capillaire', duree: 60, prix: 75, description: 'Soin hydratant profond', actif: true },
    ],
    distance: '4.2 km', flash: true, available: false,
    modeTravail: 'domicile', phone: '+41797777888', email: 'nadia@nexus.ch',
    adresse: 'Place de la Riponne 3, Lausanne', photos: [],
    reviews: [
      { author: 'Aisha K.', note: 5, comment: 'Tresses magnifiques!', date: '21 jan 2026' },
      { author: 'Fatou D.', note: 4.9, comment: 'Tres professionnelle.', date: '13 jan 2026' },
      { author: 'Mariam S.', note: 4.8, comment: 'Excellent travail.', date: '6 jan 2026' },
    ],
  },
];

const FILTERS = ['Tous', 'Coiffure', 'Esthetique', 'Massage', 'Onglerie', 'Maquillage'];
const CITIES = ['Toutes', 'Geneve', 'Lausanne', 'Zurich', 'Berne', 'Bale', 'Lucerne'];

const CATEGORY_COLORS: Record<string, string> = {
  Coiffure: '#F2D06B',
  Esthetique: '#FF3D5A',
  Massage: '#00D97A',
  Onglerie: '#5B7FFF',
  Maquillage: '#FF8C42',
};

export default function ExplorerScreen({ state, go, update, showToast }: Props) {
  const [filter, setFilter] = useState('Tous');
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('Toutes');
  const [shimmer, setShimmer] = useState(true);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShimmer(false), 800);
    return () => clearTimeout(t);
  }, []);

  const filtered = PROS_DEMO.filter(p => {
    const matchFilter = filter === 'Tous' || p.categorie === filter;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.categorie.toLowerCase().includes(search.toLowerCase());
    const matchCity = city === 'Toutes' || p.ville === city;
    return matchFilter && matchSearch && matchCity;
  });

  const flashPros = filtered.filter(p => p.flash && p.available);
  const notifsCount = state.notifications.filter(n => !n.read).length;

  const handleLocate = () => {
    setLocating(true);
    navigator.geolocation?.getCurrentPosition(
      () => { setLocating(false); showToast('Localisation activee', 'success'); },
      () => { setLocating(false); showToast('Localisation non disponible', 'error'); }
    );
  };

  const handleProClick = (pro: ProDemo) => {
    update({ selectedPro: pro });
    go('fiche_pro');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: '#050507' }}>
      <Header
        role="client"
        onSwitchRole={() => { update({ role: 'pro' }); go('pro_dashboard'); }}
        onNotifs={() => update({ notifsOpen: true })}
        notifsCount={notifsCount}
        onLogoClick={() => go('explorer')}
      />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any, overscrollBehavior: 'contain', paddingTop: 56 }}>
        {/* Hero */}
        <div style={{ padding: '20px 20px 16px' }}>
          <h1 style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(28px, 7vw, 40px)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginBottom: 6,
            color: '#F4F4F8',
          }}>
            Trouvez votre<br />
            <span style={{ background: 'linear-gradient(135deg, #F2D06B, #D4A050)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              expert
            </span>
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#9898B4', marginBottom: 16 }}>
            Des professionnels certifies pres de chez vous
          </p>

          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: '#0D0D13', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 999, padding: '0 16px', height: 48, marginBottom: 10,
          }}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#54546C" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un expert..."
              style={{
                flex: 1, background: 'transparent', border: 'none',
                fontFamily: 'Inter, sans-serif', fontSize: 15, color: '#F4F4F8',
                height: '100%', outline: 'none',
              }}
            />
          </div>

          {/* Location + city */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={handleLocate}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 999,
                background: locating ? 'rgba(0,217,122,0.1)' : '#0D0D13',
                border: `1px solid ${locating ? 'rgba(0,217,122,0.3)' : 'rgba(255,255,255,0.08)'}`,
                color: locating ? '#00D97A' : '#9898B4',
                fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, cursor: 'pointer', flexShrink: 0,
              }}
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              Autour de moi
            </button>
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              style={{
                flex: 1, height: 36, background: '#0D0D13',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: 999,
                padding: '0 14px', fontFamily: 'Inter, sans-serif', fontSize: 13,
                color: '#9898B4', cursor: 'pointer', outline: 'none',
              }}
            >
              {CITIES.map(c => <option key={c} value={c} style={{ background: '#0D0D13' }}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 8, padding: '0 20px 16px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                flexShrink: 0, padding: '8px 16px', borderRadius: 999,
                background: filter === f ? 'rgba(242,208,107,0.12)' : '#0D0D13',
                border: filter === f ? '1px solid rgba(242,208,107,0.3)' : '1px solid rgba(255,255,255,0.06)',
                color: filter === f ? '#F2D06B' : '#9898B4',
                fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: filter === f ? 600 : 400,
                cursor: 'pointer', transition: 'all 150ms',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Flash section */}
        {flashPros.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px 12px' }}>
              <div style={{ width: 3, height: 18, background: '#F2D06B', borderRadius: 999 }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 16, color: '#F4F4F8' }}>
                Disponibles maintenant
              </span>
              <span style={{ background: 'rgba(0,217,122,0.1)', color: '#00D97A', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>
                FLASH
              </span>
            </div>
            <div style={{ display: 'flex', gap: 12, padding: '0 20px', overflowX: 'auto', scrollbarWidth: 'none' }}>
              {shimmer ? (
                [1, 2, 3].map(i => (
                  <div key={i} style={{
                    flexShrink: 0, width: 160, height: 220, borderRadius: 18,
                    background: 'linear-gradient(90deg, #0D0D13 25%, #1C1C26 50%, #0D0D13 75%)',
                    backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite',
                  }} />
                ))
              ) : (
                flashPros.map(pro => {
                  const catColor = CATEGORY_COLORS[pro.categorie] || '#5B7FFF';
                  const initials = pro.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                  return (
                    <button
                      key={pro.id}
                      onClick={() => handleProClick(pro)}
                      style={{
                        flexShrink: 0, width: 160, height: 220, borderRadius: 18,
                        background: '#0D0D13', border: '1px solid rgba(255,255,255,0.06)',
                        overflow: 'hidden', cursor: 'pointer', position: 'relative',
                        display: 'flex', flexDirection: 'column', textAlign: 'left',
                        transition: 'transform 150ms',
                      }}
                      onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)'; }}
                      onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
                    >
                      <div style={{
                        flex: 1, background: `linear-gradient(135deg, ${catColor}22, ${catColor}08)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 36, fontWeight: 900, color: catColor,
                      }}>
                        {initials}
                      </div>
                      <div style={{
                        position: 'absolute', top: 10, right: 10,
                        background: 'rgba(0,217,122,0.9)', borderRadius: 999,
                        padding: '3px 8px', fontSize: 10, fontWeight: 700, color: '#050507',
                      }}>
                        FLASH
                      </div>
                      <div style={{ padding: '10px 12px 12px' }}>
                        <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 13, color: '#F4F4F8', marginBottom: 2 }}>
                          {pro.name}
                        </div>
                        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#54546C', marginBottom: 6 }}>{pro.categorie}</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <svg width={11} height={11} viewBox="0 0 24 24" fill="#F2D06B" stroke="none">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, color: '#F4F4F8' }}>{pro.rating}</span>
                          </div>
                          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, color: '#F2D06B' }}>{pro.prix} CHF</span>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* All pros */}
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 3, height: 18, background: '#F2D06B', borderRadius: 999 }} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 16, color: '#F4F4F8' }}>
              Experts pour vous
            </span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#54546C' }}>({filtered.length})</span>
          </div>

          {shimmer ? (
            [1, 2, 3].map(i => (
              <div key={i} style={{
                height: 88, borderRadius: 16, marginBottom: 10,
                background: 'linear-gradient(90deg, #0D0D13 25%, #1C1C26 50%, #0D0D13 75%)',
                backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite',
              }} />
            ))
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#54546C', fontFamily: 'Inter, sans-serif', fontSize: 14 }}>
              Aucun expert trouve pour ces criteres
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map(pro => {
                const catColor = CATEGORY_COLORS[pro.categorie] || '#5B7FFF';
                const initials = pro.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                return (
                  <button
                    key={pro.id}
                    onClick={() => handleProClick(pro)}
                    style={{
                      background: '#0D0D13', border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 16, padding: '14px 16px',
                      display: 'flex', alignItems: 'center', gap: 14,
                      cursor: 'pointer', textAlign: 'left', transition: 'all 150ms', width: '100%',
                    }}
                    onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.98)'; }}
                    onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
                  >
                    <div style={{
                      width: 52, height: 52, borderRadius: '50%',
                      background: `linear-gradient(135deg, ${catColor}33, ${catColor}11)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20, fontWeight: 900, color: catColor, flexShrink: 0,
                      border: `1px solid ${catColor}22`,
                    }}>
                      {initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 15, color: '#F4F4F8' }}>
                          {pro.name}
                        </span>
                        {pro.flash && (
                          <span style={{ background: 'rgba(0,217,122,0.1)', color: '#00D97A', fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 999 }}>
                            FLASH
                          </span>
                        )}
                      </div>
                      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#9898B4', marginBottom: 4 }}>
                        {pro.categorie} · {pro.ville}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <svg width={12} height={12} viewBox="0 0 24 24" fill="#F2D06B" stroke="none">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600, color: '#F4F4F8' }}>{pro.rating}</span>
                          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#54546C' }}>({pro.reviewCount})</span>
                        </div>
                        {pro.distance && (
                          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#54546C' }}>{pro.distance}</span>
                        )}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 15, color: '#F2D06B', marginBottom: 4 }}>
                        {pro.prix} CHF
                      </div>
                      <div style={{
                        fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 600,
                        padding: '3px 8px', borderRadius: 999,
                        color: pro.available ? '#00D97A' : '#54546C',
                        background: pro.available ? 'rgba(0,217,122,0.1)' : 'rgba(84,84,108,0.1)',
                      }}>
                        {pro.available ? 'Dispo' : 'Occupe'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ height: 16 }} />
      </div>

      <TabBarClient current="explorer" go={go} notifsCount={notifsCount} />
    </div>
  );
}
