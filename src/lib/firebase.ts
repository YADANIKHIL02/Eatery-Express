
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
    "Firebase API Key is missing or not loaded from environment variables. Critical checks:\n" +
    "1. Is the '.env.local' file present in the project root directory (not inside 'src')?\n" +
    "2. Is 'NEXT_PUBLIC_FIREBASE_API_KEY' spelled correctly and set to your actual Firebase API key in '.env.local'? (e.g., NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...)\n" +
    "3. Did you RESTART your Next.js development server (e.g., 'npm run dev') after creating or modifying the '.env.local' file?\n" +
    "The API key Firebase is currently seeing is: ", firebaseConfig.apiKey === undefined ? "undefined" : `"${firebaseConfig.apiKey}"`
  );
}

let app: FirebaseApp;
if (!getApps().length) {
  // The Firebase SDK will throw an error if apiKey is missing or invalid during initializeApp.
  // The warning above is to help users debug why it might be missing.
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth: Auth = getAuth(app);

export { app, auth };
