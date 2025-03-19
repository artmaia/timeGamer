'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { db, auth } from '../firebase/config';  // Certifique-se de importar corretamente a instância do Firestore
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Funções do Firestore

const RewardsPage = () => {
  const [rewards, setRewards] = useState([
    {
      id: 1,
      image: 'https://api.dicebear.com/9.x/avataaars/svg?seed=recompensa1',
      value: 1, // 1 moeda
    },
    {
      id: 2,
      image: 'https://api.dicebear.com/9.x/avataaars/svg?seed=recompensa2',
      value: 2, // 2 moedas
    },
    {
      id: 3,
      image: 'https://api.dicebear.com/9.x/avataaars/svg?seed=recompensa3',
      value: 3, // 3 moedas
    },
    // Adicionar mais recompensas conforme necessário...
  ]);

  const [coins, setCoins] = useState(0); // Estado para armazenar as moedas do usuário
  const [showInsufficientModal, setShowInsufficientModal] = useState(false); // Controle do modal de saldo insuficiente
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Controle do modal de confirmação
  const [showUpdateModal, setShowUpdateModal] = useState(false); // Controle do modal de atualização do avatar
  const [selectedReward, setSelectedReward] = useState(null); // Reward selecionada para compra
  const [purchasedAvatars, setPurchasedAvatars] = useState([]); // Avatares já comprados

  // Função para buscar as moedas do usuário na coleção 'perfil'
  const fetchProfileData = async (uid) => {
    const userRef = doc(db, 'perfil', uid); // Referência para o documento do usuário na coleção 'perfil'
    
    try {
      const docSnapshot = await getDoc(userRef); // Obtém o documento do usuário
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setCoins(data.coins || 0); // Define as moedas do usuário, se não houver, define como 0
        setPurchasedAvatars(data.purchasedAvatars || []); // Obtém os avatares comprados
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    }
  };

  // Usando o useEffect para buscar as moedas assim que o componente for montado
  useEffect(() => {
    const user = auth.currentUser; // Obtém o usuário logado

    if (user) {
      fetchProfileData(user.uid); // Chama a função passando o UID do usuário
    }
  }, []); // Apenas uma vez, ao montar o componente

  // Função chamada ao clicar em um avatar para verificar se é possível comprar ou atualizar
  const handleRewardClick = (reward) => {
    if (coins >= reward.value && !purchasedAvatars.includes(reward.id)) {
      setSelectedReward(reward); // Define a recompensa selecionada
      setShowConfirmModal(true); // Exibe o modal de confirmação
    } else if (purchasedAvatars.includes(reward.id)) {
      setSelectedReward(reward); // Define a recompensa selecionada
      setShowUpdateModal(true); // Exibe o modal de atualização
    } else {
      setShowInsufficientModal(true); // Exibe o modal de saldo insuficiente
    }
  };

  // Função para confirmar a compra
  const confirmPurchase = async () => {
    if (selectedReward) {
      const user = auth.currentUser;
      const userRef = doc(db, 'perfil', user.uid);
      
      // Deduzir o valor da compra do saldo
      const newCoinBalance = coins - selectedReward.value;

      try {
        // Atualizar o saldo e os avatares comprados no Firestore
        await updateDoc(userRef, {
          coins: newCoinBalance,
          avatar: selectedReward.image, // Atualiza o avatar do usuário
          purchasedAvatars: [...purchasedAvatars, selectedReward.id], // Adiciona o avatar à lista de comprados
        });
        setCoins(newCoinBalance); // Atualiza o estado local com o novo saldo
        setPurchasedAvatars((prevAvatars) => [...prevAvatars, selectedReward.id]); // Atualiza os avatares comprados localmente
        setShowConfirmModal(false); // Fecha o modal de confirmação
        setSelectedReward(null); // Limpa a recompensa selecionada
      } catch (error) {
        console.error('Erro ao confirmar a compra:', error);
      }
    }
  };

  // Função para confirmar a atualização do avatar
  const confirmUpdate = async () => {
    if (selectedReward) {
      const user = auth.currentUser;
      const userRef = doc(db, 'perfil', user.uid);

      try {
        // Atualizar o avatar do usuário no Firestore
        await updateDoc(userRef, {
          avatar: selectedReward.image, // Atualiza o avatar do usuário
        });
        setShowUpdateModal(false); // Fecha o modal de atualização
        setSelectedReward(null); // Limpa a recompensa selecionada
      } catch (error) {
        console.error('Erro ao atualizar avatar:', error);
      }
    }
  };

  // Função para cancelar a compra ou atualização
  const cancelPurchaseOrUpdate = () => {
    setShowConfirmModal(false); // Fecha o modal de confirmação ou atualização
    setShowUpdateModal(false);
    setSelectedReward(null); // Limpa a recompensa selecionada
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-500 to-pink-500">
      {/* Header */}
      <header style={{ backgroundColor: '#34177B' }} className="text-white p-6 flex justify-between items-center shadow-md">
        <div className="text-xl font-bold">
          <img src="/logo_header.svg" alt="Logo do Site" className="h-8" />
        </div>
        <div className="space-x-4">
          <Link href="/agradecimento" className="hover:text-blue-300">Agradecimentos</Link>
          <Link href="/games" className="hover:text-blue-300">Games</Link>
          <Link href="/ranking" className="hover:text-blue-300">Ranking</Link>
        </div>
      </header>

      {/* Saquinho de Dinheiro */}
      <div className="fixed top-20 left-6 flex items-center bg-yellow-400 text-white p-2 rounded-full shadow-md">
        <span className="text-xl">💰</span>
        <span className="ml-2 text-lg font-semibold">{coins} moedas</span>
      </div>

      {/* Main content: Display Rewards */}
      <div className="flex-1 p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className={`w-full bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 ${purchasedAvatars.includes(reward.id) ? 'opacity-50' : ''}`}
            >
              <div onClick={() => handleRewardClick(reward)}>
                <img
                  src={reward.image}
                  alt={`Recompensa ${reward.id}`}
                  className="w-full h-40 object-cover rounded-t-lg hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">{reward.description}</h2>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-yellow-500 text-2xl">💰</span>
                  <span className="text-lg font-semibold text-black">{reward.value} moedas</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Saldo Insuficiente */}
      {showInsufficientModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl text-black font-bold">Saldo Insuficiente</h3>
            <p className="mt-2 text-black">Você não tem moedas suficientes para comprar esta recompensa.</p>
            <div className="mt-4 flex justify-end space-x-4">
              <button onClick={() => setShowInsufficientModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded-md">Fechar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Compra */}
      {showConfirmModal && selectedReward && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl text-black font-bold">Confirmar Compra</h3>
            <p className="mt-2 text-black">Você tem {coins} moedas. Deseja comprar a imagem do avatar por {selectedReward.value} moedas?</p>
            <div className="mt-4 flex justify-end space-x-4">
              <button onClick={cancelPurchaseOrUpdate} className="bg-gray-500 text-white px-4 py-2 rounded-md">Cancelar</button>
              <button onClick={confirmPurchase} className="bg-green-500 text-white px-4 py-2 rounded-md">Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Atualização de Avatar */}
      {showUpdateModal && selectedReward && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-black">Atualizar Avatar</h3>
            <p className="mt-2 text-black">Você já comprou este avatar. Deseja atualizar sua imagem de avatar para essa recompensa?</p>
            <div className="mt-4 flex justify-end space-x-4">
              <button onClick={cancelPurchaseOrUpdate} className="bg-gray-500 text-white px-4 py-2 rounded-md">Cancelar</button>
              <button onClick={confirmUpdate} className="bg-blue-500 text-white px-4 py-2 rounded-md">Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsPage;
