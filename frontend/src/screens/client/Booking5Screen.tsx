import React, { useEffect, useState } from 'react';
import { GlobalState, Screen, ToastType } from '../../state/useAppState';

interface Props {
  state: GlobalState;
  go: (screen: Screen) => void;
  update: (partial: Partial<GlobalState>) => void;
  showToast: (message: string, type?: ToastType) => void;
}

export default function Booking5Screen({ state, go, update, showToast }: Props) {
  const [seconds, setSeconds] = useState(8);
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const dotTimer = setInterval(() => setDots(d => (d + 1) % 4), 500);
    return () => clearInterval(dotTimer);
  }, []);

  useEffect(() => {
    if (seconds <= 0) {
      showToast('Reservation confirmee', 'success');
      go('live_status');
      return;
    }
    const t = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const dotStr = '.'.repeat(dots);

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#050507',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      {/* Animated hourglass */}
      <div style={{ marginBottom: 40, position: 'relative' }}>
        <div style={{
          width: 100, height: 100, borderRadius: '50%',
          background: 'rgba(242,208,107,0.06)',
          border: '2px solid rgba(242,208,107,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'breathe 2s ease-in-out infinite',
        }}>
          <svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke="#F2D06B" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 4s linear infinite' }}>
            <path d="M5 22h14" /><path d="M5 2h14" />
            <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
            <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
          </svg>
        </div>
        {/* Pulse rings */}
        {[1, 2, 3].map(i => (
          <div key={i} style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 100 + i * 30, height: 100 + i * 30,
            borderRadius: '50%',
            border: '1px solid rgba(242,208,107,0.1)',
            animation: `breathe ${1.5 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }} />
        ))}
      </div>

      <h2 style={{
        fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 24,
        color: '#F4F4F8', textAlign: 'center', marginBottom: 12, letterSpacing: '-0.03em',
      }}>
        Traitement en cours{dotStr}
      </h2>
      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: 15, color: '#9898B4',
        textAlign: 'center', lineHeight: 1.6, marginBottom: 32, maxWidth: 300,
      }}>
        Votre demande est transmise au professionnel. Confirmation dans quelques instants.
      </p>

      {/* Progress bar */}
      <div style={{
        width: '100%', maxWidth: 280, height: 4, background: '#1C1C26',
        borderRadius: 999, overflow: 'hidden', marginBottom: 16,
      }}>
        <div style={{
          height: '100%',
          width: `${((8 - seconds) / 8) * 100}%`,
          background: 'linear-gradient(90deg, #F2D06B, #D4A050)',
          borderRadius: 999,
          transition: 'width 1s linear',
        }} />
      </div>

      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#54546C' }}>
        Redirection dans {seconds}s
      </p>
    </div>
  );
}
