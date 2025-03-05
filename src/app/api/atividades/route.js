import { db } from '../../firebase/config'; // Ajuste o caminho conforme necessário
import { collection, addDoc, deleteDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json(); // Recebe os dados da atividade do frontend

    const { uid, atividade, prioridade, descricao, jogo } = data;

    const activitiesRef = collection(db, 'atividades');
    
    // Adiciona a atividade no Firestore
    const docRef = await addDoc(activitiesRef, {
      uid,
      atividade,
      prioridade,
      descricao,
      jogo,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: 'Atividade registrada com sucesso!', id: docRef.id });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao registrar atividade: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json(); // Recebe o id da atividade a ser excluída

    if (!id) {
      return NextResponse.json({ error: 'ID da atividade é necessário!' }, { status: 400 });
    }

    const activityDocRef = doc(db, 'atividades', id); // Refere-se ao documento da atividade

    // Exclui o documento
    await deleteDoc(activityDocRef);

    return NextResponse.json({ message: 'Atividade excluída com sucesso!' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir atividade: ' + error.message }, { status: 500 });
  }
}
