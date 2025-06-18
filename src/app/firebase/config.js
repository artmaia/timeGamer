  import { initializeApp, getApps, getApp } from 'firebase/app';
  import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
  import { getFirestore } from 'firebase/firestore'; // Importando o Firestore

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  // console.log("Firebase API Key:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

  // Inicializa o app do Firebase
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

  // Inicializa o Firestore
  const db = getFirestore(app);

  // Inicializa o Auth
  const auth = getAuth(app);

  // Definindo persistência para o Firebase Auth
  setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("Persistência definida como local"))
  .catch((error) => console.log("Erro ao definir persistência", error));

  // Exportando o app, db e auth
  export { app, db, auth };
