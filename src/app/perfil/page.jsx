'use client'

import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Link from 'next/link';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [newBio, setNewBio] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [user, setUser] = useState(null);
  const [nickname, setNick] = useState('');
  const [bio, setBio] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false); // Controle para abrir e fechar o sidebar no mobile

  // Lista de avatares predefinidos (pode ser substituído por avatares dinâmicos)
  const avatarOptions = [
    { id: 1, url: 'https://api.dicebear.com/9.x/avataaars/svg?seed=avatar1' },
    { id: 2, url: 'https://api.dicebear.com/9.x/avataaars/svg?seed=avatar2' },
    { id: 3, url: 'https://api.dicebear.com/9.x/avataaars/svg?seed=avatar3' },
    { id: 4, url: 'https://api.dicebear.com/9.x/avataaars/svg?seed=avatar4' },
    { id: 5, url: 'https://api.dicebear.com/9.x/avataaars/svg?seed=avatar5' },
    { id: 6, url: 'https://api.dicebear.com/9.x/avataaars/svg?seed=avatar6' },
    { id: 7, url: 'https://api.dicebear.com/9.x/avataaars/svg?seed=avatar7' },
    { id: 8, url: 'https://api.dicebear.com/9.x/avataaars/svg?seed=avatar8' },
    { id: 9, url: 'https://api.dicebear.com/9.x/avataaars/svg?seed=avatar9' },
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex flex-col">
      {/* Header */}
      <header style={{ backgroundColor: '#34177B' }} className="text-white p-6 flex justify-between items-center shadow-md z-20 relative">
        <div className="text-xl font-bold">
          <img src="/logo_header.svg" alt="Logo do Site" className="h-8" />
        </div>
        {/* Links - Desktop */}
        <div className="hidden lg:flex space-x-6">
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
        <aside className={`lg:w-72 bg-white text-gray-800 p-6 shadow-lg fixed lg:block top-20 left-0 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:h-screen h-screen`}>
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

        <main className="flex-1 p-8 bg-gradient-to-tl text-black flex justify-center items-center ml-0 lg:ml-72">
          <div className="w-full max-w-2xl p-6 rounded-lg shadow-lg bg-white text-black">
            <h2 className="text-2xl font-semibold mb-4 text-black">Perfil</h2>

            <div className="space-y-4">
              <p className="text-xl font-medium">Username: {profileData ? profileData.username : 'Carregando...'}</p>
              <p className="text-xl font-medium">Nickname: {profileData ? profileData.nickname : 'Carregando...'}</p>
              <div className="text-xl font-medium">
                Bio:
                <input
                  type="text"
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                  placeholder="Nova bio"
                  className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Exibir opções de avatares para o usuário escolher */}
              <div className="text-xl font-medium">
                Avatar:
                <div className="flex space-x-4 mt-2">
                  {avatarOptions.map((avatar) => (
                    <div
                      key={avatar.id}
                      onClick={() => setSelectedAvatar(avatar.url)} // Atualizar o avatar escolhido
                      className="cursor-pointer"
                    >
                      <img
                        src={avatar.url}
                        alt={`Avatar ${avatar.id}`}
                        className={`w-16 h-16 rounded-full ${selectedAvatar === avatar.url ? 'border-4 border-indigo-600' : ''}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={handleUpdateProfile}
                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Atualizar Perfil
              </button>
              <button
                onClick={() => alert('Excluir Perfil')}
                className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Excluir Perfil
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
