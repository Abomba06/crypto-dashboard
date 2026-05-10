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

## Supabase Tables

Fastest setup: paste and run [supabase/complete_setup.sql](supabase/complete_setup.sql) in the Supabase SQL editor. It creates the tables, enables read policies, and inserts starter rows for every screen.

The split files are also available if you prefer them: [supabase/schema.sql](supabase/schema.sql) creates tables/policies, and [supabase/seed.sql](supabase/seed.sql) adds starter rows. The app reads these tables with the publishable key and falls back to mock data if the tables are missing or empty.
