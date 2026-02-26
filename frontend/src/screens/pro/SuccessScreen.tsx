import React, { useEffect, useState } from 'react';
import BtnPrimary from '../../components/BtnPrimary';
import { GlobalState, Screen } from '../../state/useAppState';

interface Props {
  go: (screen: Screen) => void;
  update: (partial: Partial<GlobalState>) => void;
}

interface Confetti {
  id: number;
  x: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
}

function generateConfetti(): Confetti[] {
  const colors = ['#F2D06B', '#D4A050', '#F2D06B', '#E8C55A', '#FFE08A'];
  return Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: 4 + Math.random() * 4,
  }));
}

export default function SuccessScreen({ go, update }: Props) {
  const [progress, setProgress] = useState(0);
  const [checkVisible, setCheckVisible] = useState(false);
  const [confetti] = useState(generateConfetti);

  useEffect(() => {
    const start = Date.now();
    const duration = 2000;
    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);
      if (pct < 100) requestAnimationFrame(tick);
      else setCheckVisible(true);
    };
    requestAnimationFrame(tick);
  }, []);

  const handleAccess = () => {
    update({ proActif: true });
    go('pro_dashboard');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: 'var(--void)', overflow: 'hidden' }}>
      {/* Confetti */}
      {confetti.map(c => (
        <div
          key={c.id}
          style={{
            position: 'absolute',
            left: `${c.x}%`,
            top: -20,
            width: c.size,
            height: c.size * 2,
            background: c.color,
            borderRadius: 2,
            animation: `fall ${c.duration}s ${c.delay}s ease-in forwards`,
            zIndex: 0,
          }}
        />
      ))}

      {/* Progress bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'var(--d3)', zIndex: 10 }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, var(--gold), var(--flash))', transition: 'width 0.05s linear' }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        {/* Check circle */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%', border: '3px solid var(--flash)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
          animation: checkVisible ? 'scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards' : 'none',
          transform: checkVisible ? 'scale(1)' : 'scale(0)',
        }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path d="M8 18l7 7 13-13" stroke="var(--flash)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--t1)', fontFamily: 'Inter, sans-serif', textAlign: 'center', marginBottom: 12 }}>
          Bienvenue sur NEXUS Pro
        </div>
        <div style={{ fontSize: 14, color: 'var(--t3)', textAlign: 'center', lineHeight: 1.6 }}>
          Votre profil est active. Vous pouvez maintenant recevoir des reservations et gerer votre activite.
        </div>
      </div>

      {/* CTA */}
      <div style={{ flexShrink: 0, padding: '16px 24px', position: 'relative', zIndex: 1 }}>
        <BtnPrimary onClick={handleAccess}>
          Acceder a mon espace pro
        </BtnPrimary>
      </div>
    </div>
  );
}
