# Specification

## Summary
**Goal:** Perform a comprehensive auth fix, navigation overhaul, layout audit, and full-app polish for the NEXUS application to eliminate infinite loops, broken navigation, hidden content, and visual inconsistencies across all screens.

**Planned changes:**
- Rewrite `LoginScreen.tsx` to eliminate infinite re-render loop; "SE CONNECTER" button always navigates to `role` screen within 1 second with an 800ms loading state auto-clear
- Rewrite `useAppState.ts` to always start on `login` screen, make `go()` unconditional, ensure all state fields are present with correct defaults, and cap toasts at 4
- Rewrite `App.tsx` with a production-ready router covering all 28 screen cases, desktop two-column layout (220px sidebar + main), mobile max-width 430px, fadeIn 200ms screen transitions, and Toast/NotifsPanel overlays
- Audit and fix root layout of every screen so content is always scrollable and visible: `position fixed inset-0`, flex column, header absolute 56px, scroll zone `flex-1 overflow-y auto`, tab bar and CTA in natural flex flow, no black empty space
- Update `globals.css` with `100dvh` on html/body, safe-area inset variable, `.screen-root`, `.scroll-zone`, `.cta-zone`, `.tab-bar` utility classes, all keyframe animations with GPU hints, and correct breakpoints at 430px/768px/900px
- Fix `OTPScreen` with a role guard redirecting to `role` if `state.role` is null, demo mode accepting any 4-digit code, and correct post-auth navigation per role
- Fix all buttons to have functional `onClick` handlers, remove permanent disabling, enforce press `scale(0.96)` micro-interaction, and ensure all gold CTA buttons are visible
- Fix all form inputs to be fully controlled, have visible labels, show validation errors in `#FF3D5A`, enforce `font-size >= 16px` and height 52px
- Fix all `img` tags with `onError` fallback hiding broken images and a gradient fallback div always rendered behind each image
- Ensure demo data is always shown on mount for every screen (ExplorerScreen, ProRadarScreen, ProWalletScreen, ReservationsScreen, AlertesScreen, all Admin screens); canister calls wrapped in try/catch with demo data fallback
- Fix all navigation: back arrows, logo click routing to role-appropriate home, role-switch pills, and all tab bar items for Client/Pro/Admin
- Fix the complete 5-step booking flow (Booking1–5) to work end-to-end without canister dependency, with Booking5 auto-navigating to `live_status` after 8 seconds
- Fix `ProBusinessScreen` and all 5 tabs: correct layout, save-and-continue with spinner/toast, gallery file upload, SubscriptionModal trigger, and fallback navigation to `pro_success`
- Fix `AdminLoginScreen` to use local credential check only (`admin@nexus.ch` / `Admin2024!`), no canister call
- Enforce global visual consistency: correct text colors for all backgrounds, consistent border-radius values, all inputs 52px, all CTAs 56px, zero emoji everywhere
- Implement desktop sidebar in `App.tsx` with role-appropriate nav items (client/pro/admin), gold active color, hidden on mobile
- Rewrite `Header.tsx` with back button, logo click, role-switch pill, and notification badge with correct animations and props
- Rewrite `BtnPrimary.tsx` with gold gradient, disabled/danger/loading states, press scale, and `flex-shrink: 0`
- Rewrite `Toast.tsx` with type-based icons, slideDown/slideUp animations, max 4 toasts, auto-dismiss at 3500ms, and desktop right-alignment
- Rewrite `BottomSheet.tsx` as mobile bottom sheet and desktop centered modal with scrollable content and sticky footer
- Rewrite `TabBarClient.tsx`, `TabBarPro.tsx`, and `TabBarAdmin.tsx` with hidden display on desktop, gold indicator line animation, active icon scale, and correct `go()` navigation
- Rewrite `NotifsPanel.tsx` as mobile full-width right slide-in and desktop 400px drawer with staggered fadeIn, type-based icons, and count chip

**User-visible outcome:** The NEXUS app starts reliably on the login screen, all navigation flows work without loops or dead ends, every screen scrolls and displays its content fully on both mobile and desktop, all buttons and forms are functional, and the entire app maintains consistent visual polish with no broken images, no emoji, and always-visible demo data.
