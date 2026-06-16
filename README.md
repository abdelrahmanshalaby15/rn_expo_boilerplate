# Expo Boilerplate

A batteries-included **React Native + Expo** starter, maintained as the launch pad for our
client and internal apps. Clone it, rename it, and ship to the App Store and Play Store with
CI/CD, multi-environment builds, state management, networking, theming, and full RTL
internationalization already wired in.

Two pillars define the boilerplate's scope:

1. **Out-of-the-box CI/CD** for both iOS and Android (EAS, with a self-managed Fastlane fallback).
2. **Four environments** — Development, Testing, Staging, Production — each a separate installable app.

> ⚠️ **Expo SDK 56.** This project tracks Expo **SDK 56**. APIs have changed across recent SDKs —
> always check the versioned docs at <https://docs.expo.dev/versions/v56.0.0/> rather than relying
> on memory of older Expo APIs.

---

## Table of contents

- [Tech stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [Project structure](#project-structure)
- [Environments & configuration](#environments--configuration)
- [Daily development workflow](#daily-development-workflow)
- [Architecture & conventions](#architecture--conventions)
  - [Path aliases](#path-aliases)
  - [Routing (expo-router)](#routing-expo-router)
  - [State & data](#state--data)
  - [Networking](#networking)
  - [Theming](#theming)
  - [Internationalization & RTL](#internationalization--rtl)
  - [Adding a new feature](#adding-a-new-feature)
- [CI/CD](#cicd)
  - [Quality gate (CI)](#quality-gate-ci)
  - [EAS build & submit](#eas-build--submit)
  - [Fastlane fallback](#fastlane-fallback)
- [Renaming the boilerplate for a new app](#renaming-the-boilerplate-for-a-new-app)
- [Troubleshooting](#troubleshooting)
- [Reference](#reference)

---

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | Expo SDK `~56`, React Native `0.85`, React `19.2` |
| Language | TypeScript (`strict` mode) |
| Routing | [`expo-router`](https://docs.expo.dev/router/introduction) (file-based), native tabs, **typed routes** |
| Client/global state | [Redux Toolkit](https://redux-toolkit.js.org/) + `react-redux` + `redux-persist` (AsyncStorage) |
| Server state | [TanStack Query v5](https://tanstack.com/query) |
| Networking | Typed `fetch` wrapper (`apiClient`) with a custom `ApiError` |
| i18n | `i18next` + `react-i18next` + `expo-localization`, full **RTL** support (English + Arabic) |
| Animation | `react-native-reanimated` v4 + `react-native-worklets` |
| Web | `react-native-web` (static output) |
| Linting | ESLint flat config (`eslint-config-expo`), pinned & committed |
| CI/CD | GitHub Actions → EAS Build/Submit/Update; Fastlane fallback |
| Experiments | `typedRoutes` + `reactCompiler` (enabled in `app.json`) |

---

## Prerequisites

- **Node.js 20.x** (CI and EAS build on `20.18.0` — match it locally; [nvm](https://github.com/nvm-sh/nvm) recommended).
- **npm** (the repo commits `package-lock.json`; CI uses `npm ci`).
- **Watchman** (recommended on macOS): `brew install watchman`.
- For **iOS** builds: macOS with **Xcode** + an iOS Simulator.
- For **Android** builds: **Android Studio** + an emulator (or a device with USB debugging).
- For **CI/CD**: an [Expo](https://expo.dev) account and the **EAS CLI** (`npm i -g eas-cli`).
- For the **Fastlane** path only: **Ruby 3.2** + Bundler (`bundle install`, uses the committed `Gemfile`).

> This boilerplate uses native modules (reanimated, native tabs, glass effect, etc.), so **Expo Go
> is not enough** for the full experience — you'll want a **development build** (`expo run:ios` /
> `expo run:android` or an EAS `development` build).

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. (Optional) configure your local environment
cp .env.example .env.local
#    edit .env.local — set APP_ENV and, if needed, EXPO_PUBLIC_API_URL

# 3a. Start the Metro dev server (then press i / a / w to open a target)
npm run start

# 3b. …or build & run a native dev build directly
npm run ios          # build + run on iOS simulator/device
npm run android      # build + run on Android emulator/device
npm run web          # run in the browser
```

Before you commit, run the same checks CI runs:

```bash
npm run typecheck    # tsc --noEmit
npm run lint         # expo lint
```

> **Note on directory layout:** the app lives in `boilerplate-app/`, which is itself the **Git
> repository root** — `package.json`, workflows, and EAS config sit at that root with **no nested
> `boilerplate-app/` prefix**. All commands below are run from inside `boilerplate-app/`.

---

## Project structure

The codebase is **feature-based**: each feature owns its slice of the app, with a small set of
shared/app-global layers around it.

```
boilerplate-app/
├── app.json              # Static Expo config (plugins, icons, experiments)
├── app.config.ts         # Dynamic config — resolves per-environment values from APP_ENV
├── eas.json              # EAS build/submit profiles (one per environment)
├── eslint.config.js      # ESLint flat config (committed, deterministic)
├── tsconfig.json         # TS strict + path aliases
├── .env.example          # Template for .env.local
├── Gemfile               # Ruby deps for the Fastlane fallback
├── fastlane/             # Fastfile + Appfile (self-managed build path)
├── .github/workflows/    # ci.yml, eas-build.yml, fastlane-build.yml
├── docs/signing-setup.md # Full code-signing setup (EAS + Fastlane)
├── scripts/              # reset-project.js
├── assets/               # icons, splash, tab icons, images
└── src/
    ├── app/              # expo-router routes (file-based)
    │   ├── _layout.tsx   # Root layout — mounts providers, bootstraps locale, tabs
    │   ├── index.tsx     # Home screen
    │   └── explore.tsx   # Explore screen (showcases every wired-in capability)
    ├── components/        # Shared UI (ThemedText/View, tabs, language switcher, …)
    │   └── ui/            # Lower-level primitives (collapsible, …)
    ├── config/
    │   └── env.ts        # Typed runtime access to the active environment
    ├── constants/
    │   └── theme.ts      # Colors, Fonts, Spacing, layout constants
    ├── features/          # Self-contained features (see “Adding a feature”)
    │   ├── counter/      # Reference: client state via Redux (persisted)
    │   └── todos/        # Reference: server state via TanStack Query
    ├── hooks/             # Shared hooks (use-color-scheme, use-theme)
    ├── i18n/              # Locale registry, i18next init, useLocale, locales/*.json
    ├── providers/
    │   └── app-providers.tsx  # Composes Redux + PersistGate + Query providers
    ├── services/          # Cross-feature infra
    │   ├── api-client.ts        # Typed fetch wrapper + ApiError
    │   ├── query-client.ts      # TanStack QueryClient singleton
    │   └── react-query-native.ts# AppState focus bridge (+ opt-in NetInfo)
    └── store/             # Redux store wiring
        ├── index.ts             # configureStore + persistor + RootState/AppDispatch
        ├── hooks.ts             # Typed useAppDispatch / useAppSelector
        ├── root-reducer.ts      # Single registration point for feature reducers
        └── persist-config.ts    # redux-persist whitelist
```

**Layering rules of thumb:**

- **Routes are thin.** Files in `src/app/` render a feature's screen/components and little else.
- **Features are self-contained.** A feature owns its `store/` (slice + selectors), `api/` (typed
  calls + DTO types), `hooks/`, `components/`, and optional `screens/`, and exposes a barrel `index.ts`.
- **Shared layers wrap features:** `store/`, `services/`, `providers/`, `components/`, `hooks/`,
  `i18n/`, `config/`, `constants/`.

---

## Environments & configuration

The boilerplate targets **four environments**, each a distinct app variant (separate bundle/package
id, name, scheme, and API URL) so they can be installed side by side on one device.

| Environment | `APP_ENV` | App name | Bundle id / package | Typical distribution |
| --- | --- | --- | --- | --- |
| Development | `development` | Boilerplate (Dev) | `io.vctors.boilerplate.dev` | Dev client / simulator |
| Testing | `testing` | Boilerplate (Test) | `io.vctors.boilerplate.test` | Internal build |
| Staging | `staging` | Boilerplate (Staging) | `io.vctors.boilerplate.staging` | Internal / TestFlight |
| Production | `production` | Boilerplate | `io.vctors.boilerplate` | App Store / Play Store |

### How config flows

```
APP_ENV  ──►  app.config.ts  ──►  Expo `extra`  ──►  src/config/env.ts  ──►  your code (import { env })
 (eas.json /        (per-env name,      (apiUrl,         (typed, validated)
  .env.local)        bundleId, scheme,   appEnv)
                     apiUrl)
```

1. **`APP_ENV`** selects the variant. It's injected by each EAS build profile (`eas.json`) and
   defaults to `development` for local runs.
2. **`app.config.ts`** spreads the static `app.json`, then overrides `name`, `scheme`,
   `ios.bundleIdentifier`, `android.package`, and `extra.apiUrl` based on `APP_ENV`.
   `EXPO_PUBLIC_API_URL` (e.g. from `.env.local`) overrides the per-environment default API URL.
3. **`src/config/env.ts`** reads those values back at runtime (via `expo-constants`) into a typed,
   validated `env` object. It **throws on startup if `apiUrl` is missing**, so misconfiguration
   fails fast.

### Reading config in code

Always import `env` — never read `process.env` or `Constants` directly:

```ts
import { env } from '@/config/env';

env.appEnv;        // 'development' | 'testing' | 'staging' | 'production'
env.apiUrl;        // active API base URL
env.isProduction;  // booleans: isDevelopment / isTesting / isStaging / isProduction
```

### Local `.env.local`

```bash
# One of: development | testing | staging | production
APP_ENV=development

# EAS project id (run `eas init` to generate, or paste from expo.dev)
EAS_PROJECT_ID=

# Optional: override the API base URL for local runs
# EXPO_PUBLIC_API_URL=https://api.dev.example.com
```

> **Keep secrets out of the repo.** `.env.local` is git-ignored. For CI/EAS, use **EAS secrets** or
> repo **GitHub secrets** (see [CI/CD](#cicd)). Per-environment values for builds come from the EAS
> build profiles, not from committed files.

The default API URLs in `app.config.ts` (`api.*.example.com`) are placeholders — point them (or
`EXPO_PUBLIC_API_URL`) at your real backend. To see the `todos` reference feature render data,
aim `apiUrl` at a JSONPlaceholder-style `/todos` API (e.g. `https://jsonplaceholder.typicode.com`).

---

## Daily development workflow

| Command | What it does |
| --- | --- |
| `npm run start` | Start the Metro dev server (then press `i`/`a`/`w` to open a target) |
| `npm run ios` | `expo run:ios` — build & run a native dev build on iOS |
| `npm run android` | `expo run:android` — build & run a native dev build on Android |
| `npm run web` | `expo start --web` — run in the browser |
| `npm run lint` | `expo lint` — ESLint flat config |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run reset-project` | Move the starter code aside and scaffold a blank `app/` (fresh start) |

**Dev menu:** shake a physical device, or press `cmd+d` (iOS sim) / `cmd+m` (Android emulator), or
`m` in the terminal.

**Before committing**, run `npm run typecheck` and `npm run lint` — both are the CI gate (`ci.yml`)
and will block your PR if they fail.

> Linting is **pinned and deterministic**: `eslint` + `eslint-config-expo` are devDependencies and
> `eslint.config.js` is committed, so `expo lint` never auto-installs/configures at runtime (which
> previously broke CI under `npm ci`).

---

## Architecture & conventions

### Path aliases

Prefer aliases over relative `../../` chains (configured in `tsconfig.json`):

| Alias | Resolves to |
| --- | --- |
| `@/*` | `./src/*` |
| `@/store` | `./src/store/index.ts` |
| `@/assets/*` | `./assets/*` |

```ts
import { ThemedText } from '@/components/themed-text';
import { useAppSelector } from '@/store/hooks';
import logo from '@/assets/images/react-logo.png';
```

### Routing (expo-router)

File-based routing lives in `src/app/`. Two screens ship (`index.tsx` = Home, `explore.tsx` =
Explore), wired into native tabs by `src/components/app-tabs.tsx` and mounted from the root
`_layout.tsx`. `typedRoutes` is enabled, so route strings are type-checked.

`src/app/_layout.tsx` is the single root layout. It:

- wraps the app in `<AppProviders>` (Redux + persist + Query),
- bootstraps the saved locale / RTL direction once on mount (`bootstrapLocale()`),
- applies the light/dark navigation theme,
- renders the animated splash overlay and the tab navigator.

Keep routes thin — they should render a feature's screen/components, not contain business logic.

### State & data

Two distinct concerns, two tools — **keep them separate**:

**Client / global state → Redux Toolkit.**

- Create a slice in the feature's `store/` with `createSlice`.
- Register it **once** in `src/store/root-reducer.ts`.
- Read/write through the **typed** `useAppDispatch` / `useAppSelector` from `@/store/hooks` — never
  the raw react-redux hooks.
- Expose a small **facade hook** (e.g. `useCounter`) so components don't touch Redux directly.
- To **persist** a slice across restarts, add its key to the `whitelist` in
  `src/store/persist-config.ts` — persistence is opt-in.

Reference: `src/features/counter/` (a persisted slice + `useCounter` facade + `CounterCard`).

**Server state → TanStack Query.**

- Put `useQuery` / `useMutation` hooks in the feature's `hooks/`.
- They call typed functions in the feature's `api/`, which go through `@/services/api-client`.
- Use a central **query-keys** object per feature and `invalidateQueries` after mutations.
- **Don't** duplicate server data into Redux — let the Query cache own it.

Reference: `src/features/todos/` (`getTodos`/`createTodo` → `useTodos`/`useCreateTodo`, with
`todoKeys`).

**Provider wiring** (`src/providers/app-providers.tsx`), outer → inner:

```
ReduxProvider → PersistGate (splash overlay until rehydration) → QueryClientProvider
```

On native, queries refetch when the app returns to the foreground via the AppState focus bridge in
`src/services/react-query-native.ts`. The QueryClient defaults (`src/services/query-client.ts`):
`retry: 2`, `staleTime: 30s`, `gcTime: 5m`, `refetchOnWindowFocus`. The offline bridge (NetInfo) is
a documented opt-in (`npx expo install @react-native-community/netinfo` + a dev-client rebuild).

### Networking

All HTTP goes through the typed client in `src/services/api-client.ts`:

```ts
import { apiClient, ApiError } from '@/services/api-client';

const todos = await apiClient.get<Todo[]>('/todos');
const created = await apiClient.post<Todo>('/todos', { title: 'New' });
// apiClient also exposes .put / .patch / .delete
```

- The base URL comes from `env.apiUrl`; JSON `Content-Type`/`Accept` headers are set for you.
- Non-2xx responses throw an **`ApiError`** carrying `.status` and the parsed `.body`.
- Empty (`204`) responses are tolerated.
- **Never** call `fetch` or read `env`/`process.env` directly inside a feature — the client owns
  base URL, headers, and error handling. Add auth headers in one place (there's a commented
  `Authorization` example in the client).

### Theming

Colors, fonts, and spacing live in `src/constants/theme.ts`:

- **`Colors`** — light & dark palettes (`text`, `background`, `backgroundElement`,
  `backgroundSelected`, `textSecondary`).
- **`Fonts`** — platform-aware font families.
- **`Spacing`** — a numeric scale (`half`…`six`); plus `BottomTabInset` and `MaxContentWidth`.

Use the themed primitives and `useTheme()` so components adapt to light/dark automatically:

```tsx
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

<ThemedView type="backgroundElement">
  <ThemedText type="subtitle">Hello</ThemedText>
</ThemedView>
```

`ThemedText` supports `type`: `default | title | subtitle | small | smallBold | link | linkPrimary
| code`, and an optional `themeColor`. `useTheme()` returns the active palette (defaults to light
when the scheme is `unspecified`).

> **Web-specific UI:** use the platform-suffix pattern — e.g. `component.tsx` (native) +
> `component.web.tsx` (web). Several components (`animated-icon`, `app-tabs`, `use-color-scheme`)
> already do this.

### Internationalization & RTL

The app ships **translated and RTL-ready** (English + Arabic) out of the box.

- **Registry — the single source of truth** is `src/i18n/config.ts`. Each locale has a `label` and
  an `rtl` flag. Device fallback, the switcher UI, and RTL handling are all driven off this registry.
- **Translations** live in `src/i18n/locales/*.json`. `en.json` is the source of truth; `ar.json`
  mirrors its shape. `en.json`'s type is fed back into i18next (`src/i18n/i18next.d.ts`) so `t()` /
  `<Trans i18nKey>` keys are **type-checked and autocompleted**. Keep the files structurally
  identical.

**Using translations:**

```tsx
import { useTranslation, Trans } from 'react-i18next';

const { t } = useTranslation();
t('home.welcome');

// For strings with inline markup:
<Trans i18nKey="home.devMenu.web" components={{ code: <ThemedText type="code" /> }} />
```

**Switching language** — `useLocale()` returns `{ locale, isRTL, locales, setLocale }`.
`setLocale(code)` persists the choice (AsyncStorage), changes the language, and — when the text
direction flips — applies `I18nManager.forceRTL` and **reloads the app** so the new direction takes
effect. `<LanguageSwitcher>` (in the Explore screen) is the reference UI.

**RTL caveats:**

- On **native**, `forceRTL` persists across launches and **requires a reload** to apply — this is
  expected, not a bug. `bootstrapLocale()` (run once in `_layout.tsx`) reconciles saved preference ↔
  device locale ↔ RTL and reloads at most once if direction must change.
- On **web**, the flag doesn't survive a reload, so the direction is applied to `document.dir` live
  (no reload).
- Use **`start`/`end`** (not `left`/`right`) in direction-sensitive styles so layouts mirror
  automatically.

**Adding a language:** drop `locales/<code>.json` next to the others, add an entry in
`src/i18n/config.ts`, and import it in `src/i18n/index.ts`. Everything else follows.

### Adding a new feature

A feature is a self-contained folder under `src/features/<feature>/`. Typical shape:

```
src/features/<feature>/
├── api/                 # typed API calls + DTO types (server-state features)
│   ├── <feature>-api.ts
│   └── <feature>.types.ts
├── components/          # feature UI
├── hooks/               # facade hooks / query hooks
├── store/               # Redux slice + selectors (client-state features)
│   ├── <feature>-slice.ts
│   └── <feature>-selectors.ts
└── index.ts             # barrel — the feature's public surface
```

1. **Client state?** Add a slice in `store/`, register its reducer in
   `src/store/root-reducer.ts`, and (if it should survive restarts) add its key to the `whitelist`
   in `src/store/persist-config.ts`. Expose a facade hook from `hooks/`.
2. **Server state?** Add typed calls in `api/` (going through `apiClient`), then `useQuery`/
   `useMutation` hooks in `hooks/` with a central query-keys object.
3. **UI** goes in `components/` (and `screens/` if it owns full screens).
4. **Export** the public surface from `index.ts`.
5. **Render** it from a thin route in `src/app/`.

> Register reducers in `root-reducer.ts` by importing the slice file directly (not the feature
> barrel) so the store module never pulls feature UI in.

---

## CI/CD

CI/CD covers both platforms end to end. GitHub Actions workflows are in `.github/workflows/`.

> All workflow paths (`working-directory`, `cache-dependency-path`, credential paths) are relative
> to the repo root with **no `boilerplate-app/` prefix**, because `boilerplate-app/` *is* the repo
> root. Keep it that way unless you move the app into a subdirectory.

### Quality gate (CI)

`ci.yml` runs on every PR and on pushes to `main`/`develop`:

```
npm ci → npm run typecheck → npm run lint
```

### EAS build & submit

`eas-build.yml` builds (and optionally submits) via **EAS Build** + **EAS Submit**, using one build
profile per environment in `eas.json`. Each profile injects `APP_ENV` and sets an EAS Update
`channel`.

**Triggers:**

- **Manual dispatch** — pick environment (`development`/`testing`/`staging`/`production`), platform
  (`all`/`ios`/`android`), and whether to submit to the stores.
- **Branch push** — `develop` → `testing`, `staging` → `staging`, `main` → `production`.

**Build profiles** (`eas.json`): all extend a `base` profile (Node `20.18.0`, iOS `m-medium`).
`development` is a dev client + internal distribution; `staging`/`production` use `autoIncrement`;
`production` uses `store` distribution.

**First-time setup:**

```bash
npm i -g eas-cli
eas login
eas init            # creates the EAS project + writes the projectId
eas credentials     # interactively generate/sync iOS + Android signing
```

Then:

1. Add the **`EXPO_TOKEN`** repo secret (expo.dev → Account → Settings → Access tokens).
2. Fill the `submit` placeholders in `eas.json` (Apple ID, ASC app id, Apple team id).
3. Drop the Google Play service-account JSON at `credentials/google-play-service-account.json`
   (git-ignored).

**OTA updates** go through **EAS Update** on the per-environment channels set in `eas.json`.

### Fastlane fallback

A self-managed alternative to EAS lives in `fastlane/` and `.github/workflows/fastlane-build.yml`
(manual dispatch only; iOS on `macos-14`, Android on `ubuntu-latest`). It runs `expo prebuild` to
generate the native `ios/`+`android/` projects (driven by `APP_ENV`), then builds and uploads them
with Fastlane — no Expo cloud involved.

- `fastlane/Fastfile` — `ios build` (→ TestFlight) and `android build` (→ Play Store) lanes,
  per-environment via `APP_ENV`.
- You manage signing yourself: **iOS** via an App Store Connect API key + `match`; **Android** via
  a release keystore + a Google Play service-account JSON.

Run locally:

```bash
bundle install
APP_ENV=staging bundle exec fastlane ios build
APP_ENV=staging bundle exec fastlane android build
```

Prefer **EAS** as the default; reach for Fastlane only when you can't or don't want to use EAS.

> 📖 **Full step-by-step signing setup** for both paths — keystore generation, `match`, ASC API
> key, Play service account, and the complete GitHub secrets table — is in
> [`docs/signing-setup.md`](docs/signing-setup.md).

---

## Renaming the boilerplate for a new app

When you start a real project from this template:

1. **Bundle base & names** — in `app.config.ts`, change `BUNDLE_BASE` (e.g.
   `com.yourco.yourapp`) and the per-environment `name`, `scheme`, and `apiUrl` values.
2. **Static config** — update `name`/`slug` in `app.json` (and icons/splash under `assets/`).
3. **Package name** — update `name` in `package.json`.
4. **EAS project** — run `eas init` to create a fresh project id; set the `EAS_PROJECT_ID` /
   `app.config.ts` `extra.eas.projectId` accordingly.
5. **Submit config** — replace the placeholders in `eas.json` (`submit`) and the Fastlane
   `ENVIRONMENTS` bundle ids in `fastlane/Fastfile` / `fastlane/Appfile`.
6. **Secrets** — add `EXPO_TOKEN` (and any Fastlane secrets) in your new repo.
7. **Want a clean slate for app code?** `npm run reset-project` moves the example screens aside and
   scaffolds an empty `app/` directory.

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `Missing apiUrl in Expo config extra` on launch | `app.config.ts` couldn't resolve an API URL. Set `EXPO_PUBLIC_API_URL` in `.env.local` or fix the per-env defaults. |
| RTL layout doesn't flip on native | Expected — `forceRTL` needs an app reload; `setLocale`/`bootstrapLocale` handle this automatically. Don't fight it. |
| Native module not found / red screen after adding a native dep | Rebuild the dev client (`npm run ios` / `npm run android`); a JS reload isn't enough for native modules. |
| `expo lint` behaves differently in CI | Linting is pinned via committed `eslint.config.js` + devDeps — don't remove them; run `npm ci` to match CI. |
| Queries don't refetch on foreground (native) | The AppState focus bridge must be mounted — it lives in `app-providers.tsx`; keep it there. |
| Wrong environment / bundle id in a build | Check the `APP_ENV` injected by the EAS build profile (`eas.json`) or your local `.env.local`. |
| ESLint exception needed | Scope it: line-level `eslint-disable-next-line` **with a reason comment** (see `src/hooks/use-color-scheme.web.ts`). |

---

## Reference

- **Expo SDK 56 docs (versioned):** <https://docs.expo.dev/versions/v56.0.0/>
- **expo-router:** <https://docs.expo.dev/router/introduction>
- **EAS Build / Submit / Update:** <https://docs.expo.dev/eas/>
- **Redux Toolkit:** <https://redux-toolkit.js.org/>
- **TanStack Query:** <https://tanstack.com/query/latest>
- **react-i18next:** <https://react.i18next.com/>
- **Signing setup (this repo):** [`docs/signing-setup.md`](docs/signing-setup.md)
- **Contributor/agent notes (this repo):** [`CLAUDE.md`](CLAUDE.md)

---

_Maintained as our standard app launch pad. Keep it batteries-included: when you solve a
cross-cutting problem here, fold the solution back into the boilerplate._
