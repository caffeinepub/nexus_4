import React, { useState } from 'react';
import { GlobalState, Screen, ToastType } from '../../state/useAppState';
import Header from '../../components/Header';
import TabBarPro from '../../components/TabBarPro';
import BtnPrimary from '../../components/BtnPrimary';
import ProgressCircle from '../../components/ProgressCircle';
import TabProfil from './tabs/TabProfil';
import TabServices from './tabs/TabServices';
import TabGalerie from './tabs/TabGalerie';
import TabTarifs from './tabs/TabTarifs';

interface Props {
  go: (screen: Screen) => void;
  state: GlobalState;
  update: (partial: Partial<GlobalState>) => void;
  showToast: (msg: string, type?: ToastType, duration?: number) => void;
  removeToast?: (id: string) => void;
}

const TABS = ['Profil', 'Services', 'Tarifs', 'Galerie'];

interface ServiceItem {
  id: string; name: string; prix: number; duree: number;
  description: string; badge: string; mode: string; actif: boolean;
}

interface DaySchedule { actif: boolean; debut: string; fin: string; }

interface ProfilData {
  prenom: string; nom: string; slogan: string; bio: string;
  categorie: string; lieu: string; rayonKm: number; adresseSalon: string; ville: string;
}

interface TarifsData {
  jours: Record<string, DaySchedule>; flashActif: boolean;
  flashSupplement: number; delaiMin: string; annulation: string;
}

function calcProgress(profil: ProfilData, services: ServiceItem[], tarifs: TarifsData, photos: string[]): number {
  let score = 0;
  if (profil.prenom && profil.nom) score += 25;
  if (profil.categorie) score += 15;
  if (profil.ville) score += 10;
  if (services.length >= 1) score += 25;
  if (Object.values(tarifs.jours).some(j => j.actif)) score += 10;
  const photoCount = photos.filter(p => p && p.length > 0).length;
  if (photoCount >= 3) score += 15;
  return score;
}

const SharePill = ({ go }: { go: (screen: Screen) => void }) => (
  <button
    onClick={() => go('pro_share')}
    style={{
      background: 'rgba(242,208,107,0.08)',
      border: '1px solid rgba(242,208,107,0.2)',
      borderRadius: 999,
      padding: '8px 16px',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      marginBottom: 16,
    }}
  >
    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13, color: '#F2D06B' }}>Partager mon profil</span>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M12 5l7 7-7 7" stroke="#F2D06B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </button>
);

const NetworkRow = ({ go }: { go: (screen: Screen) => void }) => (
  <button
    onClick={() => go('pro_network')}
    style={{
      width: '100%', background: '#0D0D13', border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 16, padding: '0 16px', height: 64,
      display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left',
      marginTop: 16,
    }}
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="2" stroke="#5B7FFF" strokeWidth="2"/>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="#5B7FFF" strokeWidth="2" strokeLinecap="round"/>
    </svg>
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 13, color: '#F4F4F8' }}>Mon Reseau — invitez des collegues et gagnez des recompenses</div>
      <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 11, color: '#9898B4' }}>3 pros dans votre reseau</div>
    </div>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M9 18l6-6-6-6" stroke="#54546C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </button>
);

