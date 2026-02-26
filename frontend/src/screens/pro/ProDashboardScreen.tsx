import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import TabBarPro from '../../components/TabBarPro';
import { GlobalState, Screen, ToastType } from '../../state/useAppState';

interface Props {
  go: (screen: Screen) => void;
  state: GlobalState;
  update: (partial: Partial<GlobalState>) => void;
  showToast: (msg: string, type?: ToastType, duration?: number) => void;
}

function useCountUp(target: number, duration = 800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setValue(target);
        clearInterval(timer);
      } else {
        setValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

export default function ProDashboardScreen({ go, state, update, showToast }: Props) {
  const [flashOn, setFlashOn] = useState(state.proData?.flashMode || false);
  const [toggling, setToggling] = useState(false);

  const reservations = useCountUp(12);
  const revenus = useCountUp(1840);
  const noteRaw = useCountUp(48);

  const prenom = state.userName ? state.userName.split(' ')[0] : 'Pro';
  const ville = state.proData?.ville || 'Geneve';
  const trialDay = 3;

  const notifsUnread = state.notifications?.filter(n => !n.read).length || 0;

  const handleFlashToggle = () => {
    setToggling(true);
    setTimeout(() => {
      const next = !flashOn;
      setFlashOn(next);
      setToggling(false);
      if (state.proData) {
        update({ proData: { ...state.proData, flashMode: next } });
      }
      showToast(next ? 'Mode Flash active' : 'Mode Flash desactive', 'success');
    }, 400);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: 'var(--void)' }}>
      <Header
        role="pro"
        onSwitchRole={() => go('role')}
        notifsCount={notifsUnread}
        onNotifs={() => update({ notifsOpen: true })}
      />

      <div style={{ flex: 1, overflowY: 'auto', paddingTop: 72, paddingBottom: 16 }}>
        {/* Greeting */}
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{ fontWeight: 800, fontSize: 30, color: 'var(--t1)', fontFamily: 'Inter, sans-serif', lineHeight: 1.2 }}>
            Bonjour, {prenom}
          </div>
          <div style={{ fontSize: 13, color: 'var(--t3)', marginTop: 4 }}>
            Espace professionnel · {ville}
          </div>

          {/* Trial badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10, background: 'rgba(0,217,122,0.08)', border: '1px solid rgba(0,217,122,0.25)', borderRadius: 20, padding: '4px 12px' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--flash)', animation: 'breathe 2s ease-in-out infinite' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--flash)', letterSpacing: 0.5 }}>
              ESSAI GRATUIT · JOUR {trialDay}/7
            </span>
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '20px 20px 0' }}>
          <div style={{ background: 'var(--d2)', borderRadius: 16, padding: '16px 14px' }}>
            <div style={{ fontSize: 11, color: 'var(--blue)', fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>Reservations</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--t1)', marginTop: 4 }}>{reservations}</div>
            <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>ce mois</div>
          </div>
          <div style={{ background: 'var(--d2)', borderRadius: 16, padding: '16px 14px' }}>
            <div style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>Revenus</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--t1)', marginTop: 4 }}>{revenus}</div>
            <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>CHF ce mois</div>
          </div>
          <div style={{ background: 'var(--d2)', borderRadius: 16, padding: '16px 14px', gridColumn: '1 / -1' }}>
            <div style={{ fontSize: 11, color: 'var(--flash)', fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>Votre note</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
              <span style={{ fontSize: 32, fontWeight: 800, color: 'var(--t1)' }}>{(noteRaw / 10).toFixed(1)}</span>
              <span style={{ fontSize: 14, color: 'var(--t3)' }}>/5</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>sur 8 avis</div>
          </div>
        </div>

        {/* Flash toggle card */}
        <div style={{
          margin: '16px 20px 0',
          background: flashOn ? 'rgba(0,217,122,0.06)' : 'var(--d2)',
          borderRadius: 16, padding: '16px 18px',
          border: flashOn ? '1px solid rgba(0,217,122,0.3)' : '1px solid transparent',
          transition: 'all 0.4s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: flashOn ? 'var(--flash)' : 'var(--t1)' }}>Mode Flash</div>
              <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>Disponible maintenant · +20% supplement</div>
            </div>
            <button
              onClick={handleFlashToggle}
              disabled={toggling}
              style={{
                width: 48, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
                background: flashOn ? 'var(--flash)' : 'var(--d4)',
                position: 'relative', transition: 'background 0.4s ease', flexShrink: 0,
              }}
            >
              <div style={{
                position: 'absolute', top: 3, left: flashOn ? 25 : 3,
                width: 20, height: 20, borderRadius: '50%', background: '#fff',
                transition: 'left 0.4s ease', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
              }} />
            </button>
          </div>
        </div>

        {/* Next RDV */}
        <div style={{ margin: '16px 20px 0' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--t3)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10 }}>Prochain rendez-vous</div>
          <div style={{ background: 'var(--d2)', borderRadius: 16, padding: '20px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: 'var(--t3)' }}>Aucun rendez-vous prevu</div>
            <div style={{ fontSize: 11, color: 'var(--t4)', marginTop: 4 }}>Activez le mode Flash pour recevoir des demandes</div>
          </div>
        </div>

        {/* View public profile */}
        <div style={{ padding: '16px 20px 0' }}>
          <button
            onClick={() => go('explorer')}
            style={{
              width: '100%', background: 'transparent', border: '1px solid var(--d4)',
              borderRadius: 12, padding: '12px 16px', color: 'var(--t2)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Voir mon profil public
          </button>
        </div>
      </div>

      <TabBarPro active="dashboard" go={go} />
    </div>
  );
}
