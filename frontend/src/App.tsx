import React, { useState } from 'react';
import { useAppState } from './state/useAppState';
import LoginScreen from './screens/auth/LoginScreen';
import RoleScreen from './screens/auth/RoleScreen';
import OTPScreen from './screens/auth/OTPScreen';
import ExplorerScreen from './screens/client/ExplorerScreen';
import FicheProScreen from './screens/client/FicheProScreen';
import Booking1Screen from './screens/client/Booking1Screen';
import Booking2Screen from './screens/client/Booking2Screen';
import Booking3Screen from './screens/client/Booking3Screen';
import Booking4Screen from './screens/client/Booking4Screen';
import Booking5Screen from './screens/client/Booking5Screen';
import LiveStatusScreen from './screens/client/LiveStatusScreen';
import ReservationsScreen from './screens/client/ReservationsScreen';
import AlertesScreen from './screens/client/AlertesScreen';
import ClientProfilScreen from './screens/client/ClientProfilScreen';
import ProDashboardScreen from './screens/pro/ProDashboardScreen';
import ProRadarScreen from './screens/pro/ProRadarScreen';
import ProWalletScreen from './screens/pro/ProWalletScreen';
import ProBusinessScreen from './screens/pro/ProBusinessScreen';
import SuccessScreen from './screens/pro/SuccessScreen';
import AdminLoginScreen from './screens/admin/AdminLoginScreen';
import AdminDashboardScreen from './screens/admin/AdminDashboardScreen';
import AdminProsScreen from './screens/admin/AdminProsScreen';
import AdminBookingsScreen from './screens/admin/AdminBookingsScreen';
import AdminRevenusScreen from './screens/admin/AdminRevenusScreen';
import Toast from './components/Toast';
import NotifsPanel from './components/NotifsPanel';

const AUTH_SCREENS = ['login', 'role', 'otp', 'admin_login'];

function isAuthScreen(screen: string) {
  return AUTH_SCREENS.includes(screen);
}

