import Int "mo:core/Int";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Timer "mo:core/Timer";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // ─── Access Control ───────────────────────────────────────────────────────
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ─── Data Types ───────────────────────────────────────────────────────────

  public type Role = { #client; #pro; #admin };
  public type ModeTravail = { #domicile; #salon; #both };
  public type Categorie = { #coiffure; #esthetique; #onglerie; #massage; #maquillage; #other };
  public type StatutBooking = { #pending; #confirmed; #completed; #cancelled; #disputed };
  public type TypeTransaction = { #booking; #subscription; #refund; #virement };

  public type Service = {
    id : Text;
    name : Text;
    duree : Nat;
    prix : Float;
    description : Text;
    actif : Bool;
  };

  public type User = {
    id : Principal;
    phone : Text;
    email : Text;
    name : Text;
    role : Role;
    createdAt : Int;
  };

  public type Pro = {
    id : Principal;
    name : Text;
    categorie : Categorie;
    bio : Text;
    adresse : Text;
    ville : Text;
    phone : Text;
    email : Text;
    modeTravail : ModeTravail;
    services : [Service];
    photos : [Text];
    rating : Float;
    reviewCount : Nat;
    actif : Bool;
    subscriptionActive : Bool;
    subscriptionExpiry : Int;
    createdAt : Int;
  };

  public type Booking = {
    id : Text;
    clientId : Principal;
    proId : Principal;
    serviceId : Text;
    date : Text;
    heure : Text;
    montant : Float;
    statut : StatutBooking;
    payrexxRef : Text;
    createdAt : Int;
  };

  public type Notification = {
    id : Text;
    userId : Principal;
    message : Text;
    type_ : Text;
    read_ : Bool;
    createdAt : Int;
  };

  public type Transaction = {
    id : Text;
    proId : Principal;
    montant : Float;
    type_ : TypeTransaction;
    ref_ : Text;
    createdAt : Int;
  };

  // User profile type required by the frontend
  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
    role : Role;
  };

  // ─── Stable Storage ───────────────────────────────────────────────────────

  var usersEntries : [(Principal, User)] = [];
  var prosEntries : [(Principal, Pro)] = [];
  var bookingsEntries : [(Text, Booking)] = [];
  var notificationsEntries : [(Text, Notification)] = [];
  var transactionsEntries : [(Text, Transaction)] = [];
  var userProfilesEntries : [(Principal, UserProfile)] = [];

  var users : Map.Map<Principal, User> = Map.empty();
  var pros : Map.Map<Principal, Pro> = Map.empty();
  var bookings : Map.Map<Text, Booking> = Map.empty();
  var notifications : Map.Map<Text, Notification> = Map.empty();
  var transactions : Map.Map<Text, Transaction> = Map.empty();
  var userProfiles : Map.Map<Principal, UserProfile> = Map.empty();

  // ─── Upgrade Hooks ────────────────────────────────────────────────────────

  system func preupgrade() {
    usersEntries := users.toArray();
    prosEntries := pros.toArray();
    bookingsEntries := bookings.toArray();
    notificationsEntries := notifications.toArray();
    transactionsEntries := transactions.toArray();
    userProfilesEntries := userProfiles.toArray();
  };

  system func postupgrade() {
    users := Map.fromArray(usersEntries);
    pros := Map.fromArray(prosEntries);
    bookings := Map.fromArray(bookingsEntries);
    notifications := Map.fromArray(notificationsEntries);
    transactions := Map.fromArray(transactionsEntries);
    userProfiles := Map.fromArray(userProfilesEntries);
    usersEntries := [];
    prosEntries := [];
    bookingsEntries := [];
    notificationsEntries := [];
    transactionsEntries := [];
    userProfilesEntries := [];
  };

  // ─── Helper ───────────────────────────────────────────────────────────────

  func isGuest(caller : Principal) : Bool {
    caller.isAnonymous()
  };

  func requireUser(caller : Principal) {
    if (isGuest(caller)) {
      Runtime.trap("Unauthorized: Anonymous callers are not allowed");
    };
  };

  func requireAdmin(caller : Principal) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };

  // ─── User Profile (required by frontend) ─────────────────────────────────

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can get their profile");
    };
    userProfiles.get(caller)
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can save their profile");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user)
  };

  // ─── User Registration ────────────────────────────────────────────────────

  /// Register the caller as a client user.
  public shared ({ caller }) func registerUser(phone : Text, email : Text, name : Text) : async Bool {
    requireUser(caller);
    let user : User = {
      id = caller;
      phone = phone;
      email = email;
      name = name;
      role = #client;
      createdAt = Time.now();
    };
    users.add(caller, user);
    // Also save a basic profile
    let profile : UserProfile = {
      name = name;
      email = email;
      phone = phone;
      role = #client;
    };
    userProfiles.add(caller, profile);
    true
  };

  /// Register the caller as a pro.
  public shared ({ caller }) func registerPro(
    name : Text,
    categorie : Categorie,
    bio : Text,
    adresse : Text,
    ville : Text,
    phone : Text,
    email : Text,
    modeTravail : ModeTravail,
  ) : async Bool {
    requireUser(caller);
    let pro : Pro = {
      id = caller;
      name = name;
      categorie = categorie;
      bio = bio;
      adresse = adresse;
      ville = ville;
      phone = phone;
      email = email;
      modeTravail = modeTravail;
      services = [];
      photos = [];
      rating = 0.0;
      reviewCount = 0;
      actif = true;
      subscriptionActive = false;
      subscriptionExpiry = 0;
      createdAt = Time.now();
    };
    pros.add(caller, pro);
    let profile : UserProfile = {
      name = name;
      email = email;
      phone = phone;
      role = #pro;
    };
    userProfiles.add(caller, profile);
    true
  };

  // ─── User / Pro Queries ───────────────────────────────────────────────────

  /// Get a user record. Caller can only fetch their own; admins can fetch any.
  public query ({ caller }) func getUser(userId : Principal) : async ?User {
    requireUser(caller);
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own user record");
    };
    users.get(userId)
  };

  /// Get a pro record. Caller can only fetch their own; admins can fetch any.
  public query ({ caller }) func getPro(proId : Principal) : async ?Pro {
    requireUser(caller);
    if (caller != proId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own pro record");
    };
    pros.get(proId)
  };

  /// List all active pros – public endpoint.
  public query func listPros() : async [Pro] {
    let all = pros.values().toArray();
    all.filter(func(p : Pro) : Bool { p.actif })
  };

  /// List active pros by category – public endpoint.
  public query func listProsByCategory(cat : Categorie) : async [Pro] {
    let all = pros.values().toArray();
    all.filter(func(p : Pro) : Bool { p.actif and p.categorie == cat })
  };

  // ─── Service Management ───────────────────────────────────────────────────

  /// Add a service to the caller's pro profile.
  public shared ({ caller }) func addService(service : Service) : async Bool {
    requireUser(caller);
    switch (pros.get(caller)) {
      case (null) { Runtime.trap("Unauthorized: Caller is not a registered pro") };
      case (?pro) {
        let updated : Pro = {
          id = pro.id;
          name = pro.name;
          categorie = pro.categorie;
          bio = pro.bio;
          adresse = pro.adresse;
          ville = pro.ville;
          phone = pro.phone;
          email = pro.email;
          modeTravail = pro.modeTravail;
          services = pro.services.concat([service]);
          photos = pro.photos;
          rating = pro.rating;
          reviewCount = pro.reviewCount;
          actif = pro.actif;
          subscriptionActive = pro.subscriptionActive;
          subscriptionExpiry = pro.subscriptionExpiry;
          createdAt = pro.createdAt;
        };
        pros.add(caller, updated);
        true
      };
    }
  };

  /// Update an existing service on the caller's pro profile.
  public shared ({ caller }) func updateService(serviceId : Text, updated : Service) : async Bool {
    requireUser(caller);
    switch (pros.get(caller)) {
      case (null) { Runtime.trap("Unauthorized: Caller is not a registered pro") };
      case (?pro) {
        let newServices = pro.services.map(
          func(s : Service) : Service {
            if (s.id == serviceId) { updated } else { s };
          }
        );
        let updatedPro : Pro = {
          id = pro.id;
          name = pro.name;
          categorie = pro.categorie;
          bio = pro.bio;
          adresse = pro.adresse;
          ville = pro.ville;
          phone = pro.phone;
          email = pro.email;
          modeTravail = pro.modeTravail;
          services = newServices;
          photos = pro.photos;
          rating = pro.rating;
          reviewCount = pro.reviewCount;
          actif = pro.actif;
          subscriptionActive = pro.subscriptionActive;
          subscriptionExpiry = pro.subscriptionExpiry;
          createdAt = pro.createdAt;
        };
        pros.add(caller, updatedPro);
        true
      };
    }
  };

  // ─── Booking Management ───────────────────────────────────────────────────

  /// Create a booking. Caller must be an authenticated user (client).
  public shared ({ caller }) func createBooking(
    bookingId : Text,
    proId : Principal,
    serviceId : Text,
    date : Text,
    heure : Text,
    montant : Float,
    payrexxRef : Text,
  ) : async Bool {
    requireUser(caller);
    let booking : Booking = {
      id = bookingId;
      clientId = caller;
      proId = proId;
      serviceId = serviceId;
      date = date;
      heure = heure;
      montant = montant;
      statut = #pending;
      payrexxRef = payrexxRef;
      createdAt = Time.now();
    };
    bookings.add(bookingId, booking);
    // SMS stub – notify pro (French template)
    // sendSMS(pro.phone, "Nouvelle réservation reçue pour le " # date # " à " # heure # ". Veuillez confirmer.");
    true
  };

  /// Confirm a booking. Only the pro of that booking may confirm it.
  public shared ({ caller }) func confirmBooking(bookingId : Text) : async Bool {
    requireUser(caller);
    switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        if (booking.proId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the pro of this booking can confirm it");
        };
        let updated : Booking = {
          id = booking.id;
          clientId = booking.clientId;
          proId = booking.proId;
          serviceId = booking.serviceId;
          date = booking.date;
          heure = booking.heure;
          montant = booking.montant;
          statut = #confirmed;
          payrexxRef = booking.payrexxRef;
          createdAt = booking.createdAt;
        };
        bookings.add(bookingId, updated);
        // SMS stub – notify client (French template)
        // sendSMS(client.phone, "Votre réservation du " # booking.date # " à " # booking.heure # " a été confirmée.");
        true
      };
    }
  };

  /// Complete a booking. Only the pro of that booking may mark it complete.
  public shared ({ caller }) func completeBooking(bookingId : Text) : async Bool {
    requireUser(caller);
    switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        if (booking.proId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the pro of this booking can complete it");
        };
        let updated : Booking = {
          id = booking.id;
          clientId = booking.clientId;
          proId = booking.proId;
          serviceId = booking.serviceId;
          date = booking.date;
          heure = booking.heure;
          montant = booking.montant;
          statut = #completed;
          payrexxRef = booking.payrexxRef;
          createdAt = booking.createdAt;
        };
        bookings.add(bookingId, updated);
        // SMS stub – notify client (French template)
        // sendSMS(client.phone, "Votre prestation du " # booking.date # " est terminée. Merci de laisser un avis.");
        true
      };
    }
  };

  /// Cancel a booking. Only the client or the pro of that booking may cancel it.
  public shared ({ caller }) func cancelBooking(bookingId : Text) : async Bool {
    requireUser(caller);
    switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        if (
          booking.clientId != caller and
          booking.proId != caller and
          not AccessControl.isAdmin(accessControlState, caller)
        ) {
          Runtime.trap("Unauthorized: Only the client or pro of this booking can cancel it");
        };
        let updated : Booking = {
          id = booking.id;
          clientId = booking.clientId;
          proId = booking.proId;
          serviceId = booking.serviceId;
          date = booking.date;
          heure = booking.heure;
          montant = booking.montant;
          statut = #cancelled;
          payrexxRef = booking.payrexxRef;
          createdAt = booking.createdAt;
        };
        bookings.add(bookingId, updated);
        // SMS stub – notify both parties (French template)
        // sendSMS(client.phone, "Votre réservation du " # booking.date # " a été annulée.");
        // sendSMS(pro.phone, "La réservation du " # booking.date # " a été annulée.");
        true
      };
    }
  };

  /// Get all bookings for a pro. Only the pro themselves or an admin.
  public query ({ caller }) func getProBookings(proId : Principal) : async [Booking] {
    requireUser(caller);
    if (caller != proId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own bookings");
    };
    let all = bookings.values().toArray();
    all.filter(func(b : Booking) : Bool { b.proId == proId })
  };

  /// Get all bookings for a client. Only the client themselves or an admin.
  public query ({ caller }) func getClientBookings(clientId : Principal) : async [Booking] {
    requireUser(caller);
    if (caller != clientId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own bookings");
    };
    let all = bookings.values().toArray();
    all.filter(func(b : Booking) : Bool { b.clientId == clientId })
  };

  // ─── Notifications ────────────────────────────────────────────────────────

  /// Add a notification. Admin only (system-generated).
  public shared ({ caller }) func addNotification(
    notifId : Text,
    userId : Principal,
    message : Text,
    type_ : Text,
  ) : async Bool {
    requireAdmin(caller);
    let notif : Notification = {
      id = notifId;
      userId = userId;
      message = message;
      type_ = type_;
      read_ = false;
      createdAt = Time.now();
    };
    notifications.add(notifId, notif);
    true
  };

  /// Get notifications for a user. Only the user themselves or an admin.
  public query ({ caller }) func getNotifications(userId : Principal) : async [Notification] {
    requireUser(caller);
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own notifications");
    };
    let all = notifications.values().toArray();
    all.filter(func(n : Notification) : Bool { n.userId == userId })
  };

  /// Mark a notification as read. Only the owner of the notification or an admin.
  public shared ({ caller }) func markNotificationRead(notifId : Text) : async Bool {
    requireUser(caller);
    switch (notifications.get(notifId)) {
      case (null) { Runtime.trap("Notification not found") };
      case (?notif) {
        if (notif.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only mark your own notifications as read");
        };
        let updated : Notification = {
          id = notif.id;
          userId = notif.userId;
          message = notif.message;
          type_ = notif.type_;
          read_ = true;
          createdAt = notif.createdAt;
        };
        notifications.add(notifId, updated);
        true
      };
    }
  };

  // ─── Transactions ─────────────────────────────────────────────────────────

  /// Add a transaction. Admin only.
  public shared ({ caller }) func addTransaction(
    txId : Text,
    proId : Principal,
    montant : Float,
    type_ : TypeTransaction,
    ref_ : Text,
  ) : async Bool {
    requireAdmin(caller);
    let tx : Transaction = {
      id = txId;
      proId = proId;
      montant = montant;
      type_ = type_;
      ref_ = ref_;
      createdAt = Time.now();
    };
    transactions.add(txId, tx);
    true
  };

  /// Get all transactions for a pro. Only the pro themselves or an admin.
  public query ({ caller }) func getProTransactions(proId : Principal) : async [Transaction] {
    requireUser(caller);
    if (caller != proId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own transactions");
    };
    let all = transactions.values().toArray();
    all.filter(func(t : Transaction) : Bool { t.proId == proId })
  };

  /// Get the available balance (solde) for a pro.
  /// Solde = sum of completed booking amounts minus virements.
  public query ({ caller }) func getProSolde(proId : Principal) : async Float {
    requireUser(caller);
    if (caller != proId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own solde");
    };
    let all = transactions.values().toArray();
    let proTxs = all.filter(func(t : Transaction) : Bool { t.proId == proId });
    proTxs.foldLeft<Transaction, Float>(
      0.0,
      func(acc : Float, t : Transaction) : Float {
        switch (t.type_) {
          case (#booking) { acc + t.montant };
          case (#virement) { acc - t.montant };
          case (#refund) { acc - t.montant };
          case (#subscription) { acc - t.montant };
        }
      },
    )
  };

  /// Get the sequestered (escrow) amount for a pro.
  /// Sequestre = sum of pending booking amounts not yet released.
  public query ({ caller }) func getProSequestre(proId : Principal) : async Float {
    requireUser(caller);
    if (caller != proId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own sequestre");
    };
    let all = bookings.values().toArray();
    let proBookings = all.filter(
      func(b : Booking) : Bool {
        b.proId == proId and (b.statut == #pending or b.statut == #confirmed)
      },
    );
    proBookings.foldLeft<Booking, Float>(
      0.0,
      func(acc : Float, b : Booking) : Float { acc + b.montant },
    )
  };

  // ─── Heartbeat: auto-cancel stale pending bookings (>48h) ─────────────────

  system func heartbeat() : async () {
    let now = Time.now();
    let fortyEightHours : Int = 48 * 60 * 60 * 1_000_000_000;
    let all = bookings.values().toArray();
    for (booking in all.vals()) {
      if (
        booking.statut == #pending and
        (now - booking.createdAt) > fortyEightHours
      ) {
        let updated : Booking = {
          id = booking.id;
          clientId = booking.clientId;
          proId = booking.proId;
          serviceId = booking.serviceId;
          date = booking.date;
          heure = booking.heure;
          montant = booking.montant;
          statut = #cancelled;
          payrexxRef = booking.payrexxRef;
          createdAt = booking.createdAt;
        };
        bookings.add(booking.id, updated);
        // Escrow release stub: refund montant to client via Payrexx
        // await Payrexx.refund(booking.payrexxRef, booking.montant);
        // SMS stub (French template):
        // sendSMS(client.phone, "Votre réservation du " # booking.date # " a été automatiquement annulée faute de confirmation.");
      };
    };
  };

  // ─── Payrexx Webhook Handler (stub) ───────────────────────────────────────
  // public shared func payrexxWebhook(payload : Text) : async () {
  //   // Parse the Payrexx webhook payload
  //   // Verify the signature using the Payrexx secret key
  //   // Extract the transaction reference and status
  //   // Update the corresponding booking status
  //   // If payment confirmed: confirm the booking and notify the pro
  //   //   SMS: "Paiement reçu pour votre réservation du " # date # ". Veuillez confirmer."
  //   // If payment failed: cancel the booking and notify the client
  //   //   SMS: "Le paiement pour votre réservation du " # date # " a échoué. Veuillez réessayer."
  //   // If refund processed: update transaction record
  //   //   SMS: "Votre remboursement de " # montant # " CHF a été traité."
  // };

  // ─── Twilio SMS Sender (stub) ─────────────────────────────────────────────
  // func sendSMS(phone : Text, message : Text) : async () {
  //   // POST to https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages
  //   // Headers: Authorization: Basic base64(AccountSid:AuthToken)
  //   // Body: To=phone&From=TWILIO_NUMBER&Body=message
  //   //
  //   // French SMS templates:
  //   // Nouvelle réservation:
  //   //   "Bonjour, vous avez une nouvelle réservation le [date] à [heure]. Connectez-vous pour confirmer."
  //   // Confirmation client:
  //   //   "Votre réservation du [date] à [heure] avec [pro] est confirmée. À bientôt !"
  //   // Annulation:
  //   //   "Votre réservation du [date] a été annulée. Contactez-nous pour toute question."
  //   // Rappel (24h avant):
  //   //   "Rappel : votre rendez-vous est demain [date] à [heure] avec [pro]. À bientôt !"
  //   // Prestation terminée:
  //   //   "Merci pour votre visite ! Laissez un avis sur votre expérience avec [pro]."
  //   // Paiement reçu:
  //   //   "Paiement de [montant] CHF reçu pour votre réservation du [date]. Merci !"
  //   // Remboursement:
  //   //   "Votre remboursement de [montant] CHF a été initié. Délai : 3-5 jours ouvrés."
  // };
};
