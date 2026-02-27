# Specification

## Summary
**Goal:** Overhaul the NEXUS Pro monetization layer by updating the subscription price, adding four new pro screens (Pitch, Stats, Share, Network), enriching the Explorer with Express Services and pro badges, adding visibility boost controls to the Pro Dashboard, and wiring up all new navigation entry points.

**Planned changes:**
- Update all subscription price references from 19.90 CHF to 29.90 CHF across SubscriptionModal, TabPaiement, ProBusinessScreen, and any other frontend strings; preserve the 7-day free trial messaging
- Create `ProPitchScreen` (screen key `pro_pitch`): full conversion landing page with animated hero orbs, headline, three value pillar glass-cards, animated counter counting up to 500+, horizontal-scroll testimonial cards (Unsplash avatars), satisfaction guarantee row, and a CTA button navigating to `pro_subscription`
- Add a "Why NEXUS Pro" link on ProDashboardScreen below the metric cards that navigates to `pro_pitch`
- Create `ProStatsScreen` (screen key `pro_stats`): analytics screen with conversion rate card, animated revenue-per-service bar chart, peak-hours heatmap SVG grid, rating trend line chart, top-3 loyal clients list, and monthly revenue projection card — all with demo data
- Add a "View my stats" link in the ProDashboardScreen next appointment card footer navigating to `pro_stats`
- Create `ProShareScreen` (screen key `pro_share`): social sharing screen with a profile preview card, inline SVG QR code (pure TypeScript matrix, no library), and four share option buttons (Copy link, WhatsApp, SMS, Instagram) with correct onClick handlers and toasts
- Add "Share my profile" pill buttons on ProDashboardScreen (greeting section) and ProBusinessScreen (tabs 1 and 2 CTA zone), both navigating to `pro_share`
- Create `ProNetworkScreen` (screen key `pro_network`): referral/micro-network screen with a copyable referral code card, reward explanation, stats row (pros invited / months earned), list of 3 demo network pros with status badges, and an "Invite a colleague" CTA navigating to `pro_share`
- Add a "My Network" glass-card entry row on both ProDashboardScreen (below next appointment card) and ProBusinessScreen (bottom of scroll zone on all tabs), navigating to `pro_network`
- Add a `getBadges(pro)` utility and render badge pills ("Top Pro", "Flash Expert", "NEXUS Certified", "New") on ExplorerScreen Available Now cards (bottom-left overlay), Experts for You rows (inline), and FicheProScreen (below pro name); update PROS_DEMO badge flags accordingly
- Add a "Boost my visibility" glass-card section to ProDashboardScreen with three tiers (Standard active, Premium +5 CHF/week, Flash 24h +2 CHF/day) including an animated BOOST badge and showToast "coming soon" handlers; render animated BOOST overlay badge on qualifying pro cards in ExplorerScreen
- Add an "Express Services" horizontal-scroll section to ExplorerScreen (above "Available now", visible on All/Flash filters) showing only flash pros in compact 140×180px cards with a pulsing gold border animation when location is active; sort by Haversine distance when location is active
- Add `pro_pitch`, `pro_stats`, `pro_share`, `pro_network` to the Screen union type in `useAppState.ts`
- Add corresponding cases in `App.tsx` `renderScreen()` for all four new screens

**User-visible outcome:** Pro users see the updated 29.90 CHF pricing everywhere, can explore a compelling pitch screen, access detailed analytics, share their profile via QR code and social channels, manage their referral network, earn badges displayed publicly on their cards and profile, activate visibility boosts, and clients discover available pros faster via the new Express Services section.
