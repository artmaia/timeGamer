'use client'

import React, { useState, useEffect } from "react";
import { db } from "../firebase/config"; // Importe a configuração do Firebase
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore"; // Usando setDoc e updateDoc
import { useAuthState } from "react-firebase-hooks/auth"; // Corrigir a importação do hook de autenticação
import { auth } from "../firebase/config"; // Importe o Firebase Auth configurado
import { Bar, Line } from 'react-chartjs-2'; // Importando o Bar e Line para os gráficos
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js'; // Importando para gráficos
import 'bootstrap/dist/css/bootstrap.min.css'; // Importando o CSS do Bootstrap
import Link from 'next/link';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


// Registrando os componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const FormularioProgresso = () => {
  const [pomodoro30min, setPomodoro30min] = useState(0);
  const [pomodoro60min, setPomodoro60min] = useState(0);
  const [date, setDate] = useState(""); // Novo campo para data
  const [updatedAt, setUpdatedAt] = useState(new Date().toLocaleString());
  const [user, loading, error] = useAuthState(auth); // Usando o hook correto
  const [totalStudyTime, setTotalStudyTime] = useState(0); // Total de tempo de estudo (calculado automaticamente)
  const [completedActivities, setCompletedActivities] = useState(0); // Atividades completadas, calculadas automaticamente
  const [historicalData, setHistoricalData] = useState([]); // Para armazenar dados históricos para o gráfico
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [nickname, setNick] = useState('');
  const [bio, setBio] = useState('');
  const [user1, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [message, setMessage] = useState("");
  

  // Função para buscar o valor do TotalStudyTime já existente no Firestore
  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const docRef = doc(db, "progresso", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTotalStudyTime(docSnap.data().TotalStudyTime || 0); // Se o documento existir, pega o valor ou 0
          setPomodoro30min(docSnap.data().pomodoro30min || 0); // Pega o valor atual dos pomodoros de 30 minutos
          setPomodoro60min(docSnap.data().pomodoro60min || 0); // Pega o valor atual dos pomodoros de 60 minutos
          setCompletedActivities(docSnap.data().completedActivities || 0); // Pega o valor atual das atividades concluídas
          setHistoricalData(docSnap.data().historicalData || []); // Pega os dados históricos de pomodoros
        } else {
          // Se o documento não existir, criar um novo com dados padrão
          const newDocument = {
            TotalStudyTime: 0,
            completedActivities: 0,
            pomodoro30min: 0,
            pomodoro60min: 0,
            pomodoroTime: 0,
            updatedAt: new Date().toLocaleString(),
            historicalData: [] // Inicializa a coleção de histórico de dados
          };
          await setDoc(docRef, newDocument); // Criando um novo documento para o usuário
          setTotalStudyTime(newDocument.TotalStudyTime);
          setPomodoro30min(newDocument.pomodoro30min);
          setPomodoro60min(newDocument.pomodoro60min);
          setCompletedActivities(newDocument.completedActivities);
          setHistoricalData(newDocument.historicalData); // Definir o histórico como vazio
        }
      };

      fetchData();
    }
  }, [user]);

  useEffect(() => {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          fetchProfileData(currentUser.uid); 
        } else {
          setUser(null);
        }
      });
  
      return () => unsubscribe();
  }, []);

  const fetchProfileData = async (uid) => {
    const userRef = doc(db, 'perfil', uid);
    try {
      const docSnapshot = await getDoc(userRef);
      if (docSnapshot.exists()) {
        setProfileData(docSnapshot.data());
        setBio(docSnapshot.data().bio || '');
        setSelectedAvatar(docSnapshot.data().avatar || ''); // Definindo o avatar já salvo
        setNick(docSnapshot.data().nickname || '');
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    }
  };

  const handleUpdateProfile = async () => {
    if (user) {
      const userRef = doc(db, 'perfil', user.uid);
      try {
        await setDoc(userRef, {
          ...profileData,
          bio: newBio,
          avatar: selectedAvatar, // Salvando o avatar escolhido no Firestore
        }, { merge: true });

        console.log('Perfil atualizado com sucesso!');
      } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user) {
      // Lógica para calcular o TotalStudyTime e o número de atividades completadas
      const newTotalStudyTime = totalStudyTime + (pomodoro30min * 30) + (pomodoro60min * 60);
      let newCompletedActivities = completedActivities;

      if (pomodoro30min > 0 || pomodoro60min > 0) {
        newCompletedActivities = completedActivities + pomodoro30min + pomodoro60min;
      }

      try {
        const docRef = doc(db, "progresso", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const currentPomodoro30min = docSnap.data().pomodoro30min || 0;
          const currentPomodoro60min = docSnap.data().pomodoro60min || 0;

          // Somando os novos valores com os antigos
          const updatedPomodoro30min = currentPomodoro30min + pomodoro30min;
          const updatedPomodoro60min = currentPomodoro60min + pomodoro60min;

          // Atualizando os dados históricos com a nova data e quantidade de pomodoros
          const newHistoricalData = [
            ...historicalData,
            { date: date, pomodoro30min, pomodoro60min }, // Adicionando o novo valor de pomodoro com a data
          ];

          // Atualizando o Firestore com os novos valores
          await updateDoc(docRef, {
            TotalStudyTime: newTotalStudyTime,
            completedActivities: newCompletedActivities,
            pomodoro30min: updatedPomodoro30min,
            pomodoro60min: updatedPomodoro60min,
            pomodoroTime: (updatedPomodoro30min * 30) + (updatedPomodoro60min * 60),
            updatedAt: updatedAt,
            historicalData: newHistoricalData, // Salvando os dados históricos no Firestore
          });

          // Atualizando o estado de TotalStudyTime após o envio
          setTotalStudyTime(newTotalStudyTime);
          setPomodoro30min(updatedPomodoro30min);
          setPomodoro60min(updatedPomodoro60min);
          setCompletedActivities(newCompletedActivities);
          setHistoricalData(newHistoricalData); // Atualizando os dados históricos

          alert("Progresso atualizado com sucesso!");

          // Agora, vamos validar as metas
        //   try {
        //     const response = await fetch('/api/validaMetas', {
        //       method: 'POST',
        //       headers: {
        //         'Content-Type': 'application/json',
        //       },
        //       body: JSON.stringify({ userId: user.uid }),
        //     });

        //     // Verificando se a resposta é válida
        //     if (!response.ok) {
        //       throw new Error('Erro na resposta da API');
        //     }

        //     // Verificando o conteúdo da resposta como texto
        //     const textResponse = await response.text();
        //     console.log("Resposta da API (Texto):", textResponse);

        //     // Tente fazer o parse para JSON se for possível
        //     let data;
        //     try {
        //       data = JSON.parse(textResponse); // Convertendo texto para JSON
        //       console.log("Resposta da API (JSON):", data);
        //     } catch (error) {
        //       console.error("Erro ao tentar converter a resposta em JSON:", error);
        //       setMessage("Erro ao validar as metas.");
        //       return;
        //     }

        //     // Exibir o resultado das metas completadas
        //     if (data.success) {
        //       setMessage(data.message); // Exibe a mensagem com as metas completadas
        //     } else {
        //       setMessage(data.message); // Exibe a mensagem se nenhuma meta foi completada
        //     }
        //   } catch (error) {
        //     console.error("Erro ao chamar a API de validação de metas:", error);
        //     setMessage("Erro ao validar as metas.");
        //   }
        } else {
          alert("Erro ao recuperar dados do Firestore.");
        }
      } catch (error) {
        console.error("Erro ao enviar dados para o Firebase: ", error);
        alert("Houve um erro ao atualizar o progresso.");
      }
    } else {
      alert("Você não está logado.");
    }
  };

  // Dados para o gráfico de barras
  const barData = {
    labels: ['Pomodoro 30min', 'Pomodoro 60min', 'Atividades Completadas'],
    datasets: [
      {
        label: 'Quantidade',
        data: [pomodoro30min, pomodoro60min, completedActivities],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 159, 64, 0.6)', 'rgba(153, 102, 255, 0.6)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 159, 64, 1)', 'rgba(153, 102, 255, 1)'],
        borderWidth: 1,
      },
    ],
  };

  // Dados para o gráfico de linha com as datas
  const lineData = {
    labels: historicalData.map((item) => item.date), // Usando as datas salvas
    datasets: [
      {
        label: 'Pomodoro 30min',
        data: historicalData.map((item) => item.pomodoro30min),
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
      {
        label: 'Pomodoro 60min',
        data: historicalData.map((item) => item.pomodoro60min),
        fill: false,
        borderColor: 'rgba(255, 159, 64, 1)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="h-screen bg-gradient-to-br from-purple-500 to-pink-500 d-flex flex-column">
      <header style={{ backgroundColor: '#34177B' }} className="text-white p-4 sm:p-6 d-flex justify-content-between align-items-center">
        <div className="text-xl font-bold">
          <img src="/logo_header.svg" alt="Logo do Site" className="h-8" />
        </div>

        {/* Links no desktop */}
        <div className="d-none d-lg-flex space-x-4">
          <Link href="/agradecimento" className="hover:text-blue-300">Agradecimentos</Link>
          <Link href="/games" className="hover:text-blue-300">Games</Link>
          <Link href="/ranking" className="hover:text-blue-300">Ranking</Link>
        </div>

        {/* Hamburger Button - Mobile */}
        <button 
          className="d-lg-none text-white p-2 mt-4 sm:mt-0" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {/* Hamburger Icon */}
          <div className="space-y-1">
            <div className="w-6 h-0.5 bg-white"></div>
            <div className="w-6 h-0.5 bg-white"></div>
            <div className="w-6 h-0.5 bg-white"></div>
          </div>
        </button>
      </header>

      <div className="d-flex flex-1">
        {/* Sidebar */}
        <aside className={`lg:w-64 bg-white text-gray-800 p-6 min-h-screen shadow-lg fixed top-0 left-0 transform transition-all duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 mt-16 lg:mt-0`}>
        <div className="flex flex-col items-center space-y-4 mb-8">
            <Link href="/perfil">
              <img src={selectedAvatar || '/person.svg'} alt="Imagem de Perfil" className="w-16 h-16 rounded-full cursor-pointer border-2 border-gray-300" />
            </Link>
          </div>

          <div className="mb-6">
            <p className="text-xl font-semibold text-gray-800">{nickname || 'Nickname não disponível'}</p>
            <p className="text-sm text-gray-600">{bio || 'Bio não disponível'}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src="https://api.dicebear.com/9.x/icons/svg?seed=Amaya&backgroundColor=ce93d8" alt="avatar" className="w-8 h-8 rounded-full" />
              <Link href="/atividades" className="block text-lg text-gray-700 hover:text-blue-300">Atividades</Link>
            </div>
            <div className="flex items-center space-x-2">
              <img src="https://api.dicebear.com/9.x/icons/svg?seed=Leo&backgroundColor=ce93d8" alt="avatar" className="w-8 h-8 rounded-full" />
              <Link href="/Gerenciamento" className="block text-lg text-gray-700 hover:text-blue-300">Gerenciamento</Link>
            </div>
            <div className="flex items-center space-x-2">
              <img src="https://api.dicebear.com/9.x/icons/svg?seed=Katherine&backgroundColor=ce93d8" alt="avatar" className="w-8 h-8 rounded-full" />
              <Link href="/metas" className="block text-lg text-gray-700 hover:text-blue-300">Metas</Link>
            </div>
            <div className="flex items-center space-x-2">
              <img src="https://api.dicebear.com/9.x/icons/svg?seed=Christian&backgroundColor=ce93d8" alt="avatar" className="w-8 h-8 rounded-full" />
              <Link href="recompensa" className="block text-lg text-gray-700 hover:text-blue-300">Recompensas</Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex-col p-6 sm:p-4 md:p-6 lg:p-8 bg-gradient-to-tl text-black d-flex justify-content-center align-items-center ml-0 ms-lg-72">
          <div className="w-full max-w-full sm:max-w-full md:max-w-2xl p-6 bg-white rounded-lg shadow-lg text-black">
            <h1 className="text-2xl font-semibold mb-4 text-black">Atualizar Progresso</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="date" className="form-label">Data:</label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="form-control text-dark"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="pomodoro30min" className="form-label">Pomodoro 30min:</label>
                <input
                  type="number"
                  id="pomodoro30min"
                  value={pomodoro30min}
                  onChange={(e) => setPomodoro30min(Number(e.target.value))}
                  className="form-control text-dark"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="pomodoro60min" className="form-label">Pomodoro 60min:</label>
                <input
                  type="number"
                  id="pomodoro60min"
                  value={pomodoro60min}
                  onChange={(e) => setPomodoro60min(Number(e.target.value))}
                  className="form-control text-dark"
                />
              </div>
              <div className="text-center">
                <button type="submit" className="btn btn-primary">Enviar</button>
              </div>
            </form>
          </div>

          <div className="w-full max-w-full sm:max-w-full bg-gray-100 md:max-w-2xl p-6 rounded-lg shadow-lg text-black mt-8">
            {/* Gráfico de barras */}
            <div className="mt-4">
              <h3>Gráfico de Progresso</h3>
              <Bar data={barData} options={{ responsive: true, plugins: { title: { display: true, text: 'Progresso dos Pomodoros e Atividades' } } }} />
            </div>

            {/* Gráfico de linha */}
            <div className="mt-4">
              <h3>Comparação de Pomodoros (30min vs 60min) ao longo do tempo</h3>
              <Line data={lineData} options={{ responsive: true, plugins: { title: { display: true, text: 'Comparação de Pomodoros de 30min e 60min' } } }} />
            </div>
          </div>
        </div>

      </div>
    </div>


  );
};

export default FormularioProgresso;
