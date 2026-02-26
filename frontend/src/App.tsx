import React, { useState, useCallback } from 'react';
import { useAppState, ToastType, Toast, Screen, GlobalState } from './state/useAppState';
import LoginScreen from './screens/auth/LoginScreen';
import RoleScreen from './screens/auth/RoleScreen';
import OTPScreen from './screens/auth/OTPScreen';
import ExplorerScreen from './screens/client/ExplorerScreen';
import FicheProScreen from './screens/client/FicheProScreen';
import ProDashboardScreen from './screens/pro/ProDashboardScreen';
import ProRadarScreen from './screens/pro/ProRadarScreen';
import ProWalletScreen from './screens/pro/ProWalletScreen';
import AdminDashboardScreen from './screens/admin/AdminDashboardScreen';
import AdminProsScreen from './screens/admin/AdminProsScreen';
import AdminBookingsScreen from './screens/admin/AdminBookingsScreen';
import AdminRevenusScreen from './screens/admin/AdminRevenusScreen';

function PlaceholderScreen({ title, go, state }: { title: string; go: (s: Screen) => void; state: GlobalState }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#050507',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      color: '#F4F4F8', fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>{title}</div>
      <button
        onClick={() => {
          if (state.role === 'client') go('explorer');
          else if (state.role === 'pro') go('pro_dashboard');
          else if (state.role === 'admin') go('admin_dashboard');
          else go('login');
        }}
        style={{
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #C9A84C, #E8C96D)',
          border: 'none', borderRadius: 12,
          color: '#050507', fontWeight: 700, cursor: 'pointer'
        }}
      >
        Retour
      </button>
    </div>
  );
}

export default function App() {
  const { state, go, update } = useAppState();
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((msg: string, type: ToastType = 'info', duration?: number) => {
    const id = Math.random().toString(36).slice(2);
    const toast: Toast = { id, message: msg, type };
    setToasts(prev => [...prev, toast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration ?? 3000);
  }, []);

  const renderScreen = () => {
    switch (state.screen) {
      case 'login':
        return <LoginScreen go={go} update={update} showToast={showToast} />;
      case 'role':
        return <RoleScreen go={go} update={update} showToast={showToast} />;
      case 'otp':
        return <OTPScreen go={go} state={{ role: state.role, userPhone: state.userPhone }} update={update} showToast={showToast} />;
      case 'explorer':
        return <ExplorerScreen go={go} state={state} update={update} />;
      case 'fiche_pro':
        return <FicheProScreen go={go} state={state} update={update} />;
      case 'booking_1':
        return <PlaceholderScreen title="Reservation - Etape 1" go={go} state={state} />;
      case 'booking_2':
        return <PlaceholderScreen title="Reservation - Etape 2" go={go} state={state} />;
      case 'booking_3':
        return <PlaceholderScreen title="Reservation - Etape 3" go={go} state={state} />;
      case 'booking_confirm':
        return <PlaceholderScreen title="Confirmation Reservation" go={go} state={state} />;
      case 'client_reservations':
        return <PlaceholderScreen title="Mes Reservations" go={go} state={state} />;
      case 'client_alertes':
        return <PlaceholderScreen title="Mes Alertes" go={go} state={state} />;
      case 'client_profil':
        return <PlaceholderScreen title="Mon Profil" go={go} state={state} />;
      case 'pro_dashboard':
        return <ProDashboardScreen go={go} state={state} update={update} showToast={showToast} />;
      case 'pro_radar':
        return <ProRadarScreen go={go} state={state} update={update} showToast={showToast} />;
      case 'pro_wallet':
        return <ProWalletScreen go={go} state={state} update={update} showToast={showToast} />;
      case 'pro_profil':
        return <PlaceholderScreen title="Profil Pro" go={go} state={state} />;
      case 'pro_services':
        return <PlaceholderScreen title="Mes Services" go={go} state={state} />;
      case 'pro_subscription':
        return <PlaceholderScreen title="Abonnement" go={go} state={state} />;
      case 'pro_agenda':
        return <PlaceholderScreen title="Mon Agenda" go={go} state={state} />;
      case 'pro_business':
        return <PlaceholderScreen title="Mon Business" go={go} state={state} />;
      case 'admin_login':
        return <PlaceholderScreen title="Admin Login" go={go} state={state} />;
      case 'admin_dashboard':
        return <AdminDashboardScreen go={go} state={state} update={update} />;
      case 'admin_pros':
        return <AdminProsScreen go={go} state={state} />;
      case 'admin_bookings':
        return <AdminBookingsScreen go={go} state={state} />;
      case 'admin_revenus':
        return <AdminRevenusScreen go={go} state={state} />;
      case 'admin_profil':
        return <PlaceholderScreen title="Profil Admin" go={go} state={state} />;
      case 'notifs':
        return <PlaceholderScreen title="Notifications" go={go} state={state} />;
      case 'placeholder':
        return <PlaceholderScreen title="En construction" go={go} state={state} />;
      default:
        return <LoginScreen go={go} update={update} showToast={showToast} />;
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: '#050507',
      position: 'relative',
    }}>
      {renderScreen()}
      {toasts.length > 0 && (
        <div style={{
          position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center',
          pointerEvents: 'none', width: '90%', maxWidth: 380,
        }}>
          {toasts.map(t => (
            <div key={t.id} style={{
              padding: '10px 20px', borderRadius: 12, width: '100%', textAlign: 'center',
              background: t.type === 'error' ? '#FF3D5A' : t.type === 'success' ? '#10B981' : '#C9A84C',
              color: t.type === 'error' ? '#fff' : '#050507',
              fontWeight: 700, fontSize: 13,
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}>
              {t.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
