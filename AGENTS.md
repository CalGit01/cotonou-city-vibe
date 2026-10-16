# AGENTS.md — Cotonou City Vibe

Guide urbain + jeu 3D (ville de Cotonou) en React + Vite + react-three-fiber, avec auth Supabase.

## Commandes

- `npm install` — installe les dépendances.
- `npm run dev` — serveur de dev Vite. Ce projet est utilisé sur le port **5199** (`npm run dev -- --host --port 5199`). Recharger avec **Ctrl+F5** après modifications.
- `npm run build` — typecheck (`tsc -b`) + build de production.
- `npx tsc -b --force --pretty false` — typecheck seul (à lancer après tout changement TS).
- `npm run lint` — oxlint.
- `npm run preview` — prévisualise le build.

## Vérification avant de valider une tâche

1. `npx tsc -b --force --pretty false` (aucune sortie = OK)
2. `npm run lint` (les warnings `react(immutability)` / `only-export-components` sont pré-existants)
3. `npm run build`

## Git

- Dépôt distant : `origin` -> https://github.com/CalGit01/cotonou-city-vibe (branche `main`).
- Workflow :
  - `git add -A`
  - `git commit -m "message concis"`
  - `git push`

Ne jamais commiter `.env.local` ni de secrets (déjà couvert par `.gitignore` via `*.local`). Le remote n'est mis à jour que sur demande explicite.

## Environnement

- OS : Windows, shell : PowerShell 5.1.
- Pas de `grep`/`rg`/`head`/`python` : utiliser les outils dédiés (Read/Grep/Glob) ou `Select-String`.
- Pas de `&&` en PowerShell : enchaîner avec `;` ou `cmd1; if ($?) { cmd2 }`.
- Ne pas utiliser `2>&1` (provoque des erreurs PowerShell) ; rediriger via `$null` au besoin.

## Structure clé

- `src/features/home/` — page d'accueil 3D (ville) : `three/` (city.ts, CityCanvas.tsx, Hero.tsx, Crowd.tsx, Traffic.tsx, daynight.ts, ...), `components/` (FloatingHeader, BottomSheet, WalkControls, ...).
- `src/features/auth/` — connexion/inscription Supabase (`pages/AuthPage.tsx`), store `src/store/useAuthStore.ts`.
- `src/features/play/` — life-sim (besoins, métiers, loyer) : `game.ts`, `pages/PlayPage.tsx`.
- `src/store/useAppStore.ts` — préférences (langue, filtres, favoris), persistées.
- `src/lib/` — `supabase.ts`, `profile.ts`, `i18n.ts`.
- `src/locales/{fr,fon,gun,min}/common.json` — traductions (fallback = `fr`).
- `supabase/schema.sql` — schéma (profiles, favorites, visits, chat_messages).

## Notes techniques

- Le temps/éclairage suit l'horloge de l'appareil (`daynight.ts` : `dayFraction`).
- Les `<Html>` de drei (MapLabels, MarkerPins) utilisent un portail DOM hors Canvas pour éviter l'erreur `removeChild` à la navigation.
- Mode exploration : bouton « Explorer à pied » (`WalkControls`), contrôlé par `Hero.tsx` (ZQSD/WASD/flèches, Maj = courir, Échap = quitter). Collisions : bâtiments (empreintes rotées), arbres, zones réservées, véhicules.
- Supabase : URL/anon key dans `.env.local` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).

## État de session (mise à jour 2026-10-16)

### Fait

- App stabilisée (page blanche du ciel corrigée, `StrictMode` retiré) ; erreur drei `removeChild` corrigée via portail DOM hors Canvas pour les `<Html>` (MapLabels, MarkerPins).
- **Mode exploration jouable** : avatar 3e personne (`Hero.tsx`), bouton « Explorer à pied » (`WalkControls`), ZQSD/WASD/flèches, Maj = courir, Échap = quitter ; caméra amortie ; halo au sol. État `explore` dans `LandingPage.tsx` + props `explore`/`onExit` sur `CityCanvas.tsx`.
- **Collisions joueur** : bords de `LAND`, `KEEP_OUT`, empreintes de bâtiments (OBB rotées), arbres, et **véhicules** (`trafficState.ts` : `setVehiclePose`/`hitsVehicle`, publié par `Traffic.tsx`).
- **Météo/éclairage = horloge de l'appareil** (`dayFraction`, `syncToClock` dans `daynight.ts`), luminosité diurne relevée.
- **Rues/environnement** : trottoirs plus clairs, asphalte + marquages plus nets, pavé plus clair, herbe ajustée.
- **Trafic** accéléré/fluidisé ; **piétons sur les routes** (`WALK_RECTS`/`WALK_ROUTES`, `COUNT=48`).
- **Persistance** : backup ZIP `C:\Users\Utilisateur\cotonou-city-vibe-backup-20261016-135338.zip` + dépôt git local poussé sur GitHub.

### À faire (backlog)

- Bâtiments plus variés/asymétriques, façades commerces/balcons (rendu plus proche de GTA V) — objectif visuel principal.
- Brancher favoris / visites / chat sur Supabase (tables déjà dans `supabase/schema.sql` ; favoris encore en local).
- Trafic/piétons avancés : files de véhicules, feux, piétons sur trottoirs, animations idle variées.
- Dashboard Supabase : Auth → Providers → Email → décocher « Confirm email » ; supprimer le compte test `smoke1104357280@gmail.com`.
- (Optionnel) retirer l'UI de debug `installGlobalErrorOverlay` avant lancement.
