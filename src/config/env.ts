import Constants from "expo-constants";

/**
 * Typed runtime access to the per-environment config injected at build time by
 * `app.config.ts` (via Expo `extra`). Import `env` anywhere in the app instead
 * of reading `process.env` or `Constants` directly.
 */
export type AppEnv = "development" | "testing" | "staging" | "production";

type ExtraConfig = {
  appEnv?: AppEnv;
  apiUrl?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as ExtraConfig;

const appEnv: AppEnv = extra.appEnv ?? "development";

const apiUrl = extra.apiUrl;
if (!apiUrl) {
  throw new Error(
    "Missing `apiUrl` in Expo config `extra`. Check app.config.ts / your build profile.",
  );
}

export const env = {
  appEnv,
  apiUrl,
  isDevelopment: appEnv === "development",
  isTesting: appEnv === "testing",
  isStaging: appEnv === "staging",
  isProduction: appEnv === "production",
} as const;