export default function App() {
  const { state, go, update, showToast, removeToast } = useAppState();
  const [prevScreen, setPrevScreen] = useState<string>('login');

  const navigate = (screen: Parameters<typeof go>[0]) => {
    setPrevScreen(state.screen);
    go(screen);
  };

  const commonProps = { state, go: navigate, update, showToast, removeToast };

  function renderScreen() {
    switch (state.screen) {
      case 'login':
        return <LoginScreen {...commonProps} />;
      case 'role':
        return <RoleScreen {...commonProps} />;
      case 'otp':
        return <OTPScreen {...commonProps} />;
      case 'explorer':
        return <ExplorerScreen {...commonProps} />;
      case 'fiche_pro':
        return <FicheProScreen {...commonProps} />;
      case 'booking_1':
        return <Booking1Screen {...commonProps} />;
      case 'booking_2':
        return <Booking2Screen {...commonProps} />;
      case 'booking_3':
        return <Booking3Screen {...commonProps} />;
      case 'booking_4':
        return <Booking4Screen {...commonProps} />;
      case 'booking_5':
        return <Booking5Screen {...commonProps} />;
      case 'live_status':
        return <LiveStatusScreen {...commonProps} />;
      case 'client_reservations':
        return <ReservationsScreen {...commonProps} />;
      case 'client_alertes':
        return <AlertesScreen {...commonProps} />;
      case 'client_profil':
        return <ClientProfilScreen {...commonProps} />;
      case 'pro_dashboard':
        return <ProDashboardScreen {...commonProps} />;
      case 'pro_radar':
        return <ProRadarScreen {...commonProps} />;
      case 'pro_wallet':
        return <ProWalletScreen {...commonProps} />;
      case 'pro_business':
        return <ProBusinessScreen {...commonProps} />;
      case 'pro_subscription':
        return <ProBusinessScreen {...commonProps} />;
      case 'pro_success':
        return <SuccessScreen {...commonProps} />;
      case 'admin_login':
        return <AdminLoginScreen {...commonProps} />;
      case 'admin_dashboard':
        return <AdminDashboardScreen {...commonProps} />;
      case 'admin_pros':
        return <AdminProsScreen {...commonProps} />;
      case 'admin_bookings':
        return <AdminBookingsScreen {...commonProps} />;
      case 'admin_revenus':
        return <AdminRevenusScreen {...commonProps} />;
      default:
        return <LoginScreen {...commonProps} />;
    }
  }

  const showSidebar = !isAuthScreen(state.screen) && state.role !== null;

  function getSidebarItems() {
    if (state.role === 'client') {
      return [
        { label: 'Explorer', screen: 'explorer' as const, icon: IconSearch },
        { label: 'Reservations', screen: 'client_reservations' as const, icon: IconCalendar },
        { label: 'Alertes', screen: 'client_alertes' as const, icon: IconBell },
        { label: 'Profil', screen: 'client_profil' as const, icon: IconUser },
      ];
    }
    if (state.role === 'pro') {
      return [
        { label: 'Radar', screen: 'pro_radar' as const, icon: IconRadar },
        { label: 'Wallet', screen: 'pro_wallet' as const, icon: IconWallet },
        { label: 'Accueil', screen: 'pro_dashboard' as const, icon: IconHome },
        { label: 'Business', screen: 'pro_business' as const, icon: IconBriefcase },
      ];
    }
    if (state.role === 'admin') {
      return [
        { label: 'Dashboard', screen: 'admin_dashboard' as const, icon: IconGrid },
        { label: 'Pros', screen: 'admin_pros' as const, icon: IconUser },
        { label: 'Bookings', screen: 'admin_bookings' as const, icon: IconCalendar },
        { label: 'Revenus', screen: 'admin_revenus' as const, icon: IconWallet },
      ];
    }
    return [];
  }

  const sidebarItems = getSidebarItems();
  const isAdmin = state.role === 'admin';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#050507',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'stretch',
    }}>
      {/* Desktop Sidebar */}
      {showSidebar && (
        <aside style={{
          display: 'none',
          width: 220,
          flexShrink: 0,
          background: 'rgba(5,5,7,0.97)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          flexDirection: 'column',
          paddingTop: 72,
          paddingBottom: 24,
        }} className="desktop-sidebar">
          <div style={{ padding: '0 16px 24px' }}>
            <span style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 900,
              fontSize: 22,
              color: '#F4F4F8',
              letterSpacing: '-0.05em',
              cursor: 'pointer',
            }} onClick={() => {
              if (state.role === 'client') navigate('explorer');
              else if (state.role === 'pro') navigate('pro_dashboard');
              else if (state.role === 'admin') navigate('admin_dashboard');
            }}>
              NEXUS<span style={{ color: '#5B7FFF' }}>.</span>
            </span>
          </div>
          <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, padding: '0 12px' }}>
            {sidebarItems.map(item => {
              const active = state.screen === item.screen;
              const activeColor = isAdmin ? '#FF3D5A' : '#F2D06B';
              return (
                <button
                  key={item.screen}
                  onClick={() => navigate(item.screen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    height: 48,
                    padding: '0 16px',
                    borderRadius: 12,
                    border: 'none',
                    background: active ? `rgba(${isAdmin ? '255,61,90' : '242,208,107'},0.08)` : 'transparent',
                    color: active ? activeColor : '#9898B4',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: 'pointer',
                    transition: 'all 150ms',
                    textAlign: 'left',
                  }}
                >
                  <item.icon size={18} color={active ? activeColor : '#9898B4'} />
                  {item.label}
                </button>
              );
            })}
          </nav>
          <div style={{ padding: '0 12px' }}>
            <button
              onClick={() => {
                update({ role: null, adminAuthenticated: false });
                navigate('login');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                height: 48,
                padding: '0 16px',
                borderRadius: 12,
                border: 'none',
                background: 'transparent',
                color: '#54546C',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                width: '100%',
              }}
            >
              <IconLogout size={18} color="#54546C" />
              Deconnexion
            </button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div
          key={state.screen}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'fadeIn 200ms ease-out',
          }}
        >
          {renderScreen()}
        </div>
      </div>

      {/* Toast Overlay */}
      <Toast toasts={state.toasts} removeToast={removeToast} />

      {/* Notifications Panel */}
      {state.notifsOpen && (
        <NotifsPanel
          notifications={state.notifications}
          onClose={() => update({ notifsOpen: false })}
          onMarkAllRead={() => update({
            notifications: state.notifications.map(n => ({ ...n, read: true }))
          })}
        />
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-sidebar {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}

// Inline icon components for sidebar
function IconSearch({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}
function IconCalendar({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
function IconBell({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
function IconUser({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function IconRadar({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M19.07 4.93A10 10 0 0 0 6.99 3.34" /><path d="M4 6h.01" /><path d="M2.29 9.62A10 10 0 1 0 21.31 8.35" /><path d="M16.24 7.76A6 6 0 1 0 8.23 16.67" /><path d="M12 18h.01" /><path d="M17.99 11.66A6 6 0 0 1 15.77 16.67" /><circle cx="12" cy="12" r="2" /><path d="m13.41 10.59 5.66-5.66" />
    </svg>
  );
}
function IconWallet({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  );
}
function IconHome({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function IconBriefcase({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}
function IconGrid({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}
function IconLogout({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
