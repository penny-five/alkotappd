# Alkotappd

## What is this?

Application that combines beers in Alko's catalog with their matching Untappd scores.

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

4. Build functions

    ```
    yarn functions:build
    ```

5. Init emulators

    ```
    yarn firebase:emulators:init
    ```

6. Start emulators

    ```
    yarn firebase:emulators:start
    ```
