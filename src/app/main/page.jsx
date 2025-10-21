'use client';

import { getAuth } from 'firebase/auth';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase/config';
import styles from './main.module.css';

export default function Main() {
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]); 
  const [selectedGame, setSelectedGame] = useState(""); 
  const [atividade, setAtividade] = useState(""); 
  const [prioridade, setPrioridade] = useState("alta"); 
  const [descricao, setDescricao] = useState(""); 
  const [avatar, setAvatar] = useState('');
  const [nickname, setNick] = useState('');
  const [bio, setBio] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [currentText, setCurrentText] = useState(0); // Controla qual texto exibir

  const messages = [
    "Bem-vindo ao TimeGamer! Aqui você pode gerenciar suas atividades, visualizar suas metas e recompensas. Aproveite a experiência!",
    "Você também pode acompanhar seu progresso ao mesmo tempo em que você aprende e se diverte.",
    "Na página principal, você pode adicionar suas atividades e escolher o jogo com o qual deseja conciliá-la.",
    "Na área de atividades, você pode escolher o tempo que melhor se adapta à sua rotina para executar sua atividade e jogar, utilizando a técnica Pomodoro, com intervalos de 30 ou 60 minutos.",
    "Em Metas, você pode estabelecer objetivos e acompanhar o progresso ao longo do tempo.",
    "Na seção de Gerenciamento, você pode registrar seu progresso e obter uma visão detalhada de sua evolução.",
    "As recompensas são a chave para motivação. Veja como seu progresso se traduz em conquistas!",
  ];

  const handleOpenModal = () => {
    setShowInstructions(true);
    setCurrentText(0); // Reiniciar para a primeira mensagem
  };
  
  const handleCloseModal = () => {
    setShowInstructions(false); // Fechar o modal
  };


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
      console.error('Erro ao buscar jogos:', error);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchProfileData = async (uid) => {
    const userRef = doc(db, 'perfil', uid); 
    try {
      const docSnapshot = await getDoc(userRef);
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setAvatar(data.avatar || ''); 
        setNick(data.nickname || '');
        setBio(data.bio || '');
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentText((prev) => (prev + 1) % messages.length); // Passa para o próximo texto e volta para o primeiro quando chega ao final
    }, 8000); // Cada mensagem fica 4 segundos visível
  
    return () => clearTimeout(timer); // Limpa o timeout quando o componente é desmontado
  }, [currentText]); // Dependência para executar a cada mudança de texto
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth(); 
    const user = auth.currentUser; 
  
    if (user) {
      const activitiesRef = collection(db, 'atividades'); 
  
      const atividadeData = {
        atividade,
        prioridade,
        descricao,
        jogo: selectedGame,
        uid: user.uid,
        createdAt: new Date(),
      };

      if (!atividade || !prioridade || !selectedGame) {
        alert('os campos Atividade, Prioridade e Jogo são obrigatórios.');
        return;
      }
  
      try {
        await addDoc(activitiesRef, atividadeData);
        alert('Atividade enviada com sucesso!');
      } catch (error) {
        console.error('Erro ao enviar a atividade:', error);
      }
    } else {
      console.log('Usuário não autenticado');
    }
  };

  if (!user) {
    return <div>Carregando...</div>; 
  }

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-br from-purple-500 to-pink-500 ${sidebarOpen ? 'overflow-hidden' : ''}`}>
      {/* Header */}
      <header style={{ backgroundColor: '#34177B' }} className="text-white p-6 flex justify-between items-center shadow-md z-20 relative">
        <div className="text-xl font-bold">
          <img src="/logo_header.svg" alt="Logo do Site" className="h-8" />
        </div>
        {/* Links - Desktop */}
        <div className="hidden lg:flex space-x-6">
          <Link href="/main" className="hover:text-blue-300">Main</Link>
          <Link href="/agradecimento" className="hover:text-blue-300">Agradecimentos</Link>
          <Link href="/games" className="hover:text-blue-300">Games</Link>
          <Link href="/ranking" className="hover:text-blue-300">Ranking</Link>
        </div>
        {/* Hamburger Button */}
        <button 
          className="lg:hidden text-white p-2" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {/* Hamburger Icon */}
          <div className="space-y-1">
            <div className="w-6 h-0.5 bg-white"></div>
            <div className="w-6 h-0.5 bg-white"></div>
            <div className="w-6 h-0.5 bg-white"></div>
            <div className="w-6 h-0.5 bg-white"></div>
          </div>
        </button>
      </header>

      {/* Links - Mobile, below the logo */}
      <div className="lg:hidden text-center mt-4 mb-8">
        <div className="space-x-6 flex justify-center text-sm lg:text-base">
          <Link href="/main" className="hover:text-blue-300">Menu</Link>
          <Link href="/about us" className="hover:text-blue-300">Agradecimentos</Link>
          <Link href="/games" className="hover:text-blue-300">Games</Link>
          <Link href="/ranking" className="hover:text-blue-300">Ranking</Link>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`lg:w-64 bg-white text-gray-800 p-6 min-h-screen shadow-lg fixed top-0 left-0 transform transition-all duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 mt-16 lg:mt-0`}>
          <div className="flex flex-col items-center space-y-4 mb-8">
            <Link href="/perfil">
              <img src={avatar || '/person.svg'} alt="Imagem de Perfil" className="w-16 h-16 rounded-full cursor-pointer border-2 border-gray-300" />
            </Link>
            <div className="text-lg font-semibold text-gray-900">{user.displayName || user.nickname}</div>
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
        <main className={`flex-1 p-8 text-black max-w-full lg:max-w-3xl mx-auto ${sidebarOpen ? 'ml-0' : 'lg:ml-64'}`}>
        <button 
          onClick={handleOpenModal}
          className="w-auto bg-transparent text-white p-2 mb-4 rounded-md shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Instruções
        </button>
          <div className="max-w-2xl mx-auto p-6 rounded-lg shadow-lg bg-white text-black">
            <h2 className="text-2xl font-semibold mb-4 text-black">Cadastro de Atividade</h2>
            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label htmlFor="atividade" className="block text-lg">Atividade:</label>
                <input 
                  type="text" 
                  id="atividade" 
                  name="atividade" 
                  value={atividade}
                  onChange={(e) => setAtividade(e.target.value)} 
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" 
                  placeholder="Digite a atividade que deseja realizar"
                />
              </div>

              <div>
                <label htmlFor="prioridade" className="block text-lg">Prioridade:</label>
                <select 
                  id="prioridade" 
                  name="prioridade" 
                  value={prioridade}
                  onChange={(e) => setPrioridade(e.target.value)} 
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="alta">Alta</option>
                  <option value="media">Média</option>
                  <option value="baixa">Baixa</option>
                </select>
              </div>

              <div>
                <label htmlFor="descricao" className="block text-lg">Descrição da Atividade:</label>
                <textarea 
                  id="descricao" 
                  name="descricao" 
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)} 
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" 
                  rows="4" 
                  placeholder="Descreva os detalhes da atividade"
                ></textarea>
              </div>

              <div>
                <label htmlFor="jogo" className="block text-lg">Selecione um Jogo:</label>
                <select 
                  id="jogo" 
                  name="jogo" 
                  value={selectedGame}
                  onChange={(e) => setSelectedGame(e.target.value)} 
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Selecione um jogo</option>
                  {games.map((game) => (
                    <option key={game.id} value={game.id}>{game.name}</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Enviar
              </button>
            </form>
          </div>
        </main>
      </div>
      {/* Modal de Instruções */}
      {showInstructions && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative w-11/12 sm:w-10/12 lg:w-1/2 max-w-lg mx-auto">
            {/* Fechar Modal */}
            <button 
              className="absolute top-2 right-2 p-2 text-white bg-gray-800 rounded-full"
              onClick={handleCloseModal}
            >
              X
            </button>
            
            {/* Imagem de Instruções com Animação Suave de Respiração */}
            <div className="flex flex-col items-center">
              <img 
                src="/ilustracao-do-jovem-sorridente.png" 
                alt="Instruções"
                className={`${[`animate-pulse-slow`]}w-40 sm:w-48 md:w-64 h-auto`} // Ajuste responsivo da largura da imagem
              />
              {/* Exibir texto com animação de slide */}
              <div className={`${styles[`animate-text`]} mt-4 text-white text-lg sm:text-xl md:text-2xl max-w-lg text-center`}>
                {messages[currentText]}
              </div>
            </div>
          </div>
        </div>
      )}



    </div>
  );
}
