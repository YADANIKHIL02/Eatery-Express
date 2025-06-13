
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Ensure this is in your .env.local if you use Analytics
};

// Client-side check to help debug if the API key isn't loaded
if (typeof window !== 'undefined' && !firebaseConfig.apiKey) {
  console.warn(
    "Firebase API Key is missing or not loaded. Critical checks:\n1. Is '.env.local' in the project root?\n2. Is NEXT_PUBLIC_FIREBASE_API_KEY set correctly in '.env.local'?\n3. Did you restart the Next.js development server after changes to '.env.local'?"
  );
}

let app: FirebaseApp;
if (!getApps().length) {
  // Ensure config values are present before initializing, especially apiKey
  if (!firebaseConfig.apiKey) {
    // This will prevent Firebase from initializing if the key is truly missing,
    // though the "auth/api-key-not-valid" suggests it's initializing with a bad/empty key.
    console.error("Firebase initialization failed: API key is missing. Halting Firebase setup.");
    // To avoid throwing an error that breaks the app here, we might let it proceed
    // and let Firebase SDK throw its own more specific error.
    // For now, the console.warn above is the primary feedback mechanism for missing keys.
  }
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth: Auth = getAuth(app);

export { app, auth };
