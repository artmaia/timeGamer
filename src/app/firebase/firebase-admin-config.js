import admin from 'firebase-admin';
import serviceAccount from '../../../config/serviceAccount.json'; // O caminho para o seu arquivo de chave privada

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };
