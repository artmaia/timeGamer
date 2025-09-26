'use client'

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { Tooltip, OverlayTrigger, Modal, Button } from 'react-bootstrap';
import { db } from '../firebase/config';
import { collection, getDocs, setDoc, getDoc, updateDoc, doc, addDoc, query, where, deleteDoc } from 'firebase/firestore'; // Firebase imports
import Link from 'next/link';
import { auth } from '../firebase/config';
import { getAuth, onAuthStateChanged } from 'firebase/auth';



const GoalsPage = () => {
  const [goals, setGoals] = useState([]);  // This will store the goals in the local state
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState('');
  const [nickname, setNick] = useState('');
  const [bio, setBio] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // New states for the form
  const [newGoal, setNewGoal] = useState(''); // For the new goal text
  const [userGoals, setUserGoals] = useState([]); // Store the user's goals
  const [showRescueModal, setShowRescueModal] = useState(false);
  const [showRescuedModal, setShowRescuedModal] = useState(false); // Modal de "Moedas Resgatadas"
  const [selectedGoal, setSelectedGoal] = useState(null);

  // Example of predefined goals (could be from local data or hardcoded)
  const predefinedGoals = [
    { id: 1, goal: 'Complete 3 sessões de Pomodoro de 60 minutos', coinsReward: 10, completed: false, rescued: false, position: { top: '50%', left: '10%' } },
    { id: 2, goal: 'Complete 5 sessões de Pomodoro de 30 minutos', coinsReward: 10, completed: false, rescued: false, position: { top: '60%', left: '90%' } },
    { id: 3, goal: 'Complete 5 atividades', coinsReward: 15, completed: false, rescued: false, position: { top: '70%', left: '30%' } },
    { id: 4, goal: 'Mais de 100 minutos de técnica Pomodoro', coinsReward: 15, completed: false, rescued: false, position: { top: '50%', left: '50%' } },
    { id: 5, goal: 'Mais de 200 minutos de Pomodoro', coinsReward: 20, completed: false, rescued: false, position: { top: '90%', left: '70%' } }
  ];

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);  // Update the user state with the authenticated user
        fetchProfileData(currentUser.uid);  // Fetch profile data using the user's UID

        // Fetch progress data after login
        fetchProgressData(currentUser.uid);
        checkSystemGoalsProgress(currentUser.uid); // Check the system goals when user logs in
      } else {
        setUser(null);  // If no user, clear the state
      }
    });

    // Cleanup the listener when the component is unmounted
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchGoals = async () => {
        const q = query(collection(db, "metas_usuario"), where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);

        // Pega os dados das metas cadastradas
        const goalsData = querySnapshot.docs.map(doc => doc.data());
        setUserGoals(goalsData);
      };

      fetchGoals();
    }
  }, [user]); // Dependência para quando o usuário mudar

  // Use predefined goals here
  useEffect(() => {
    setGoals(predefinedGoals); // Setting the predefined goals as the state
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
      console.error('Error fetching profile:', error);
    }
  };

  const fetchProgressData = async (uid) => {
    try {
      const docRef = doc(db, "progresso", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const progressData = docSnap.data();
        console.log("User progress data:", progressData);
      } else {
        console.log("No progress found for the user.");
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  const checkSystemGoalsProgress = async (uid) => {
    try {
      console.log("UID do usuário:", uid);  // Verifica o UID do usuário
  
      // Usando doc para pegar os dados diretamente do progresso
      const docRef = doc(db, "progresso", uid); // Pega o documento de progresso do usuário
      const docSnap = await getDoc(docRef); // Faz a leitura do documento
  
      if (!docSnap.exists()) {
        console.log("Não foi encontrado progresso para este usuário.");
        return;  // Sai da função caso não encontre o progresso
      }
  
      const progressData = docSnap.data();
      const pomodoro60minSessions = progressData.pomodoro60min;
      const pomodoro30minSessions = progressData.pomodoro30min;
      const totalActivities = progressData.completedActivities;
      const pomodoroTime = progressData.pomodoroTime;
  
      console.log('Sessões de Pomodoro de 60 minutos:', pomodoro60minSessions);
      console.log('Sessões de Pomodoro de 30 minutos:', pomodoro30minSessions);
      console.log('Atividades concluídas:', totalActivities);
      console.log('Tempo total de Pomodoro:', pomodoroTime);
  
      // Verificação de todas as metas
      predefinedGoals.forEach((goal, index) => {
        if (goal.goal === "Complete 3 sessões de Pomodoro de 60 minutos" && pomodoro60minSessions >= 3 && !goal.completed) {
          predefinedGoals[index].completed = true;
          console.log(`Meta com ID ${goal.id} foi marcada como completada.`);
        }
        if (goal.goal === "Complete 5 sessões de Pomodoro de 30 minutos" && pomodoro30minSessions >= 5 && !goal.completed) {
          predefinedGoals[index].completed = true;
          console.log(`Meta com ID ${goal.id} foi marcada como completada.`);
        }
        if (goal.goal === "Complete 5 atividades" && totalActivities >= 5 && !goal.completed) {
          predefinedGoals[index].completed = true;
          console.log(`Meta com ID ${goal.id} foi marcada como completada.`);
        }
        if (goal.goal === "Mais de 100 minutos de técnica Pomodoro" && pomodoroTime >= 100 && !goal.completed) {
          predefinedGoals[index].completed = true;
          console.log(`Meta com ID ${goal.id} foi marcada como completada.`);
        }
        if (goal.goal === "Mais de 200 minutos de Pomodoro" && pomodoroTime >= 200 && !goal.completed) {
          predefinedGoals[index].completed = true;
          console.log(`Meta com ID ${goal.id} foi marcada como completada.`);
        }
      });
  
      // Atualiza o estado das metas para re-renderizar a interface
      setGoals([...predefinedGoals]);
  
    } catch (error) {
      console.error("Erro ao atualizar o progresso da meta:", error);
    }
  };

  // Atualiza a quantidade de coins do usuário
  const updateCoins = async (uid, coins) => {
    const userRef = doc(db, 'perfil', uid);
    try {
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const newCoins = userData.coins ? userData.coins + coins : coins;

        await updateDoc(userRef, { coins: newCoins });
        console.log(`Coins atualizados para ${newCoins}`);
      }
    } catch (error) {
      console.error('Erro ao atualizar coins:', error);
    }
  };

  // Função para abrir o modal de resgate de coins
  const handleRescueCoins = (goal) => {
    if (goal.completed && !goal.rescued) {
      setSelectedGoal(goal);
      setShowRescueModal(true);
    } else if (goal.rescued) {
      // Se já resgatou moedas, exibe um modal informando
      setSelectedGoal(goal);
      setShowRescuedModal(true);
    }
  };

  // Função de resgatar coins
  const handleRescueConfirm = async () => {
    if (selectedGoal) {
      await updateCoins(user.uid, selectedGoal.coinsReward);
      // Atualiza a meta para indicar que os coins foram resgatados
      await updateDoc(doc(db, "perfil", user.uid), {
        [`goals.${selectedGoal.id}.rescued`]: true,
      });
      setGoals(goals.map(goal =>
        goal.id === selectedGoal.id ? { ...goal, completed: true, rescued: true } : goal
      ));
      setShowRescueModal(false);
      console.log(`Coins de ${selectedGoal.goal} resgatados!`);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (newGoal && user) {
      const userGoalsRef = collection(db, "metas_usuario");
  
      const goalData = {
        goal: newGoal,
        completed: false,
        uid: user.uid,
        createdAt: new Date(),
      };
  
      try {
        // Adiciona nova meta na coleção "metas_usuario"
        const docRef = await addDoc(userGoalsRef, goalData);
        console.log("Meta registrada com sucesso!");
  
        // Atualiza o estado local com a nova meta incluindo o id do documento
        setUserGoals([...userGoals, { id: docRef.id, goal: newGoal}]);
  
        // Limpa o campo de entrada
        setNewGoal('');
      } catch (error) {
        console.error("Erro ao adicionar nova meta:", error);
      }
    } else {
      console.log('Usuário não autenticado ou meta inválida');
    }
  };
  
  // const handleDeleteGoal = async (goalId) => {
  //   if (!goalId) {
  //     console.error("Erro: goalId está indefinido ou nulo.");
  //     return;
  //   }
  
  //   console.log("Excluindo meta com ID:", goalId);
  
  //   const goalRef = doc(db, "metas_usuario", goalId);
  //   try {
  //     await deleteDoc(goalRef);
  //     const updatedGoals = userGoals.filter((goal) => goal.id !== goalId);
  //     setUserGoals(updatedGoals);
  //   } catch (error) {
  //     console.error("Erro ao excluir a meta:", error);
  //   }
  // };

  const deleteGoal = async (goalId) => {
    try {
      // Referência para o documento da meta
      const goalDocRef = doc(db, 'metas_usuario', goalId);
      
      // Deleta o documento
      await deleteDoc(goalDocRef);
  
      // Atualiza o estado local para remover a meta excluída
      setUserGoals(userGoals.filter(goal => goal.id !== goalId));
    } catch (error) {
      console.error("Erro ao excluir a meta:", error);
    }
  };
  
  
  
  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-purple-500 to-pink-500">
      {/* Header */}
      <header style={{ backgroundColor: '#34177B' }} className="text-white p-6 flex justify-between items-center shadow-md z-20 relative">
        <div className="text-xl font-bold">
          <img src="/logo_header.svg" alt="Logo do Site" className="h-8" />
        </div>
        {/* Links - Desktop */}
        <div className="hidden lg:flex space-x-6">
          <Link href="/main" className="hover:text-blue-300">Menu</Link>
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

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`lg:w-64 w-3/4 bg-white text-gray-800 p-6 min-h-screen shadow-lg fixed top-0 left-0 transform transition-all duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0 z-30' : '-translate-x-full'} lg:relative lg:translate-x-0 mt-20 lg:mt-0`}>
          <div className="flex flex-col items-center space-y-4 mb-8">
            <Link href="/perfil">
              <img src={avatar || '/person.svg'} alt="Imagem de Perfil" className="w-16 h-16 rounded-full cursor-pointer border-2 border-gray-300" />
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
        <main className="lg:w-3/4 w-full p-6">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Mapa de Metas</h1>
          </header>

          {/* Mapa de Metas */}
          <div className="relative w-full h-96 bg-cover bg-center rounded-lg" style={{ backgroundImage: 'url(/mapa.svg)' }}>
            <div className="absolute top-0 left-0 w-full h-full">
              {goals.map((goal, index) => (
                goal.position ? (
                  <OverlayTrigger
                    key={`${goal.id}-${index}`}  // Garantindo uma chave única com id + índice
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-${goal.id}`}>
                        {goal.goal} {goal.completed ? ` - Coins resgatados`: ` - Resgatar seus coins`}
                      </Tooltip>
                    }
                  >
                    <div
                      className={`absolute p-2 ${goal.completed ? 'bg-green-500' : 'bg-yellow-500'} rounded-full`}
                      style={{
                        top: goal.position.top,
                        left: goal.position.left,
                        transform: 'translate(-50%, -50%)',
                        cursor: goal.completed ? 'not-allowed' : 'pointer',
                      }}
                      onClick={() => handleRescueCoins(goal)}
                    >
                      <i className="fas fa-star text-white"></i>
                    </div>
                  </OverlayTrigger>
                ) : null
              ))}
            </div>
          </div>

          {/* Minhas Metas Form */}
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">Minhas Metas</h2>
            <div className="flex space-x-6">
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Digite sua meta..."
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
              />
              <button
                onClick={handleAddGoal}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Adicionar Meta
              </button>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-semibold">Sua Meta Cadastrada:</h3>
            <div className="mt-4">
              {userGoals.length === 0 ? (
                <p className="text-gray-500">Você não tem metas cadastradas.</p>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex justify-between items-center p-3 border-b last:border-b-0">
                    <p className="text-lg font-medium">{userGoals[0].goal}</p>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => deleteGoal(userGoals[0].goal)}  // Passando o goal.id para a função de exclusão
                        className="px-3 py-1 text-white bg-red-500 rounded-full"
                      >
                        Excluir
                      </button>
                    </div>

                    
                  </div>
                </div>
              )}
            </div>
          </div>


        </main>
      </div>

      {/* Modal para Resgatar Coins */}
      <Modal show={showRescueModal} onHide={() => setShowRescueModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Resgatar Coins</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Você deseja resgatar os coins de "{selectedGoal?.goal}"?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRescueModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleRescueConfirm}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Moedas Resgatadas */}
      <Modal show={showRescuedModal} onHide={() => setShowRescuedModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Moedas Resgatadas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Você já resgatou as moedas de "{selectedGoal?.goal}".</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRescuedModal(false)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GoalsPage;
