'use client';
import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';



const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth)
  const router = useRouter();
  

  const handleSignIn = async () => {
    try {
      console.log("Tentando autenticar com:", { email, password });

      // ✅ Aqui usamos a função correta do Firebase SDK!
      const res = await signInWithEmailAndPassword(email, password);

      console.log("Usuário autenticado com sucesso!", res);
      setEmail('');
      setPassword('');

      sessionStorage.setItem('user', true);
      router.push('/main');
    } catch (error) {
      console.error("Erro ao autenticar:", error.code, error.message);

      // Tratamento de erros específicos do Firebase
      if (error.code === "auth/user-not-found") {
        setError("Usuário não encontrado. Verifique o email.");
      } else if (error.code === "auth/wrong-password") {
        setError("Senha incorreta. Tente novamente.");
      } else if (error.code === "auth/invalid-email") {
        setError("Formato de email inválido.");
      } else {
        setError("Erro ao autenticar. Verifique suas credenciais.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex flex-col">
      
      <header style={{ backgroundColor: '#34177B' }} className="text-white p-6 flex justify-between items-center shadow-md">
        <div className="text-xl font-bold">
          <img src="/logo_header.svg" alt="Logo do Site" className="h-8" />
        </div>
        <button onClick={() => router.push('/')} className="text-white text-2xl">←</button>
      </header>

      <div className="flex flex-col items-center justify-center flex-grow">
        <h1 className="text-3xl font-bold text-white mb-6">Login</h1>
        
        <div className="bg-white p-10 rounded-lg shadow-xl w-96">
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
            placeholder="Senha" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-3 mb-4 bg-gray-100 rounded outline-none text-black placeholder-gray-500"
          />
          
          <button 
            onClick={handleSignIn}
            className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
