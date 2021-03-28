# Alkotappd

## What is this?

Application that combines beers in [Alko](https://alko.fi)'s catalog with their matching [Untappd](https://untappd.com) scores.

## Instructions

### Setup project

1. Create a new project on Google Cloud
2. Add Firebase (https://console.firebase.google.com/)
3. Enable Cloud Firestore API

### Start local dev environment

1. Install dependencies

   ```sh
   yarn install
   ```

2. Login with Firebase

   ```sh
   yarn firebase:login
   ```

3. Set active Firebase project

   ```sh
   yarn firebase:use [project_id]
   ```

4. Init emulators

   ```
   yarn firebase:emulators:init
   ```

5. Start dev environment

   ```
   yarn dev
   ```

   This will do the following things:

   - Start Firebase emulator
   - Compile functions in watch mode
   - Start Vite dev server

   Open `http://localhost:8080` in browser.
