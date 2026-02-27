import React, { useEffect, useState } from 'react';
import { Screen, GlobalState, ToastType } from '../../state/useAppState';
import BtnPrimary from '../../components/BtnPrimary';

interface Props {
  go: (screen: Screen) => void;
  state: GlobalState;
  update: (partial: Partial<GlobalState>) => void;
  showToast: (message: string, type?: ToastType) => void;
  removeToast?: (id: string) => void;
}

const TESTIMONIALS = [
  {
    name: 'Sophie R.',
    role: 'Coiffeuse independante, Lausanne',
    quote: 'En 3 semaines, j\'ai rempli mon agenda. NEXUS a change ma vie professionnelle.',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=80&h=80&fit=crop&crop=face',
  },
  {
    name: 'Karim B.',
    role: 'Barbier, Geneve',
    quote: 'La liberte de travailler a mon rythme, avec des clients qui me trouvent directement.',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=80&h=80&fit=crop&crop=face',
  },
  {
    name: 'Marc T.',
    role: 'Masseur therapeutique, Berne',
    quote: 'Mon reseau a triple en 2 mois. L\'outil indispensable pour tout independant.',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=80&h=80&fit=crop&crop=face',
  },
];

const PILLARS = [
  {
    color: '#F2D06B',
    bgRgb: '242,208,107',
    title: 'Liberte totale',
    desc: 'Travaillez ou vous voulez, quand vous voulez. Votre agenda, vos regles, votre independance.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="#F2D06B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="9 22 9 12 15 12 15 22" stroke="#F2D06B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    color: '#00D97A',
    bgRgb: '0,217,122',
    title: 'Revenus optimises',
    desc: 'Paiements securises via TWINT, zero commission cachee, virement direct sur votre compte.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="5" width="20" height="14" rx="2" stroke="#00D97A" strokeWidth="2"/>
        <path d="M2 10h20" stroke="#00D97A" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    color: '#5B7FFF',
    bgRgb: '91,127,255',
    title: 'Reseau puissant',
    desc: 'Rejoignez 500+ professionnels. Partagez votre profil, invitez des collegues, grandissez ensemble.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="2" stroke="#5B7FFF" strokeWidth="2"/>
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="#5B7FFF" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function ProPitchScreen({ go }: Props) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const target = 500;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#050507', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <style>{`
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes pitchFadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Animated orbs */}
      <div style={{ position: 'fixed', top: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(242,208,107,0.12) 0%, transparent 70%)', animation: 'floatOrb 6s ease-in-out infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: -80, right: -80, width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(91,127,255,0.1) 0%, transparent 70%)', animation: 'floatOrb 8s ease-in-out infinite reverse', pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(5,5,7,0.9)', backdropFilter: 'blur(12px)', height: 56, display: 'flex', alignItems: 'center', padding: '0 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => go('pro_dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: '#9898B4' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="#9898B4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#9898B4' }}>Retour</span>
        </button>
      </div>

      <div style={{ padding: '0 20px 40px', animation: 'pitchFadeIn 0.6s ease-out' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '48px 0 32px' }}>
          <div style={{ display: 'inline-block', background: 'rgba(242,208,107,0.1)', border: '1px solid rgba(242,208,107,0.2)', borderRadius: 999, padding: '6px 16px', marginBottom: 20 }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 12, color: '#F2D06B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Revolution Tech</span>
          </div>
          <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: 42, color: '#F4F4F8', lineHeight: 1.1, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            La plateforme qui<br />vous rend libre
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 16, color: '#9898B4', lineHeight: 1.6, maxWidth: 320, margin: '0 auto 24px' }}>
            Deployez votre activite, gerez vos clients, boostez vos revenus. Tout en un, sans intermediaire.
          </p>
          <div style={{ width: 60, height: 3, background: 'linear-gradient(90deg, #F2D06B, #D4A050)', borderRadius: 2, margin: '0 auto' }} />
        </div>

        {/* Counter */}
        <div style={{ textAlign: 'center', margin: '0 0 40px' }}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: 56, color: '#F2D06B', lineHeight: 1 }}>
            {count}+
          </div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 14, color: '#9898B4', marginTop: 4 }}>
            professionnels independants nous font confiance
          </div>
        </div>

        {/* Value pillars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
          {PILLARS.map((p, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px', display: 'flex', gap: 16, alignItems: 'flex-start', backdropFilter: 'blur(8px)' }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: `rgba(${p.bgRgb},0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {p.icon}
              </div>
              <div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 16, color: '#F4F4F8', marginBottom: 4 }}>{p.title}</div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 13, color: '#9898B4', lineHeight: 1.5 }}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 20, color: '#F4F4F8', marginBottom: 16, textAlign: 'center' }}>
            Ils ont fait le saut
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                  <img
                    src={t.img}
                    alt={t.name}
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=1C1C26&color=F2D06B`; }}
                    style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(242,208,107,0.3)' }}
                  />
                  <div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14, color: '#F4F4F8' }}>{t.name}</div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 12, color: '#9898B4' }}>{t.role}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 2 }}>
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill="#F2D06B">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    ))}
                  </div>
                </div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 14, color: '#C8C8D8', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                  "{t.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Guarantee */}
        <div style={{ background: 'rgba(0,217,122,0.05)', border: '1px solid rgba(0,217,122,0.15)', borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 12, alignItems: 'center', marginBottom: 32 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#00D97A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="9 12 11 14 15 10" stroke="#00D97A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14, color: '#00D97A' }}>Satisfaction garantie</div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 12, color: '#9898B4' }}>7 jours gratuits, sans engagement, annulation a tout moment</div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <BtnPrimary label="Commencer gratuitement 7 jours" onClick={() => go('pro_subscription')} />
          <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 12, color: '#54546C', marginTop: 10 }}>
            Puis 29.90 CHF / mois — paiement via TWINT
          </div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 11, color: '#54546C', marginTop: 4 }}>
            Sans carte de credit requise pendant l'essai
          </div>
        </div>
      </div>
    </div>
  );
}
