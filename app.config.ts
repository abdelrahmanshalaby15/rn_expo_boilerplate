import type { ConfigContext, ExpoConfig } from "expo/config";

// Supported build environments. APP_ENV is injected per EAS build profile
// (see eas.json) and defaults to "development" for local runs.
type AppEnv = "development" | "testing" | "staging" | "production";

const APP_ENV = (process.env.APP_ENV as AppEnv) ?? "development";

// Reverse-DNS base used for the iOS bundle id and Android package name.
const BUNDLE_BASE = "io.vctors.boilerplate";

type EnvConfig = {
  name: string;
  scheme: string;
  bundleId: string;
  apiUrl: string;
};

const ENVIRONMENTS: Record<AppEnv, EnvConfig> = {
  development: {
    name: "Boilerplate (Dev)",
    scheme: "boilerplateapp.dev",
    bundleId: `${BUNDLE_BASE}.dev`,
    apiUrl: "https://api.dev.example.com",
  },
  testing: {
    name: "Boilerplate (Test)",
    scheme: "boilerplateapp.test",
    bundleId: `${BUNDLE_BASE}.test`,
    apiUrl: "https://api.test.example.com",
  },
  staging: {
    name: "Boilerplate (Staging)",
    scheme: "boilerplateapp.staging",
    bundleId: `${BUNDLE_BASE}.staging`,
    apiUrl: "https://api.staging.example.com",
  },
  production: {
    name: "Boilerplate",
    scheme: "boilerplateapp",
    bundleId: BUNDLE_BASE,
    apiUrl: "https://api.example.com",
  },
};

export default ({ config }: ConfigContext): ExpoConfig => {
  const env = ENVIRONMENTS[APP_ENV];

  return {
    // Spread the static config from app.json, then override per environment.
    ...config,
    name: env.name,
    slug: config.slug ?? "boilerplate-app",
    scheme: env.scheme,
    ios: {
      ...config.ios,
      bundleIdentifier: env.bundleId,
    },
    android: {
      ...config.android,
      package: env.bundleId,
    },
    extra: {
      ...config.extra,
      appEnv: APP_ENV,
      // EXPO_PUBLIC_API_URL (e.g. .env.local) wins, else the per-env default.
      apiUrl: process.env.EXPO_PUBLIC_API_URL ?? env.apiUrl,
      // EAS project id — set with `eas init` and commit, or inject via env.
      eas: {
        projectId: process.env.EAS_PROJECT_ID ?? config.extra?.eas?.projectId,
      },
    },
  };
};
