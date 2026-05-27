import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Emulator-phase config. These values are dummy — the SDK requires a non-empty
// projectId/apiKey to construct, but the emulators don't validate them.
// When moving to a real Firebase project, swap these for the values from the
// Firebase Console (Project Settings → General → Your apps).
const firebaseConfig: FirebaseOptions = {
  apiKey: 'demo-emulator-key',
  authDomain: 'demo-firebase-todo.firebaseapp.com',
  projectId: 'demo-firebase-todo',
  storageBucket: 'demo-firebase-todo.appspot.com',
  messagingSenderId: '0',
  appId: '1:0:web:0',
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

// Connect to local emulator suite when running in dev. Vite exposes
// import.meta.env.DEV; in production builds this branch is dead-code-eliminated.
const useEmulators = import.meta.env.DEV;

if (useEmulators) {
  // disableWarnings stops the console banner; the orange "running against
  // emulator" indicator is still visible in DevTools network if needed.
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  console.info('[firebase] connected to local emulator suite (auth:9099, firestore:8080)');
}
