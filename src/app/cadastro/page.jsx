'use client'
import { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation'; // Para redirecionamento

// Configuração do Firestore
const db = getFirestore();

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const router = useRouter(); // Hook de navegação

  const handleSignUp = async () => {
    if (!username || !nickname) {
      setError('Username and Nickname are required');
      return;
    }

    try {
      // Criar o usuário no Firebase Authentication
      const res = await createUserWithEmailAndPassword(email, password);
      console.log({ res });

      // Salvar o perfil do usuário no Firestore
      const userRef = doc(db, 'perfil', res.user.uid); // Usando o UID do usuário
      const userData = {
        username,
        nickname,
        bio: '', // Inicializa com valor vazio, pode ser editado depois
        avatar: '' // Inicializa com valor vazio
      };

      await setDoc(userRef, userData);

      // Limpar os campos após o sucesso
      setEmail('');
      setPassword('');
      setUsername('');
      setNickname('');
      sessionStorage.setItem('user', true); // Marca o usuário como autenticado
      router.push('/'); // Redireciona para a página raiz após cadastro
    } catch (e) {
      console.error(e);
      setError('Failed to sign up. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex flex-col">
      
      {/* Header com a seta para a página raiz */}
      <header style={{ backgroundColor: '#34177B' }} className="text-white p-6 flex justify-between items-center shadow-md">
        <div className="text-xl font-bold">
          <img src="/logo_header.svg" alt="Logo do Site" className="h-8" />
        </div>
        <button 
          onClick={() => router.push('/')} // Redireciona para a página raiz
          className="text-white text-2xl"
        >
          ←
        </button>
      </header>

      {/* Formulário de cadastro */}
      <div className="flex flex-col items-center justify-center flex-grow">
        <div>
          <h1 className="text-3xl font-bold text-white mb-6">Cadastro</h1>

        </div>
        
        <div className="bg-white p-10 rounded-lg shadow-xl w-96">
          {/* Exibindo erros */}
          {error && <p className="text-red-500">{error}</p>}

          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full p-3 mb-4 bg-gray-100 rounded outline-none text-black placeholder-gray-500"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-3 mb-4 bg-gray-100 rounded outline-none text-black placeholder-gray-500"
          />
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            className="w-full p-3 mb-4 bg-gray-100 rounded outline-none text-black placeholder-gray-500"
          />
          <input 
            type="text" 
            placeholder="Nickname" 
            value={nickname} 
            onChange={(e) => setNickname(e.target.value)} 
            className="w-full p-3 mb-4 bg-gray-100 rounded outline-none text-black placeholder-gray-500"
          />
          
          <button 
            onClick={handleSignUp}
            className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
