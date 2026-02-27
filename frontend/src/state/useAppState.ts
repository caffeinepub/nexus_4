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
  | 'booking_4'
  | 'booking_5'
  | 'live_status'
  | 'client_reservations'
  | 'client_alertes'
  | 'client_profil'
  | 'pro_dashboard'
  | 'pro_radar'
  | 'pro_wallet'
  | 'pro_business'
  | 'pro_subscription'
  | 'pro_success'
  | 'admin_login'
  | 'admin_dashboard'
  | 'admin_pros'
  | 'admin_bookings'
  | 'admin_revenus'
  | 'pro_pitch'
  | 'pro_stats'
  | 'pro_share'
  | 'pro_network';

export type Role = 'client' | 'pro' | 'admin' | null;
export type ToastType = 'success' | 'error' | 'info' | 'sms' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export interface AppNotification {
  id: string;
  type: 'nouvelle_demande' | 'paiement_confirme' | 'fonds_liberes' | 'booking_confirme' | 'avis_recu';
  message: string;
  time: string;
  read: boolean;
}

export interface AppService {
  id: string;
  name: string;
  duree: number;
  prix: number;
  description: string;
  actif: boolean;
  badge?: string;
}

export interface ProDemo {
  id: string;
  name: string;
  categorie: string;
  ville: string;
  rating: number;
  reviewCount: number;
  prix: number;
  image: string;
  bio: string;
  services: AppService[];
  distance?: string;
  flash?: boolean;
  available?: boolean;
  modeTravail: string;
  phone: string;
  email: string;
  adresse: string;
  photos: string[];
  reviews: { author: string; note: number; comment: string; date: string }[];
}

export interface BookingData {
  proId: string;
  serviceId: string;
  serviceName: string;
  montant: number;
  creneau: string;
  adresse: string;
  ville: string;
  phone: string;
  note: string;
  bookingId: string;
}

export interface ProData {
  name: string;
  slogan: string;
  bio: string;
  categorie: string;
  ville: string;
  adresse: string;
  phone: string;
  email: string;
  modeTravail: string;
  services: AppService[];
  photos: string[];
  actif: boolean;
  subscriptionActive: boolean;
  flashMode: boolean;
}

export interface GlobalState {
  screen: Screen;
  role: Role;
  toasts: Toast[];
  notifications: AppNotification[];
  notifsOpen: boolean;
  selectedPro: ProDemo | null;
  selectedService: AppService | null;
  bookingCreneau: string;
  bookingAdresse: string;
  bookingVille: string;
  bookingPhone: string;
  bookingNote: string;
  bookingId: string;
  bookingMontant: number;
  bookingServiceId: string;
  bookingServiceName: string;
  bookingProId: string;
  modalOpen: boolean;
  serviceEditorOpen: boolean;
  editingService: AppService | null;
  adminAuthenticated: boolean;
  proActif: boolean;
  proData: ProData;
  userLat: number | null;
  userLng: number | null;
  locationActive: boolean;
  userName: string;
  userPhone: string;
  userEmail: string;
  principal: string;
}

const defaultProData: ProData = {
  name: '',
  slogan: '',
  bio: '',
  categorie: 'coiffure',
  ville: '',
  adresse: '',
  phone: '',
  email: '',
  modeTravail: 'both',
  services: [],
  photos: [],
  actif: false,
  subscriptionActive: false,
  flashMode: false,
};

const defaultNotifications: AppNotification[] = [
  { id: 'n1', type: 'nouvelle_demande', message: 'Nouvelle demande de Thomas M.', time: 'Il y a 5 min', read: false },
  { id: 'n2', type: 'paiement_confirme', message: 'Paiement confirme 45 CHF', time: 'Il y a 1h', read: false },
  { id: 'n3', type: 'booking_confirme', message: 'Votre profil a ete consulte', time: 'Il y a 3h', read: false },
];

const initialState: GlobalState = {
  screen: 'login',
  role: null,
  toasts: [],
  notifications: defaultNotifications,
  notifsOpen: false,
  selectedPro: null,
  selectedService: null,
  bookingCreneau: '',
  bookingAdresse: '',
  bookingVille: '',
  bookingPhone: '',
  bookingNote: '',
  bookingId: '',
  bookingMontant: 0,
  bookingServiceId: '',
  bookingServiceName: '',
  bookingProId: '',
  modalOpen: false,
  serviceEditorOpen: false,
  editingService: null,
  adminAuthenticated: false,
  proActif: false,
  proData: defaultProData,
  userLat: null,
  userLng: null,
  locationActive: false,
  userName: '',
  userPhone: '',
  userEmail: '',
  principal: '',
};

export function useAppState() {
  const [state, setState] = useState<GlobalState>(initialState);

  const go = useCallback((screen: Screen) => {
    setState(prev => ({ ...prev, screen }));
  }, []);

  const update = useCallback((partial: Partial<GlobalState>) => {
    setState(prev => ({ ...prev, ...partial }));
  }, []);

  const removeToast = useCallback((id: string) => {
    setState(prev => ({ ...prev, toasts: prev.toasts.filter(t => t.id !== id) }));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration = 3500) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setState(prev => {
      const toasts = [...prev.toasts, { id, message, type, duration }];
      const trimmed = toasts.length > 4 ? toasts.slice(toasts.length - 4) : toasts;
      return { ...prev, toasts: trimmed };
    });
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  return { state, go, update, showToast, removeToast };
}
