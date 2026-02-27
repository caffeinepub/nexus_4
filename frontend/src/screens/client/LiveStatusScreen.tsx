import React, { useState, useEffect } from 'react';
import { GlobalState, Screen, ToastType } from '../../state/useAppState';
import Header from '../../components/Header';
import TabBarClient from '../../components/TabBarClient';

interface Props {
  state: GlobalState;
  go: (screen: Screen) => void;
  update: (partial: Partial<GlobalState>) => void;
  showToast: (message: string, type?: ToastType) => void;
}

const TIMELINE = [
  { id: 1, label: 'Demande envoyee', done: true, time: 'Il y a 2 min' },
  { id: 2, label: 'Paiement securise', done: true, time: 'Il y a 1 min' },
  { id: 3, label: 'Pro notifie', done: true, time: 'Il y a 30s' },
  { id: 4, label: 'En attente de confirmation', done: false, time: 'En cours...' },
  { id: 5, label: 'Prestation confirmee', done: false, time: '' },
];

export default function LiveStatusScreen({ state, go, update, showToast }: Props) {
  const [countdown, setCountdown] = useState(30 * 60); // 30 minutes
  const [currentStep, setCurrentStep] = useState(3);
  const pro = state.selectedPro;

  useEffect(() => {
    const t = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    // Simulate pro confirming after 6 seconds
    const t = setTimeout(() => {
      setCurrentStep(4);
      showToast('Le professionnel a confirme votre reservation', 'success');
    }, 6000);
    return () => clearTimeout(t);
  }, []);

  const minutes = Math.floor(countdown / 60);
  const secs = countdown % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: '#050507' }}>
      <Header
        title="Statut en direct"
        onLogoClick={() => go('explorer')}
      />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any, overscrollBehavior: 'contain', paddingTop: 72 }}>
        <div style={{ padding: '20px 20px 0', maxWidth: 560, margin: '0 auto' }}>
          {/* Status card */}
          <div style={{
            background: '#0D0D13', border: '1px solid rgba(242,208,107,0.15)',
            borderRadius: 20, padding: 24, marginBottom: 24, textAlign: 'center',
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'rgba(242,208,107,0.1)', border: '2px solid rgba(242,208,107,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', animation: 'breathe 2s ease-in-out infinite',
            }}>
              <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="#F2D06B" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 22, color: '#F4F4F8', margin: '0 0 8px', letterSpacing: '-0.03em' }}>
              En attente de confirmation
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#9898B4', margin: '0 0 20px', lineHeight: 1.5 }}>
              {pro ? pro.name : 'Le professionnel'} a 30 minutes pour confirmer
            </p>
            <div style={{
              fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: 40,
              color: '#F2D06B', letterSpacing: '-0.04em',
            }}>
              {pad(minutes)}:{pad(secs)}
            </div>
          </div>

          {/* Booking summary */}
          <div style={{
            background: '#0D0D13', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 16, padding: '16px', marginBottom: 24,
          }}>
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14, color: '#F4F4F8', marginBottom: 12 }}>
              Details de la reservation
            </div>
            {[
              { label: 'Service', value: state.bookingServiceName || 'Service' },
              { label: 'Creneau', value: state.bookingCreneau || 'Dans 1 heure' },
              { label: 'Adresse', value: state.bookingAdresse || 'Adresse non renseignee' },
              { label: 'Montant', value: `${state.bookingMontant || 65} CHF` },
            ].map((row, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 0',
                borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#54546C' }}>{row.label}</span>
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 13, color: '#F4F4F8' }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14, color: '#F4F4F8', marginBottom: 16 }}>
              Suivi en temps reel
            </div>
            {TIMELINE.map((step, i) => {
              const isDone = i <= currentStep;
              const isCurrent = i === currentStep;
              return (
                <div key={step.id} style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                      background: isDone ? '#F2D06B' : '#1C1C26',
                      border: isCurrent ? '2px solid #F2D06B' : 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      animation: isCurrent ? 'breathe 2s ease-in-out infinite' : 'none',
                      transition: 'all 300ms',
                    }}>
                      {isDone ? (
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#050507" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2E2E3E' }} />
                      )}
                    </div>
                    {i < TIMELINE.length - 1 && (
                      <div style={{
                        width: 2, flex: 1, minHeight: 20,
                        background: isDone ? '#F2D06B' : '#1C1C26',
                        marginTop: 4, transition: 'background 300ms',
                      }} />
                    )}
                  </div>
                  <div style={{ flex: 1, paddingBottom: 8 }}>
                    <div style={{
                      fontFamily: 'Inter, sans-serif', fontWeight: isDone ? 600 : 400,
                      fontSize: 14, color: isDone ? '#F4F4F8' : '#54546C',
                      marginBottom: 2, transition: 'color 300ms',
                    }}>
                      {step.label}
                    </div>
                    {step.time && (
                      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#54546C' }}>
                        {step.time}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <TabBarClient current="client_reservations" go={go} />
    </div>
  );
}
