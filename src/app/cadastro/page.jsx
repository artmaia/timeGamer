'use client'

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/app/firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignUp = async () => {
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
    <div>
      <h1>Cadastro</h1>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" />
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Nome" />
      <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Apelido" />
      <button onClick={handleSignUp}>Cadastrar</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default SignUp;
