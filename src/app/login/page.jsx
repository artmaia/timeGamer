'use client'
import { auth } from '../firebase/config';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Estado para armazenar a mensagem de erro
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignIn = async () => {
    // Resetar mensagem de erro ao tentar um novo login
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const res = await signInWithEmailAndPassword(email, password);
      
      if (!res || !res.user) {
        throw new Error("Erro ao autenticar. Tente novamente.");
      }

      console.log("Usuário autenticado:", res.user);
      sessionStorage.setItem('user', true);
      setEmail('');
      setPassword('');
      router.push('/main');
    } catch (error) {
      console.error("Erro ao autenticar:", error);

      // Capturando erros específicos do Firebase e exibindo mensagens apropriadas
      if (error.code === 'auth/wrong-password') {
        setErrorMessage('Senha incorreta. Tente novamente.');
      } else if (error.code === 'auth/user-not-found') {
        setErrorMessage('Usuário não encontrado. Verifique o e-mail.');
      } else if (error.code === 'auth/too-many-requests') {
        setErrorMessage('Muitas tentativas falhas. Aguarde um momento antes de tentar novamente.');
      } else {
        setErrorMessage('Erro ao autenticar. Verifique suas credenciais.');
      }
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

      {/* Formulário de login */}
      <div className="flex flex-col items-center justify-center flex-grow">
        <div>
          <h1 className="text-3xl font-bold text-white mb-6">Login</h1>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-xl w-96">
          
          {/* Exibição da mensagem de erro */}
          {errorMessage && (
            <div className="bg-red-500 text-white p-3 mb-4 rounded text-center">
              {errorMessage}
            </div>
          )}

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
          
          <button
            onClick={handleSignIn}
            className="w-full p-2 mt-4 bg-indigo-600 rounded text-white hover:bg-indigo-500"
          >
            Sign In
          </button>
          <p><Link href='/authLogin' className="flex justify-end mt-2 text-sm text-pink-600 underline-offset-8 hover:text-blue-300">Esqueceu a senha?</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
