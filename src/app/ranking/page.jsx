'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { auth } from '../firebase/config';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'; // Certifique-se de importar corretamente seu arquivo de configuração do Firebase
import { db } from '../firebase/config';

const RankingPage = () => {
  const [ranking, setRanking] = useState([]);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user); 
      } else {
        setUser(null); 
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchRankingData = async () => {
      const querySnapshot = await getDocs(collection(db, 'progresso')); // Mudança aqui: buscando na coleção 'progresso'
      const rankingData = [];
      
      // Iterando pelos documentos da coleção 'progresso'
      for (let docSnapshot of querySnapshot.docs) {
        const progressData = docSnapshot.data();
        
        // Agora vamos buscar os dados de perfil do usuário para obter avatar e nickname
        const userRef = doc(db, 'perfil', docSnapshot.id); // Usando o id do documento em 'progresso' como uid para buscar o perfil
        const profileSnapshot = await getDoc(userRef);
        
        if (profileSnapshot.exists()) {
          const profileData = profileSnapshot.data();
          rankingData.push({
            id: docSnapshot.id, // id do usuário (uid)
            avatar: profileData.avatar || 'person.svg', // Coloque uma URL de avatar padrão aqui
            nickname: profileData.nickname || 'Usuário Sem Nome', // Coloque um nome padrão aqui
            studyHours: progressData.TotalStudyTime || 0,
            completedActivities: progressData.completedActivities || 0,
          });
        }
      }
      
      // Ordenando o ranking
      rankingData.sort((a, b) => {
        if (b.studyHours !== a.studyHours) {
          return b.studyHours - a.studyHours; // Ordenar por horas de estudo de forma decrescente
        }
        return b.completedActivities - a.completedActivities; // Desempatar pelo número de atividades concluídas
      });

      setRanking(rankingData);
    };

    fetchRankingData();
  }, []); // O array vazio significa que isso só será executado uma vez, na primeira renderização

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-500 to-pink-500">
      {/* Header */}
      <header style={{ backgroundColor: '#34177B' }} className="text-white p-6 flex justify-between items-center shadow-md">
        <div className="text-xl font-bold">
          <img src="/logo_header.svg" alt="Logo do Site" className="h-8" />
        </div>
        <div className="text-xl font-bold">Ranking</div>
        <div className="text-xl font-bold">
          <Link href="/main">
            <svg
              className="w-6 h-6 text-white cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
        </div>
      </header>

      {/* Main content: Display Ranking */}
      <div className="flex-1 p-8">
        <div className="space-y-6">
          {ranking.map((user, index) => (
            <div key={user.id} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-lg">
              <div className="flex-shrink-0">
                <img src={user.avatar} alt={user.nickname} className="w-16 h-16 rounded-full" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800">{user.nickname}</h2>
                <p className="text-gray-600">Horas de estudo: {user.studyHours}</p>
                <p className="text-gray-600">Atividades concluídas: {user.completedActivities}</p>
              </div>
              <div className="text-2xl font-bold text-gray-800">{index + 1}</div> {/* Rank position */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RankingPage;
