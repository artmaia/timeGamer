'use client';

import { useState, useEffect } from 'react';
import { auth } from '../firebase/config'; 
import { getAuth } from 'firebase/auth';
import { db } from '../firebase/config';
import { collection, query, where, getDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import Link from 'next/link';

const ActivitiesPage = () => {
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);
  const [avatar, setAvatar] = useState('');
  const [timeLeft, setTimeLeft] = useState(0); // Tempo restante para o Pomodoro
  const [isPomodoroActive, setIsPomodoroActive] = useState(false); // Se o Pomodoro está em andamento
  const [pomodoroDuration, setPomodoroDuration] = useState(0); // Duração do Pomodoro (30s, 30m, 60m)
  const [intervalId, setIntervalId] = useState(null); // Para armazenar o intervalo do Pomodoro
  const [pomodoroCompleted, setPomodoroCompleted] = useState(false); // Controle para garantir uma única notificação
  const [nickname, setNick] = useState('');
  const [bio, setBio] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false); // Controle para abrir e fechar o sidebar no mobile

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      fetchProfileData(user?.uid);
    });

    return () => unsubscribe();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games');
      const data = await response.json();
      setGames(data.results);
    } catch (error) {
      console.error("Erro ao buscar jogos:", error);
      setError("Erro ao buscar jogos");
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const getGameNameByCode = (code) => {
    const game = games.find((game) => game.id.toString() === code.toString());
    return game ? game.name : "Jogo não encontrado";
  };

  const fetchProfileData = async (uid) => {
    const userRef = doc(db, 'perfil', uid);
    try {
      const docSnapshot = await getDoc(userRef);
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setAvatar(data.avatar || '');
        setNick(docSnapshot.data().nickname || '');
        setBio(docSnapshot.data().bio || '');
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    }
  };

  useEffect(() => {
    const fetchActivities = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const activitiesRef = collection(db, 'atividades');
        const q = query(activitiesRef, where('uid', '==', user.uid));

        try {
          const querySnapshot = await getDocs(q);
          const activitiesData = [];
          querySnapshot.forEach((doc) => {
            activitiesData.push({ ...doc.data(), id: doc.id });
          });
          setActivities(activitiesData);
        } catch (error) {
          console.error("Erro ao buscar as atividades:", error);
          setError("Erro ao buscar as atividades.");
        }
      } 
    };

    fetchActivities();
  }, [games]);

  const deleteActivity = async (id) => {
    try {
      const activityDocRef = doc(db, 'atividades', id);
      await deleteDoc(activityDocRef);
      setActivities(activities.filter(activity => activity.id !== id));
    } catch (error) {
      console.error("Erro ao excluir a atividade:", error);
    }
  };

  // Função para iniciar o Pomodoro com a duração especificada
  const startPomodoro = (duration) => {
    setPomodoroDuration(duration);
    setTimeLeft(duration);
    setPomodoroCompleted(false); // Resetando o estado de notificação

    const id = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(id);
          setIsPomodoroActive(false);
          if (!pomodoroCompleted) {
            alert("Pomodoro finalizado!"); // Apenas chama uma vez
            setPomodoroCompleted(true); // Marcar como notificado
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    setIsPomodoroActive(true);
    setIntervalId(id);
  };

  // Função para formatar o tempo no formato mm:ss
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Função para lidar com a seleção do tempo do Pomodoro
  const handlePomodoroClick = (duration) => {
    if (!isPomodoroActive) {
      startPomodoro(duration);
    } else {
      alert("Pomodoro já está em andamento!");
    }
  };

  // Cálculo do progresso da barra (percentual)
  const progressPercentage = (timeLeft / pomodoroDuration) * 100;

  if (error) {
    return <div className="text-center text-red-600 mt-10">{error}</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-purple-500 to-pink-500">
      {/* Header */}
      <header style={{ backgroundColor: '#34177B' }} className="text-white p-6 flex sm:flex-row justify-between items-center">
        <div className="text-xl font-bold">
          <img src="/logo_header.svg" alt="Logo do Site" className="h-8" />
        </div>

        {/* Links no desktop */}
        <div className="hidden lg:flex space-x-4">
          <Link href="/agradecimento" className="hover:text-blue-300">Agradecimentos</Link>
          <Link href="/games" className="hover:text-blue-300">Games</Link>
          <Link href="/ranking" className="hover:text-blue-300">Ranking</Link>
        </div>

        {/* Hamburger Button - Mobile */}
        <button 
          className="lg:hidden text-white p-2 mt-4 sm:mt-0" 
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

      {/* Links - Mobile, below the logo */}
      <div className="lg:hidden text-center mt-4 mb-8">
        <div className="space-x-6 flex justify-center text-sm lg:text-base">
          <Link href="/agradecimento" className="hover:text-blue-300">Agradecimentos</Link>
          <Link href="/games" className="hover:text-blue-300">Games</Link>
          <Link href="/ranking" className="hover:text-blue-300">Ranking</Link>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`lg:w-64 bg-white text-gray-800 p-4 h-full shadow-lg fixed lg:block top-20 left-0 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
          <div className="flex flex-col items-center space-y-4 mb-8">
            <a href="/perfil">
              <img src={avatar || '/person.svg'} alt="Imagem de Perfil" className="w-16 h-16 rounded-full cursor-pointer border-2 border-gray-300" /></a>
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
        <main className="flex-1 p-8 bg-gradient-to-tl text-black flex flex-col md:flex-row ml-0 lg:ml-64">
          {/* Pomodoro Section */}
          <div className="w-full md:w-1/4 mb-6 md:mb-0 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-black mb-4">Pomodoro</h2>
            
            {/* Instruções resumidas */}
            <div className="mb-6 text-sm text-gray-800">
              <p><strong>30 minutos:</strong> 2 sessões de 30 minutos com intervalo de 10 minutos. Após a segunda, jogue o jogo da atividade.</p>
              <p><strong>60 minutos:</strong> 2 sessões de 30 minutos com intervalo de 15 minutos. Após a segunda, jogue o jogo da atividade.</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handlePomodoroClick(30)}
                className="bg-green-500 text-white p-4 rounded-md hover:bg-green-600 w-full"
              >
                Pomodoro de 30s
              </button>

              <button
                onClick={() => handlePomodoroClick(1800)} // 30 minutos = 1800 segundos
                className="bg-blue-500 text-white p-4 rounded-md hover:bg-blue-600 w-full"
              >
                Pomodoro de 30 minutos
              </button>

              <button
                onClick={() => handlePomodoroClick(3600)} // 60 minutos = 3600 segundos
                className="bg-red-500 text-white p-4 rounded-md hover:bg-red-600 w-full"
              >
                Pomodoro de 60 minutos
              </button>

              <div className="w-full bg-gray-300 rounded-full h-2 mt-4">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>

              <p className="text-center text-xl mt-4">
                {isPomodoroActive && formatTime(timeLeft)}
              </p>
            </div>
          </div>

          {/* Atividades Section */}
          <div className="w-full md:w-3/4 p-6 rounded-xl">
            <h2 className="text-2xl font-semibold mb-4 text-black">Minhas Atividades</h2>
            <div className="space-y-6">
              {activities.length === 0 ? (
                <p className="text-xl text-center text-black">Você não tem atividades registradas.</p>
              ) : (
                activities.map((atividade, index) => (
                  <div key={atividade.id} className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 mb-4 w-full">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-gray-800">{atividade.atividade}</h2>
                      <button
                        onClick={() => deleteActivity(atividade.id)}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 ml-2"
                      >
                        <img src="/trash.svg" alt="Excluir" className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-md text-gray-700"><strong>Prioridade:</strong> {atividade.prioridade}</p>
                    <p className="text-md text-gray-700"><strong>Descrição:</strong> {atividade.descricao}</p>
                    <p className="text-md text-gray-700"><strong>Jogo:</strong> {getGameNameByCode(atividade.jogo)}</p>
                    <p className="text-md text-gray-700"><strong>Data de criação:</strong> {new Date(atividade.createdAt.seconds * 1000).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>


  );
};

export default ActivitiesPage;
