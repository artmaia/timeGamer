import { db, auth } from '@/app/firebase/config'; // Firebase Client SDK
import { getDocs, query, collection, where } from 'firebase/firestore';

export async function GET(request) {
  try {
    const user = auth.currentUser; // Acesso ao usuário autenticado

    if (!user) {
      return new Response('Usuário não autenticado', { status: 401 });
    }

    const userRef = doc(db, 'metas_usuario', user.uid); // Acessa a coleção de atividades usando o UID do usuário
    const q = query(collection(db, 'metas_usuario'), where('uid', '==', user.uid)); // Realizando a consulta
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return new Response('Nenhuma meta encontrada', { status: 404 });
    }

    const atividades = snapshot.docs.map(doc => doc.data()); // Mapeia os documentos para obter os dados
    console.log('metas encontrada encontradas:', atividades); // Log das atividades

    return new Response(JSON.stringify(atividades), { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar metas:', error);
    return new Response('Erro ao buscar metas', { status: 500 });
  }
}
