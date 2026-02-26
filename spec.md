# Specification

## Summary
**Goal:** Fix the NEXUS Explorer client screen — resolving navigation bugs, layout issues, missing demo data, and broken FichePro access.

**Planned changes:**
- In `useAppState.ts`: add `'explorer'` to the `Screen` union type, set `clientTab` default to `'explorer'`, ensure `go('explorer')` works without error, and confirm `initialState.screen` defaults to `'login'`
- In `App.tsx`: add/fix the `case 'explorer'` branch in `renderScreen()` to render `<ExplorerScreen go={go} state={state} update={update} />` with exact lowercase spelling and no fallthrough
- Rewrite `ExplorerScreen.tsx` with a mandatory flex-column layout: absolute header (56px, z-index 100), flex-1 scroll zone (overflowY auto, paddingTop 72px), and TabBarClient in natural flex flow (never position fixed)
- Add hero heading "Find your expert", 58px search bar, horizontally-scrollable filter pills (All / Flash / Barber / Coiffure / Esthetique / Massage), "Available now" horizontal pro card scroll (168×228px), and "Experts for you" vertical list
- Define `PROS_DEMO` constant with exactly 6 demo professional entries using the specified Unsplash images; display these when canister is unavailable or returns empty, replace with real data when canister responds
- All `<img>` elements must include `onError` handlers to hide broken images or show a gradient fallback
- Show "No experts available" empty state (Inter 500 14px #54546C) when no pros match the active filter
- Tapping a pro card calls `update({ selectedPro: pro })` then `go('fiche_pro')`
- Wire all four TabBarClient tab onClick handlers to their respective screens (`explorer`, `client_reservations`, `client_alertes`, `client_profil`)
- In `FicheProScreen.tsx`: add a null-guard that calls `go('explorer')` and returns null when `state.selectedPro` is null/undefined; ensure back button calls `go('explorer')`

**User-visible outcome:** After OTP validation, a client user is correctly navigated to the Explorer screen, sees demo pro cards with images, can filter by category, tap a card to open FichePro, and navigate via the tab bar — with no blank screens or navigation dead ends.
