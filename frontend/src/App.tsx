import React, { useState, useEffect } from 'react';
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
import SubscriptionModal from './screens/pro/SubscriptionModal';
import SuccessScreen from './screens/pro/SuccessScreen';
import ProPitchScreen from './screens/pro/ProPitchScreen';
import ProStatsScreen from './screens/pro/ProStatsScreen';
import ProShareScreen from './screens/pro/ProShareScreen';
import ProNetworkScreen from './screens/pro/ProNetworkScreen';
import AdminLoginScreen from './screens/admin/AdminLoginScreen';
import AdminDashboardScreen from './screens/admin/AdminDashboardScreen';
import AdminProsScreen from './screens/admin/AdminProsScreen';
import AdminBookingsScreen from './screens/admin/AdminBookingsScreen';
import AdminRevenusScreen from './screens/admin/AdminRevenusScreen';
import Toast from './components/Toast';
import NotifsPanel from './components/NotifsPanel';
import { IconChevronRight } from './components/icons/index';
import {
  IconSearch,
  IconCalendar,
  IconBell,
  IconUser,
  IconRadar,
  IconWallet,
  IconHome,
  IconBriefcase,
  IconGrid,
} from './components/icons/index';

const AUTH_SCREENS = ['login', 'role', 'otp', 'admin_login'];

function isAuthScreen(screen: string) {
  return AUTH_SCREENS.includes(screen);
}

const SIDEBAR_STORAGE_KEY = 'nexus_sidebar_collapsed';

export default function App() {
  const { state, go, update, showToast, removeToast } = useAppState();
  const [prevScreen, setPrevScreen] = useState<string>('login');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(sidebarCollapsed));
    } catch {
      // ignore
    }
  }, [sidebarCollapsed]);

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
        return <SubscriptionModal {...commonProps} />;
      case 'pro_success':
        return <SuccessScreen {...commonProps} />;
      case 'pro_pitch':
        return <ProPitchScreen {...commonProps} />;
      case 'pro_stats':
        return <ProStatsScreen {...commonProps} />;
      case 'pro_share':
        return <ProShareScreen {...commonProps} />;
      case 'pro_network':
        return <ProNetworkScreen {...commonProps} />;
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
  const activeColor = isAdmin ? '#FF3D5A' : '#F2D06B';

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
        <aside
          className="desktop-sidebar"
          style={{
            display: 'none',
            width: sidebarCollapsed ? 64 : 220,
            flexShrink: 0,
            background: 'rgba(5,5,7,0.97)',
            borderRight: '1px solid rgba(255,255,255,0.06)',
            flexDirection: 'column',
            paddingTop: 72,
            paddingBottom: 24,
            transition: 'width 220ms ease',
            overflow: 'hidden',
          }}
        >
          {/* Logo / Toggle row */}
          <div style={{
            padding: sidebarCollapsed ? '0 0 24px' : '0 16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarCollapsed ? 'center' : 'space-between',
            gap: 8,
            transition: 'padding 220ms ease',
          }}>
            {!sidebarCollapsed && (
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 900,
                  fontSize: 22,
                  color: '#F4F4F8',
                  letterSpacing: '-0.05em',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
                onClick={() => {
                  if (state.role === 'client') navigate('explorer');
                  else if (state.role === 'pro') navigate('pro_dashboard');
                  else if (state.role === 'admin') navigate('admin_dashboard');
                }}
              >
                NEXUS<span style={{ color: '#5B7FFF' }}>.</span>
              </span>
            )}

            {/* Toggle button */}
            <button
              onClick={() => setSidebarCollapsed(prev => !prev)}
              title={sidebarCollapsed ? 'Ouvrir le menu' : 'Fermer le menu'}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'background 150ms ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.09)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
              }}
            >
              <span style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: sidebarCollapsed ? 'rotate(0deg)' : 'rotate(180deg)',
                transition: 'transform 220ms ease',
              }}>
                <IconChevronRight size={15} color="#9898B4" />
              </span>
            </button>
          </div>

          {/* Nav items */}
          <nav style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            padding: sidebarCollapsed ? '0 8px' : '0 12px',
            transition: 'padding 220ms ease',
          }}>
            {sidebarItems.map(item => {
              const active = state.screen === item.screen;
              return (
                <button
                  key={item.screen}
                  onClick={() => navigate(item.screen)}
                  title={sidebarCollapsed ? item.label : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                    gap: 12,
                    height: 48,
                    padding: sidebarCollapsed ? '0' : '0 16px',
                    borderRadius: 12,
                    border: 'none',
                    background: active ? `rgba(${isAdmin ? '255,61,90' : '242,208,107'},0.08)` : 'transparent',
                    color: active ? activeColor : '#9898B4',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                    textAlign: 'left',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    width: '100%',
                  }}
                >
                  <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                    <item.icon size={18} color={active ? activeColor : '#9898B4'} />
                  </span>
                  {!sidebarCollapsed && (
                    <span style={{
                      opacity: sidebarCollapsed ? 0 : 1,
                      transition: 'opacity 150ms ease',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div style={{
            padding: sidebarCollapsed ? '0 8px' : '0 12px',
            transition: 'padding 220ms ease',
          }}>
            <button
              onClick={() => {
                update({ role: null, adminAuthenticated: false });
                navigate('login');
              }}
              title={sidebarCollapsed ? 'Deconnexion' : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                gap: 12,
                height: 48,
                padding: sidebarCollapsed ? '0' : '0 16px',
                borderRadius: 12,
                border: 'none',
                background: 'transparent',
                color: '#54546C',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                transition: 'all 150ms ease',
                width: '100%',
              }}
            >
              <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#54546C" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </span>
              {!sidebarCollapsed && (
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Deconnexion
                </span>
              )}
            </button>
          </div>
        </aside>
      )}

      {/* Main content */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {renderScreen()}
      </div>

      {/* Toast notifications */}
      <Toast toasts={state.toasts} removeToast={removeToast} />

      {/* Notifications panel */}
      {state.notifsOpen && (
        <NotifsPanel
          notifications={state.notifications}
          onClose={() => update({ notifsOpen: false })}
          onMarkAllRead={() => update({
            notifications: state.notifications.map(n => ({ ...n, read: true })),
          })}
        />
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-sidebar { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
