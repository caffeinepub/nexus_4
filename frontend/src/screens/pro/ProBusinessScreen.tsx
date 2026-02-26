import React, { useState } from 'react';
import Header from '../../components/Header';
import TabBarPro from '../../components/TabBarPro';
import BtnPrimary from '../../components/BtnPrimary';
import ProgressCircle from '../../components/ProgressCircle';
import TabProfil from './tabs/TabProfil';
import TabServices from './tabs/TabServices';
import TabTarifs from './tabs/TabTarifs';
import TabPaiement from './tabs/TabPaiement';
import TabGalerie from './tabs/TabGalerie';
import { GlobalState, Screen, ToastType } from '../../state/useAppState';

interface Props {
  go: (screen: Screen) => void;
  state: GlobalState;
  update: (partial: Partial<GlobalState>) => void;
  showToast: (msg: string, type?: ToastType, duration?: number) => void;
}

const TABS = ['Profil', 'Services', 'Tarifs', 'Paiement', 'Galerie'];

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

interface PaiementData { twint: string; iban: string; }

function calcProgress(profil: ProfilData, services: ServiceItem[], tarifs: TarifsData, paiement: PaiementData, photos: string[]): number {
  let score = 0;
  if (profil.prenom && profil.nom) score += 20;
  if (profil.categorie) score += 10;
  if (profil.ville) score += 10;
  if (services.length >= 1) score += 20;
  if (Object.values(tarifs.jours).some(j => j.actif)) score += 10;
  if (paiement.twint || paiement.iban) score += 10;
  const photoCount = photos.filter(p => p && p.length > 0).length;
  if (photoCount >= 3) score += 20;
  return score;
}

export default function ProBusinessScreen({ go, state, update, showToast }: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const [profil, setProfil] = useState<ProfilData>({
    prenom: state.userName?.split(' ')[0] || '',
    nom: state.userName?.split(' ').slice(1).join(' ') || '',
    slogan: '', bio: '', categorie: '', lieu: 'both', rayonKm: 10, adresseSalon: '', ville: '',
  });
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [tarifs, setTarifs] = useState<TarifsData>({
    jours: {}, flashActif: false, flashSupplement: 10, delaiMin: '1h', annulation: 'Moderee',
  });
  const [paiement, setPaiement] = useState<PaiementData>({ twint: '', iban: '' });
  const [photos, setPhotos] = useState<string[]>(['', '', '', '']);
  const [saving, setSaving] = useState(false);

  const progress = calcProgress(profil, services, tarifs, paiement, photos);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    showToast('Sauvegarde', 'success');
    if (activeTab < 4) setActiveTab(activeTab + 1);
  };

  const handleActivate = () => {
    go('pro_subscription');
  };

  const segmentColors = [0, 1, 2, 3, 4].map(i => {
    const threshold = (i + 1) * 20;
    return progress >= threshold ? 'var(--gold)' : 'var(--d4)';
  });

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: 'var(--void)' }}>
      {/* Header absolute */}
      <Header role="pro" onSwitchRole={() => go('role')} notifsCount={0} onNotifs={() => update({ notifsOpen: true })} />

      {/* Title + tabs zone */}
      <div style={{ flexShrink: 0, paddingTop: 72, paddingBottom: 0, background: 'var(--void)', zIndex: 10 }}>
        <div style={{ padding: '16px 20px 0', display: 'flex', alignItems: 'center', gap: 14 }}>
          <ProgressCircle size={48} progress={progress} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)' }}>Mon profil pro</div>
            <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>Completion: {progress}%</div>
          </div>
        </div>

        {/* 5-segment bar */}
        <div style={{ display: 'flex', gap: 4, padding: '12px 20px 0' }}>
          {segmentColors.map((color, i) => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: color, transition: 'background 0.4s' }} />
          ))}
        </div>

        {/* Tab pills */}
        <div style={{ display: 'flex', gap: 8, padding: '12px 20px 0', overflowX: 'auto' }}>
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              style={{
                flexShrink: 0, padding: '8px 16px', borderRadius: 20, border: 'none', cursor: 'pointer',
                background: activeTab === i ? 'var(--gold)' : 'var(--d2)',
                color: activeTab === i ? '#050507' : 'var(--t2)',
                fontSize: 13, fontWeight: 600,
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        <div style={{ height: 12 }} />
      </div>

      {/* Scroll zone */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 0' }}>
        {activeTab === 0 && <TabProfil data={profil} onChange={setProfil} />}
        {activeTab === 1 && <TabServices categorie={profil.categorie} services={services} onChange={setServices} />}
        {activeTab === 2 && <TabTarifs data={tarifs} onChange={setTarifs} />}
        {activeTab === 3 && <TabPaiement data={paiement} onChange={setPaiement} />}
        {activeTab === 4 && <TabGalerie photos={photos} onChange={setPhotos} />}
      </div>

      {/* CTA */}
      <div style={{ flexShrink: 0, padding: '12px 16px', background: 'var(--void)', borderTop: '1px solid var(--d3)' }}>
        {activeTab < 4 ? (
          <BtnPrimary onClick={handleSave} loading={saving}>
            Sauvegarder et continuer
          </BtnPrimary>
        ) : progress >= 80 ? (
          <BtnPrimary onClick={handleActivate}>
            Activer mon profil
          </BtnPrimary>
        ) : (
          <BtnPrimary onClick={() => {}} disabled>
            Profil incomplet ({progress}%)
          </BtnPrimary>
        )}
      </div>

      <TabBarPro active="business" go={go} />
    </div>
  );
}
