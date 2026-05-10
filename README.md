# Crypto Dashboard Mobile

Expo React Native app for a read-only crypto bot dashboard.

## Run

```bash
npm install
npm run start
```

Open the project in Expo Go or run the iOS target from Expo.

## Environment

Use only the Supabase publishable key in the mobile app:

```bash
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

The app reads from Supabase and falls back to mock data when live data is unavailable. It does not connect to Alpaca and does not include trading logic or broker keys.
