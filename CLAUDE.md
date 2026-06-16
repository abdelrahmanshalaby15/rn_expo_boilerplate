@AGENTS.md

# CLAUDE.md

## Project

A React Native **Expo** boilerplate maintained as a starting point for the software house's
client and internal apps. The goal is a batteries-included template: pick it up, rename it, and
ship to the App Store and Play Store with CI/CD and multi-environment support already wired in.

Two pillars define the boilerplate's scope:

1. **Out-of-the-box CI/CD** for both iOS and Android.
2. **Four environments**: Development, Testing, Staging, Production.

> **Expo HAS CHANGED** — this project is on Expo SDK **56**. Read the exact versioned docs at
> https://docs.expo.dev/versions/v56.0.0/ before writing any code. Do not rely on memory of
> older Expo APIs.

## Stack

- Expo SDK `~56` with **expo-router** (`expo-router/entry` is the app entry).
- React `19.2`, React Native `0.85`.
- TypeScript in `strict` mode.
- `react-native-reanimated` v4 + `react-native-worklets` for animation.
- `react-native-web` for the web target.
- Experiments enabled in `app.json`: `typedRoutes` and `reactCompiler`.

## Layout

- `src/app/` — expo-router routes (file-based routing). `_layout.tsx` is the root layout.
- `src/components/` — shared UI. Platform variants use `.web.tsx` / `.tsx` suffixes.
- `src/hooks/` — shared hooks (e.g. `use-color-scheme`, `use-theme`).
- `src/constants/` — `theme.ts` and other constants.
- `src/config/env.ts` — typed runtime access to the active environment and config
  (`env.appEnv`, `env.apiUrl`, `env.isProduction`, …), read from Expo `extra` via
  `expo-constants`. Import `env` instead of reading `process.env`/`Constants` directly.
- Path aliases: `@/*` → `./src/*`, `@/assets/*` → `./assets/*` (see `tsconfig.json`).

## Commands

```bash
npm run start      # expo start (dev server)
npm run ios        # expo start --ios
npm run android    # expo start --android
npm run web        # expo start --web
npm run lint       # expo lint (flat config in eslint.config.js)
npm run typecheck  # tsc --noEmit
```

Linting is pinned and deterministic: `eslint` + `eslint-config-expo` are devDependencies
and `eslint.config.js` is committed, so `expo lint` never auto-installs/configures at runtime
(which previously broke CI under `npm ci`).

## Environments

The boilerplate targets four environments. Each should drive a distinct app variant
(separate bundle/package id, app name, icon, and API base URL) so they can be installed
side by side on one device.

| Environment | Purpose                            | Typical distribution   |
| ----------- | ---------------------------------- | ---------------------- |
| Development | Local feature work, fast iteration | Dev client / simulator |
| Testing     | QA / automated test runs           | Internal build         |
| Staging     | Pre-production, client UAT         | Internal / TestFlight  |
| Production  | Live release                       | App Store / Play Store |

Implementation convention (to be wired up with `eas.json` build profiles + a dynamic
`app.config.ts`): select the environment via an `APP_ENV` / `EXPO_PUBLIC_*` variable and
branch the app name, identifiers, and config from it. Keep secrets out of the repo — use EAS
secrets / environment variables.

## CI/CD

CI/CD covers both platforms end to end:

- **Build & submit** via **EAS Build** + **EAS Submit** — one build profile per environment in
  `eas.json` (`development`, `testing`, `staging`, `production`), each injecting `APP_ENV`.
- **OTA updates** via **EAS Update** (per-environment channels are set in `eas.json`).
- Per-environment app config is resolved at build time by `app.config.ts` (name, scheme,
  bundle id / package per `APP_ENV`), layered over the static `app.json`.

GitHub Actions workflows in `.github/workflows/`:

> **Repo layout note:** this directory (`boilerplate-app`) is the **Git repository root** — the
> app files (`package.json`, `package-lock.json`, etc.) sit at the repo root, not under a nested
> `boilerplate-app/`. Workflow paths (`working-directory`, `cache-dependency-path`, credential
> file paths) are therefore relative to the repo root with **no `boilerplate-app/` prefix**. Keep
> it that way unless the app is moved into a subdirectory.

- `ci.yml` — on PRs / pushes: `npm ci` → `npm run typecheck` → `npm run lint`.
- `eas-build.yml` — manual dispatch (pick environment / platform / submit) or branch push
  (`develop` → testing, `staging` → staging, `main` → production). Needs the `EXPO_TOKEN`
  repo secret.

**Before first use:** run `eas init` to create the EAS project, set the `EXPO_TOKEN` secret,
fill the placeholders in `eas.json` `submit` (Apple ID / ASC app id / team id), and provide the
Google Play service account at `credentials/` (git-ignored).

### Fastlane fallback (no EAS)

A self-managed alternative to EAS lives in `fastlane/` and `.github/workflows/fastlane-build.yml`.
It runs `expo prebuild` to generate the native `ios/` + `android/` projects (driven by `APP_ENV`),
then builds and uploads them with Fastlane — no Expo cloud involved.

- `fastlane/Fastfile` — `ios build` (→ TestFlight) and `android build` (→ Play Store) lanes,
  per-environment via `APP_ENV`.
- `fastlane-build.yml` — manual dispatch only; iOS on `macos-14`, Android on `ubuntu-latest`.
- Run locally: `bundle install` then `APP_ENV=staging bundle exec fastlane ios build`.

You manage signing yourself: iOS via an App Store Connect API key + `match`; Android via a
release keystore + Google Play service-account JSON. Prefer EAS (`eas-build.yml`) as the default;
reach for this when you can't or don't want to use EAS.

**Full step-by-step signing setup (both paths) — keystore generation, `match`, ASC API key,
Play service account, and the complete GitHub secrets table — is in
[`docs/signing-setup.md`](docs/signing-setup.md).**

## Conventions

- TypeScript strict; prefer the `@/` path aliases over relative `../../` chains.
- Use the platform-suffix pattern (`*.web.tsx`) for web-specific component implementations.
- Read per-environment values through `@/config/env`, not `process.env`/`Constants` directly.
- Run `npm run typecheck` and `npm run lint` before committing — both are the CI gate (`ci.yml`).
- ESLint exceptions should be scoped (line-level `eslint-disable-next-line`) with a reason
  comment, as in `src/hooks/use-color-scheme.web.ts` (intentional hydration `setState`).
