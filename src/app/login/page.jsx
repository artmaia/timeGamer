'use client'
 import { useState } from 'react';
 import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
 import { auth } from '@/app/firebase/config';
 import { useRouter } from 'next/navigation';
 
 const SignIn = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
   const router = useRouter();
 
   const handleSignIn = async () => {
    if (!email || !password) {
      alert("Preencha o e-mail e a senha!");
      return;
    }
  
    try {
      const res = await signInWithEmailAndPassword(email, password);
      console.log("Resposta Firebase:", res);
  
      if (!res || !res.user) {
        console.error("Erro inesperado no login:", res);
        return;
      }
  
      sessionStorage.setItem("user", true);
      setEmail("");
      setPassword("");
      router.push("/main");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
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
 
       {/* Formulário de login */}      {/* Formulário de login */}
       <div className="flex flex-col items-center justify-center flex-grow">
         <div>
           <h1 className="text-3xl font-bold text-white mb-6">Login</h1>          <h1 className="text-3xl font-bold text-white mb-6">Login</h1>
         </div>
         
         <div className="bg-white p-10 rounded-lg shadow-xl w-96">
           {/* Exibindo erros */}
           {/* Pode adicionar uma condição de erro aqui, se necessário */}
 
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
             className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
           >
             Sign In
           </button>
         </div>
       </div>
     </div>
   );
 };
 
 export default SignIn;