export default function ProBusinessScreen({ go, state, update, showToast }: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const [saving, setSaving] = useState(false);
  const [completedTabs, setCompletedTabs] = useState<number[]>([]);
  const [tabKey, setTabKey] = useState(0);

  const nameParts = state.userName ? state.userName.split(' ') : ['', ''];

  const [profil, setProfil] = useState<ProfilData>({
    prenom: nameParts[0] || '',
    nom: nameParts[1] || '',
    slogan: '', bio: '', categorie: '', lieu: 'both',
    rayonKm: 10, adresseSalon: '', ville: '',
  });
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [tarifs, setTarifs] = useState<TarifsData>({
    jours: {}, flashActif: false, flashSupplement: 10,
    delaiMin: '1h', annulation: 'Moderee',
  });
  const [photos, setPhotos] = useState<string[]>(['', '', '', '']);

  const progress = calcProgress(profil, services, tarifs, photos);
  const isGlowing = progress >= 80;

  const handleTabChange = (idx: number) => {
    setActiveTab(idx);
    setTabKey(k => k + 1);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      if (!completedTabs.includes(activeTab)) {
        setCompletedTabs(prev => [...prev, activeTab]);
      }
      showToast('Informations sauvegardees', 'success');
      if (activeTab < TABS.length - 1) {
        handleTabChange(activeTab + 1);
      } else {
        go('pro_success');
      }
    }, 600);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: '#050507' }}>
      <Header
        title="Mon profil pro"
        role="pro"
        onSwitchRole={() => { update({ role: 'client' }); go('explorer'); }}
        notifsCount={state.notifications?.filter(n => !n.read).length || 0}
        onNotifs={() => update({ notifsOpen: true })}
        onLogoClick={() => go('pro_dashboard')}
      />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any, overscrollBehavior: 'contain', paddingTop: 56, paddingBottom: 100 }}>
        {/* Progress circle */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 20px 16px' }}>
          <div style={{
            filter: isGlowing ? 'drop-shadow(0 0 8px rgba(242,208,107,0.3))' : 'none',
            transition: 'filter 400ms',
          }}>
            <ProgressCircle progress={progress} size={80} />
          </div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#54546C', marginTop: 8 }}>
            Profil complete a {progress}%
          </div>
        </div>

        {/* Segment progress bar */}
        <div style={{ padding: '0 20px 16px', display: 'flex', gap: 4 }}>
          {TABS.map((tab, i) => {
            const isDone = completedTabs.includes(i);
            return (
              <div key={tab} style={{ flex: 1, height: 4, borderRadius: 999, background: '#1C1C26', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: isDone ? '100%' : '0%',
                  background: 'linear-gradient(90deg, #F2D06B, #D4A050)',
                  borderRadius: 999,
                  transition: 'width 400ms cubic-bezier(0.4, 0, 0.2, 1)',
                }} />
              </div>
            );
          })}
        </div>

        {/* Tab pills */}
        <div style={{ padding: '0 20px 16px', display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {TABS.map((tab, i) => {
            const isDone = completedTabs.includes(i);
            const isActive = activeTab === i;
            return (
              <button
                key={tab}
                onClick={() => handleTabChange(i)}
                style={{
                  flexShrink: 0, padding: '8px 16px', borderRadius: 999,
                  fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600,
                  border: isActive ? '1px solid #F2D06B' : '1px solid rgba(255,255,255,0.08)',
                  background: isActive ? 'rgba(242,208,107,0.12)' : '#0D0D13',
                  color: isActive ? '#F2D06B' : '#9898B4',
                  cursor: 'pointer', position: 'relative', transition: 'all 150ms',
                }}
              >
                {tab}
                {isDone && (
                  <span style={{
                    position: 'absolute', top: -3, right: -3,
                    width: 8, height: 8, borderRadius: '50%',
                    background: '#00D97A', border: '1.5px solid #050507',
                  }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div key={tabKey} style={{ padding: '0 20px', animation: 'fadeIn 200ms ease-out' }}>
          {activeTab === 0 && (
            <>
              <SharePill go={go} />
              <TabProfil data={profil} onChange={setProfil} />
              <NetworkRow go={go} />
            </>
          )}
          {activeTab === 1 && (
            <>
              <SharePill go={go} />
              <TabServices categorie={profil.categorie} services={services} onChange={setServices} />
              <NetworkRow go={go} />
            </>
          )}
          {activeTab === 2 && <TabTarifs data={tarifs} onChange={setTarifs} />}
          {activeTab === 3 && <TabGalerie photos={photos} onChange={setPhotos} />}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '12px 20px 28px',
        background: 'linear-gradient(to top, #050507 60%, transparent)',
        zIndex: 20,
      }}>
        <BtnPrimary
          label={saving ? 'Enregistrement...' : activeTab === TABS.length - 1 ? 'Terminer' : 'Enregistrer et continuer'}
          onClick={handleSave}
          loading={saving}
        />
      </div>
    </div>
  );
}
