// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

export const firebaseConfig: Object = {
  apiKey: "AIzaSyCSyyvK8b1pfwYC4PusmP9Qsq5R3Jjhxr4",
  authDomain: "sulta-ai.firebaseapp.com",
  projectId: "sulta-ai",
  storageBucket: "sulta-ai.firebasestorage.app",
  messagingSenderId: "749322137169",
  appId: "1:749322137169:web:215f597b629d8788ddd270",
  measurementId: "G-ZMRMPEWJWN"
};

// import admin, {ServiceAccount} from "firebase-admin";

// const {
//   FIREBASE_TYPE,
//   FIREBASE_PROJECT_ID,
//   FIREBASE_PRIVATE_KEY_ID,
//   FIREBASE_PRIVATE_KEY,
//   FIREBASE_CLIENT_EMAIL,
//   FIREBASE_CLIENT_ID,
//   FIREBASE_AUTH_URI,
//   FIREBASE_TOKEN_URI,
//   FIREBASE_AUTH_PROVIDER_CERT_URL,
//   FIREBASE_CLIENT_CERT_URL,
// } = process.env;

// admin.initializeApp({
//   credential: admin.credential.cert({
//     type: FIREBASE_TYPE!,
//     project_id: FIREBASE_PROJECT_ID!,
//     private_key_id: FIREBASE_PRIVATE_KEY_ID!,
//     private_key: FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')!,
//     client_email: FIREBASE_CLIENT_EMAIL!,
//     client_id: FIREBASE_CLIENT_ID!,
//     auth_uri: FIREBASE_AUTH_URI!,
//     token_uri: FIREBASE_TOKEN_URI!,
//     auth_provider_x509_cert_url: FIREBASE_AUTH_PROVIDER_CERT_URL!,
//     client_x509_cert_url: FIREBASE_CLIENT_CERT_URL!,
//   } as ServiceAccount),
// });




// Initialize Firebase
export const app = initializeApp(firebaseConfig);
let analytics: any = null;

if (typeof window !== 'undefined') {
  // Initialize analytics only on client side
  import('firebase/analytics').then((firebaseAnalytics) => {
    analytics = firebaseAnalytics.getAnalytics(app);
  });
}

export const db = getFirestore(app);
export const auth = getAuth(app)

// const adminDB = admin.firestore();
// export { admin, adminDB };


