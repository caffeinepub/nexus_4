import { useState, useCallback } from 'react';

export type Screen =
  | 'login'
  | 'role'
  | 'otp'
  | 'explorer'
  | 'fiche_pro'
  | 'booking_1'
  | 'booking_2'
  | 'booking_3'
  | 'booking_confirm'
  | 'client_reservations'
  | 'client_alertes'
  | 'client_profil'
  | 'pro_dashboard'
  | 'pro_radar'
  | 'pro_wallet'
  | 'pro_profil'
  | 'pro_services'
  | 'pro_subscription'
  | 'pro_agenda'
  | 'pro_business'
  | 'admin_login'
  | 'admin_dashboard'
  | 'admin_pros'
  | 'admin_bookings'
  | 'admin_revenus'
  | 'admin_profil'
  | 'notifs'
  | 'placeholder';

export type Role = 'client' | 'pro' | 'admin' | null;

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export interface AppNotification {
  id: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: number;
}

export interface AppService {
  id: string;
  name: string;
  prix: number;
  duree: number;
  description: string;
  actif: boolean;
}

export interface ProDemo {
  id: string;
  prenom: string;
  nom: string;
  categorie: string;
  ville: string;
  note: number;
  nbAvis: number;
  prix: number;
  flash: boolean;
  reponsMin: number;
  image: string;
}

export interface BookingData {
  bookingId: string;
  serviceId: string;
  serviceName: string;
  montant: number;
  date: string;
  heure: string;
  phone: string;
  adresse: string;
  ville: string;
  note: string;
  proId: string;
}

export interface ProData {
  ville?: string;
  flashMode?: boolean;
  subscriptionActive?: boolean;
  subscriptionExpiry?: number;
  rating?: number;
  reviewCount?: number;
}

export interface GlobalState {
  screen: Screen;
  role: Role;
  phone: string;
  otpCode: string;
  clientTab: string;
  proTab: string;
  adminTab: string;
  selectedPro: ProDemo | null;
  notifCount: number;
  flashMode: boolean;
  toasts: Toast[];
  // Auth
  isAuthenticated: boolean;
  userPhone: string;
  userEmail: string;
  userName: string;
  principal: string;
  // Admin
  adminAuthenticated: boolean;
  // Pro
  proData: ProData | null;
  proActif: boolean;
  // Booking
  selectedService: AppService | null;
  bookingData: BookingData;
  // Notifications
  notifications: AppNotification[];
  notifsOpen: boolean;
}

const initialBookingData: BookingData = {
  bookingId: '',
  serviceId: '',
  serviceName: '',
  montant: 0,
  date: '',
  heure: '',
  phone: '',
  adresse: '',
  ville: '',
  note: '',
  proId: '',
};

const initialState: GlobalState = {
  screen: 'login',
  role: null,
  phone: '',
  otpCode: '',
  clientTab: 'explorer',
  proTab: 'dashboard',
  adminTab: 'dashboard',
  selectedPro: null,
  notifCount: 2,
  flashMode: false,
  toasts: [],
  isAuthenticated: false,
  userPhone: '',
  userEmail: '',
  userName: '',
  principal: '',
  adminAuthenticated: false,
  proData: null,
  proActif: false,
  selectedService: null,
  bookingData: initialBookingData,
  notifications: [],
  notifsOpen: false,
};

export function useAppState() {
  const [state, setState] = useState<GlobalState>(initialState);

  const go = useCallback((screen: Screen) => {
    setState(prev => ({ ...prev, screen }));
  }, []);

  const update = useCallback((partial: Partial<GlobalState>) => {
    setState(prev => ({ ...prev, ...partial }));
  }, []);

  return { state, go, update };
}
