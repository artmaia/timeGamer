'use client'
import { auth, db } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState(""); 
  const router = useRouter();

  const handleSignUp = async () => {

    const senhaForte = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!senhaForte.test(password)) {
      setError("A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial");
      return;

    }
    try {
      console.log("Criando usuário no Firebase Authentication...");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
    
      console.log("Usuário criado e autenticado com sucesso!", user);

      // 🔥 Garantir que auth.currentUser está correto
      if (!auth.currentUser) {
        console.error("Erro: Usuário não autenticado no Firebase.");
        return;
      }

      console.log("UID autenticado no Firebase antes de salvar no Firestore:", auth.currentUser.uid);

      // 🔥 **Agora podemos salvar no Firestore**
      const userRef = doc(db, "perfil", user.uid);
      const userData = {
        username,
        nickname,
        email: user.email,
        bio: "",
        avatar: "",
      };

      console.log("Tentando salvar perfil no Firestore:", userData);
      await setDoc(userRef, userData);
      console.log("Usuário salvo no Firestore com sucesso!");

      setEmail("");
      setPassword("");
      setUsername("");
      setNickname("");
      sessionStorage.setItem("user", true);
      router.push("/");
    } catch (error) {
      console.error("Erro ao criar usuário:", error.message);
      setError(error.message);
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
            minLength={8}
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
