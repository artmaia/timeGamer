import { db, auth } from '@/app/firebase/config';
import { getDoc, doc } from 'firebase/firestore';

export async function GET(request) {
  try {
    const user = auth.currentUser; // Acesso ao usuário autenticado

    if (!user) {
      return new Response('Usuário não autenticado', { status: 401 });
    }

    const userRef = doc(db, 'perfil', user.uid); // Acessa o perfil usando o UID
    const docSnapshot = await getDoc(userRef);

    if (docSnapshot.exists()) {
      return new Response(JSON.stringify(docSnapshot.data()), { status: 200 });
    } else {
      return new Response('Perfil não encontrado', { status: 404 });
    }
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return new Response('Erro ao buscar perfil', { status: 500 });
  }
}
