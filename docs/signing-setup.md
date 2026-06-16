# Signing & Credentials Setup

How to provision code-signing for both build paths. **EAS** can manage most of this for you;
the **Fastlane** fallback requires you to set everything up manually.

- [EAS path](#eas-path) — quickest, Expo-managed signing.
- [Fastlane path — iOS](#fastlane-path--ios) — App Store Connect API key + `match`.
- [Fastlane path — Android](#fastlane-path--android) — release keystore + Play service account.
- [GitHub secrets reference](#github-secrets-reference) — everything the workflows read.

---

## EAS path

EAS can generate and store certificates, provisioning profiles, and the Android keystore for you.

```bash
npm i -g eas-cli
eas login
eas init                 # creates the EAS project, writes the projectId
eas credentials          # interactively generate/sync iOS + Android signing
```

For CI (`eas-build.yml`), create an Expo access token and add it as the `EXPO_TOKEN` repo secret:
**expo.dev → Account → Settings → Access tokens**.

Fill the store-submission placeholders in `eas.json` `submit` (Apple ID, ASC app id, Apple team id)
and drop the Google Play service-account JSON at `credentials/google-play-service-account.json`
(git-ignored). See [Android](#fastlane-path--android) below for how to create that JSON.

---

## Fastlane path — iOS

### 1. App Store Connect API key (auth)

1. **App Store Connect → Users and Access → Integrations → App Store Connect API**.
2. Generate a key with the **App Manager** role. Download the `.p8` (one-time download).
3. Note the **Key ID** and **Issuer ID**.
4. Base64-encode the key for the secret:
   ```bash
   base64 -i AuthKey_XXXXXXXXXX.p8 | pbcopy   # macOS; -w0 with coreutils on Linux
   ```
   → `ASC_KEY_CONTENT` (the Fastfile sets `is_key_content_base64: true`).

### 2. Certificates & profiles via `match`

`match` stores signing assets in a private, encrypted git repo so CI can fetch them read-only.

```bash
cd boilerplate-app
bundle exec fastlane match init          # point it at a PRIVATE git repo
# Generate one profile per bundle id you ship (repeat per environment):
bundle exec fastlane match appstore --app_identifier io.vctors.boilerplate
bundle exec fastlane match adhoc    --app_identifier io.vctors.boilerplate.staging
bundle exec fastlane match adhoc    --app_identifier io.vctors.boilerplate.test
bundle exec fastlane match adhoc    --app_identifier io.vctors.boilerplate.dev
```

The encryption passphrase becomes `MATCH_PASSWORD`; the storage repo URL becomes `MATCH_GIT_URL`.
> Not using `match`? Replace the `match(...)` call in the Fastfile with `get_certificates` +
> `get_provisioning_profile`, or import a manual `.p12` + `.mobileprovision`.

### 3. Confirm the Xcode scheme

After a first `npx expo prebuild --platform ios`, open `ios/` and check the scheme name (it is
derived from the app `name`, which varies per environment). If it isn't `boilerplateapp`, set the
`IOS_SCHEME` env var / repo secret to the real name so `build_app` can find it.

---

## Fastlane path — Android

### 1. Generate a release keystore

```bash
keytool -genkeypair -v \
  -keystore release.keystore \
  -alias upload \
  -keyalg RSA -keysize 2048 -validity 10000
```

Keep `release.keystore` **out of git** (already git-ignored). Back it up securely — losing it
means you can't ship updates to an existing Play listing. Base64-encode it for CI:

```bash
base64 -i release.keystore | pbcopy        # → ANDROID_KEYSTORE_BASE64
```

The store password, key alias (`upload`), and key password become the matching secrets below.

### 2. Google Play service account

1. **Play Console → Setup → API access** → link a Google Cloud project.
2. Create a **service account** in Google Cloud, grant it access in Play Console with the
   **Release** permission, and download its JSON key.
3. Locally for EAS, save it to `credentials/google-play-service-account.json`. For the Fastlane
   workflow, paste the JSON contents into the `GOOGLE_PLAY_JSON_KEY` secret (the workflow writes
   it to a file at runtime).

> First upload must be done manually in the Play Console — `supply`/`upload_to_play_store` can
> only update an app that already has an initial release.

---

## GitHub secrets reference

| Secret | Used by | What it is |
| ------ | ------- | ---------- |
| `EXPO_TOKEN` | `eas-build.yml` | Expo access token |
| `ASC_KEY_ID` | iOS Fastlane | App Store Connect API key id |
| `ASC_ISSUER_ID` | iOS Fastlane | ASC API issuer id |
| `ASC_KEY_CONTENT` | iOS Fastlane | base64 of the `.p8` key |
| `APPLE_ID` | iOS Fastlane | Apple account email |
| `APPLE_TEAM_ID` | iOS Fastlane | Developer Portal team id |
| `ASC_TEAM_ID` | iOS Fastlane | App Store Connect team id |
| `MATCH_PASSWORD` | iOS Fastlane | `match` encryption passphrase |
| `MATCH_GIT_URL` | iOS Fastlane | `match` storage repo URL |
| `IOS_SCHEME` | iOS Fastlane | Xcode scheme name (if not `boilerplateapp`) |
| `ANDROID_KEYSTORE_BASE64` | Android Fastlane | base64 of `release.keystore` |
| `ANDROID_KEYSTORE_PASSWORD` | Android Fastlane | keystore store password |
| `ANDROID_KEY_ALIAS` | Android Fastlane | key alias (e.g. `upload`) |
| `ANDROID_KEY_PASSWORD` | Android Fastlane | key password |
| `GOOGLE_PLAY_JSON_KEY` | Android Fastlane | Play service-account JSON contents |
