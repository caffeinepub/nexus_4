import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Pro {
    id: Principal;
    bio: string;
    categorie: Categorie;
    actif: boolean;
    ville: string;
    subscriptionExpiry: bigint;
    name: string;
    createdAt: bigint;
    email: string;
    modeTravail: ModeTravail;
    subscriptionActive: boolean;
    adresse: string;
    rating: number;
    phone: string;
    reviewCount: bigint;
    services: Array<Service>;
    photos: Array<string>;
}
export interface Booking {
    id: string;
    statut: StatutBooking;
    clientId: Principal;
    heure: string;
    date: string;
    createdAt: bigint;
    payrexxRef: string;
    montant: number;
    serviceId: string;
    proId: Principal;
}
export interface User {
    id: Principal;
    name: string;
    createdAt: bigint;
    role: Role;
    email: string;
    phone: string;
}
export interface Notification {
    id: string;
    userId: Principal;
    createdAt: bigint;
    read: boolean;
    type: string;
    message: string;
}
export interface Service {
    id: string;
    actif: boolean;
    name: string;
    prix: number;
    description: string;
    duree: bigint;
}
export interface UserProfile {
    name: string;
    role: Role;
    email: string;
    phone: string;
}
export interface Transaction {
    id: string;
    ref: string;
    createdAt: bigint;
    type: TypeTransaction;
    montant: number;
    proId: Principal;
}
export enum Categorie {
    massage = "massage",
    coiffure = "coiffure",
    other = "other",
    onglerie = "onglerie",
    maquillage = "maquillage",
    esthetique = "esthetique"
}
export enum ModeTravail {
    both = "both",
    salon = "salon",
    domicile = "domicile"
}
export enum Role {
    pro = "pro",
    client = "client",
    admin = "admin"
}
export enum StatutBooking {
    cancelled = "cancelled",
    disputed = "disputed",
    pending = "pending",
    completed = "completed",
    confirmed = "confirmed"
}
export enum TypeTransaction {
    subscription = "subscription",
    virement = "virement",
    booking = "booking",
    refund = "refund"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    /**
     * / Add a notification. Admin only (system-generated).
     */
    addNotification(notifId: string, userId: Principal, message: string, type: string): Promise<boolean>;
    /**
     * / Add a service to the caller's pro profile.
     */
    addService(service: Service): Promise<boolean>;
    /**
     * / Add a transaction. Admin only.
     */
    addTransaction(txId: string, proId: Principal, montant: number, type: TypeTransaction, ref: string): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    /**
     * / Cancel a booking. Only the client or the pro of that booking may cancel it.
     */
    cancelBooking(bookingId: string): Promise<boolean>;
    /**
     * / Complete a booking. Only the pro of that booking may mark it complete.
     */
    completeBooking(bookingId: string): Promise<boolean>;
    /**
     * / Confirm a booking. Only the pro of that booking may confirm it.
     */
    confirmBooking(bookingId: string): Promise<boolean>;
    /**
     * / Create a booking. Caller must be an authenticated user (client).
     */
    createBooking(bookingId: string, proId: Principal, serviceId: string, date: string, heure: string, montant: number, payrexxRef: string): Promise<boolean>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    /**
     * / Get all bookings for a client. Only the client themselves or an admin.
     */
    getClientBookings(clientId: Principal): Promise<Array<Booking>>;
    /**
     * / Get notifications for a user. Only the user themselves or an admin.
     */
    getNotifications(userId: Principal): Promise<Array<Notification>>;
    /**
     * / Get a pro record. Caller can only fetch their own; admins can fetch any.
     */
    getPro(proId: Principal): Promise<Pro | null>;
    /**
     * / Get all bookings for a pro. Only the pro themselves or an admin.
     */
    getProBookings(proId: Principal): Promise<Array<Booking>>;
    /**
     * / Get the sequestered (escrow) amount for a pro.
     * / Sequestre = sum of pending booking amounts not yet released.
     */
    getProSequestre(proId: Principal): Promise<number>;
    /**
     * / Get the available balance (solde) for a pro.
     * / Solde = sum of completed booking amounts minus virements.
     */
    getProSolde(proId: Principal): Promise<number>;
    /**
     * / Get all transactions for a pro. Only the pro themselves or an admin.
     */
    getProTransactions(proId: Principal): Promise<Array<Transaction>>;
    /**
     * / Get a user record. Caller can only fetch their own; admins can fetch any.
     */
    getUser(userId: Principal): Promise<User | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    /**
     * / List all active pros – public endpoint.
     */
    listPros(): Promise<Array<Pro>>;
    /**
     * / List active pros by category – public endpoint.
     */
    listProsByCategory(cat: Categorie): Promise<Array<Pro>>;
    /**
     * / Mark a notification as read. Only the owner of the notification or an admin.
     */
    markNotificationRead(notifId: string): Promise<boolean>;
    /**
     * / Register the caller as a pro.
     */
    registerPro(name: string, categorie: Categorie, bio: string, adresse: string, ville: string, phone: string, email: string, modeTravail: ModeTravail): Promise<boolean>;
    /**
     * / Register the caller as a client user.
     */
    registerUser(phone: string, email: string, name: string): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    /**
     * / Update an existing service on the caller's pro profile.
     */
    updateService(serviceId: string, updated: Service): Promise<boolean>;
}
