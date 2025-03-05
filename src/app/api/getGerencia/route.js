import { db, auth } from '@/app/firebase/config'; // Firebase Client SDK
import { doc, getDoc } from 'firebase/firestore';

export async function GET(request) {
  try {
    const user = auth.currentUser; // Acesso ao usuário autenticado

    if (!user) {
      return new Response('Usuário não autenticado', { status: 401 });
    }

    const userRef = doc(db, 'progresso', user.uid); // Acessa a coleção de progresso usando o UID do usuário
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return new Response('Progresso não encontrado', { status: 404 });
    }

    const progresso = userDoc.data(); // Obtém os dados de progresso do usuário
    console.log('Progresso encontrado:', progresso); // Log do progresso

    return new Response(JSON.stringify(progresso), { status: 200 }); // Retorna os dados de progresso
  } catch (error) {
    console.error('Erro ao buscar progresso:', error);
    return new Response('Erro ao buscar progresso', { status: 500 });
  }
}
