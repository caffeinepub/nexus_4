import React, { useEffect, useState } from 'react';
import { GlobalState, Screen, ToastType } from '../../state/useAppState';
import Header from '../../components/Header';
import BtnPrimary from '../../components/BtnPrimary';

interface Props {
  state: GlobalState;
  go: (screen: Screen) => void;
  update: (partial: Partial<GlobalState>) => void;
  showToast: (message: string, type?: ToastType) => void;
}

export default function FicheProScreen({ state, go, update, showToast }: Props) {
  const [counts, setCounts] = useState({ bookings: 0, rating: 0, reviews: 0 });
  const pro = state.selectedPro;

  useEffect(() => {
    if (!pro) { go('explorer'); return; }
    const duration = 1200;
    const steps = 40;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounts({
        bookings: Math.round(progress * 248),
        rating: parseFloat((progress * (pro.rating || 4.9)).toFixed(1)),
        reviews: Math.round(progress * (pro.reviewCount || 127)),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, [pro]);

  if (!pro) return null;

  const initials = pro.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const services = pro.services && pro.services.length > 0 ? pro.services : [
    { id: 's1', name: 'Service standard', duree: 60, prix: pro.prix, description: 'Prestation principale', actif: true },
  ];
  const reviews = pro.reviews && pro.reviews.length > 0 ? pro.reviews : [];

  const handleBook = () => {
    update({
      bookingProId: pro.id,
      bookingServiceId: services[0].id,
      bookingServiceName: services[0].name,
      bookingMontant: services[0].prix,
    });
    go('booking_1');
  };

  const handleServiceBook = (service: typeof services[0]) => {
    update({
      bookingProId: pro.id,
      bookingServiceId: service.id,
      bookingServiceName: service.name,
      bookingMontant: service.prix,
    });
    go('booking_1');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: '#050507' }}>
      <Header showBack onBack={() => go('explorer')} />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any, overscrollBehavior: 'contain', paddingTop: 56 }}>
        {/* Cover */}
        <div style={{
          height: 200, position: 'relative',
          background: 'linear-gradient(135deg, rgba(91,127,255,0.25) 0%, rgba(242,208,107,0.15) 100%)',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 40%, #050507 100%)' }} />
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 72, fontWeight: 900, color: 'rgba(255,255,255,0.1)',
          }}>
            {initials}
          </div>
        </div>

        <div style={{ padding: '0 20px', marginTop: -40, position: 'relative', zIndex: 1 }}>
          {/* Avatar */}
          <div style={{
            width: 76, height: 76, borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(242,208,107,0.2), rgba(242,208,107,0.05))',
            border: '3px solid #050507', outline: '2px solid #F2D06B',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 900, color: '#F2D06B', marginBottom: 12,
          }}>
            {initials}
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
            <div>
              <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: 22, fontWeight: 800, color: '#F4F4F8', margin: 0, letterSpacing: '-0.02em' }}>
                {pro.name}
              </h1>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#9898B4', margin: '4px 0 0' }}>{pro.categorie}</p>
            </div>
            <div style={{
              background: pro.available ? 'rgba(0,217,122,0.1)' : 'rgba(84,84,108,0.1)',
              color: pro.available ? '#00D97A' : '#54546C',
              fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600,
              padding: '6px 12px', borderRadius: 999,
              border: `1px solid ${pro.available ? 'rgba(0,217,122,0.2)' : 'rgba(84,84,108,0.2)'}`,
            }}>
              {pro.available ? 'Disponible' : 'Occupe'}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#54546C" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#54546C' }}>{pro.ville}</span>
            {pro.distance && (
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#54546C' }}>· {pro.distance}</span>
            )}
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
            {[
              { label: 'Reservations', value: counts.bookings.toString(), color: '#5B7FFF' },
              { label: 'Note', value: counts.rating.toString(), color: '#F2D06B' },
              { label: 'Avis', value: counts.reviews.toString(), color: '#00D97A' },
            ].map(stat => (
              <div key={stat.label} style={{
                background: '#0D0D13', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 14, padding: '14px 12px', textAlign: 'center',
                borderTop: `2px solid ${stat.color}`,
              }}>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 20, fontWeight: 800, color: stat.color, marginBottom: 2 }}>{stat.value}</div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#54546C' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Bio */}
          {pro.bio && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#F4F4F8' }}>A propos</h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#9898B4', lineHeight: 1.6 }}>{pro.bio}</p>
            </div>
          )}

          {/* Services */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#F4F4F8' }}>Services</h3>
            {services.map(service => (
              <button
                key={service.id}
                onClick={() => handleServiceBook(service)}
                style={{
                  width: '100%', background: '#0D0D13', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 14, padding: '14px 16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: 8, cursor: 'pointer', transition: 'all 150ms', textAlign: 'left',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(242,208,107,0.3)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.06)'; }}
              >
                <div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14, color: '#F4F4F8', marginBottom: 2 }}>{service.name}</div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#54546C' }}>{service.duree} min</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 15, color: '#F2D06B' }}>{service.prix} CHF</span>
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#54546C" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </button>
            ))}
          </div>

          {/* Reviews */}
          {reviews.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#F4F4F8' }}>Avis clients</h3>
              {reviews.map((review, i) => (
                <div key={i} style={{
                  background: '#0D0D13', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 14, padding: '14px 16px', marginBottom: 8,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13, color: '#F4F4F8' }}>{review.author}</span>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {Array.from({ length: Math.round(review.note) }).map((_, j) => (
                        <svg key={j} width={12} height={12} viewBox="0 0 24 24" fill="#F2D06B" stroke="none">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#9898B4', lineHeight: 1.4, margin: 0 }}>{review.comment}</p>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#54546C', marginTop: 4, display: 'block' }}>{review.date}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ height: 80 }} />
        </div>
      </div>

      <div style={{
        flexShrink: 0, padding: '12px 20px calc(12px + env(safe-area-inset-bottom, 8px))',
        background: 'rgba(5,5,7,0.97)', borderTop: '1px solid rgba(255,255,255,0.04)',
      }}>
        <BtnPrimary
          label={`Reserver — a partir de ${services[0].prix} CHF`}
          onClick={handleBook}
          disabled={!pro.available}
        />
      </div>
    </div>
  );
}
