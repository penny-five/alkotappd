# Alkotappd

<div align="center">
  <img height="40" width="50" src="https://cdn.svgporn.com/logos/typescript-icon.svg"/>
  <img height="40" width="50" src="https://cdn.svgporn.com/logos/vue.svg"/>
  <img height="40" width="50" src="https://cdn.svgporn.com/logos/tailwindcss-icon.svg"/>
  <img height="40" width="50" src="https://cdn.svgporn.com/logos/nestjs.svg"/>
  <img height="40" width="50" src="https://cdn.svgporn.com/logos/firebase.svg"/>
</div>

[![Status](https://github.com/penny-five/alkotappd/workflows/test-and-deploy/badge.svg)](https://github.com/penny-five/alkotappd/actions)

## What is this?

Application that combines beers in [Alko](https://alko.fi)'s catalog with their matching [Untappd](https://untappd.com) scores.

## Instructions

### Setup project

1. Create a new project on Google Cloud
2. Add Firebase (https://console.firebase.google.com/)
3. Enable Cloud Firestore API

### Starting local dev environment

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

### Deploying to production

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

4. Deploy

   ```sh
   yarn firebase:deploy
   ```
