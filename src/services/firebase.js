import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Credenciales predeterminadas del proyecto Firebase finanzas-43b89
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDMPTuFvjfeT447PzmDIOWJoBR6bZZOmsE",
  authDomain: "finanzas-43b89.firebaseapp.com",
  projectId: "finanzas-43b89",
  storageBucket: "finanzas-43b89.firebasestorage.app",
  messagingSenderId: "290499064143",
  appId: "1:290499064143:web:fc79d259bb50ac3bf8553a",
  measurementId: "G-MMJJ3T9B44"
};

// Obtener credenciales de variables de entorno de Vite, localStorage o fallback predeterminado
export const getFirebaseConfig = () => {
  const envApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const envAuthDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
  const envProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const envStorageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
  const envMessagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
  const envAppId = import.meta.env.VITE_FIREBASE_APP_ID;

  // Fallback a llaves personalizadas guardadas manualmente en localStorage
  const localConfigStr = localStorage.getItem('finanzas_pro_firebase_config');
  let localConfig = null;
  if (localConfigStr) {
    try {
      localConfig = JSON.parse(localConfigStr);
    } catch (e) {
      console.error(e);
    }
  }

  const apiKey = envApiKey || localConfig?.apiKey || DEFAULT_FIREBASE_CONFIG.apiKey;
  const authDomain = envAuthDomain || localConfig?.authDomain || DEFAULT_FIREBASE_CONFIG.authDomain;
  const projectId = envProjectId || localConfig?.projectId || DEFAULT_FIREBASE_CONFIG.projectId;
  const storageBucket = envStorageBucket || localConfig?.storageBucket || DEFAULT_FIREBASE_CONFIG.storageBucket;
  const messagingSenderId = envMessagingSenderId || localConfig?.messagingSenderId || DEFAULT_FIREBASE_CONFIG.messagingSenderId;
  const appId = envAppId || localConfig?.appId || DEFAULT_FIREBASE_CONFIG.appId;

  const isConfigured = Boolean(apiKey && projectId);

  return {
    isConfigured,
    config: {
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      messagingSenderId,
      appId
    }
  };
};

let app = null;
let db = null;

export const initFirebase = () => {
  const { isConfigured, config } = getFirebaseConfig();

  if (!isConfigured) {
    return { app: null, db: null, isConfigured: false };
  }

  try {
    app = getApps().length === 0 ? initializeApp(config) : getApp();
    db = getFirestore(app);
    return { app, db, isConfigured: true };
  } catch (error) {
    console.error('Error inicializando Firebase:', error);
    return { app: null, db: null, isConfigured: false, error };
  }
};

export { db };
