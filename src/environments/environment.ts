// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  firebase: {
    apiKey: "AIzaSyAiWEmfE0uUByOEccC0dDqZFww7Re4Hvd4",
    authDomain: "chat-dual-app.firebaseapp.com",
    projectId: "chat-dual-app",
    storageBucket: "chat-dual-app.firebasestorage.app",
    messagingSenderId: "339275653690",
    appId: "1:339275653690:web:3da83ba20cc64c9f3d4b03"
  },
  supabase: {
    url: "https://lomohirutpnpqnykwswm.supabase.co",
    key: "sb_publishable_tD_mKqFDam2ZVrSqLj4mBA_C7WZHio8"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
