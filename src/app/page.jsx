import Link from "next/link";
import styles from './home.module.css'

export default function Home() {
  return (
    <div>
      {/* Cabeçalho */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src="/logo_header.svg" alt="Logo TimeGamer" />
        </div>
        <nav className={styles.nav}>
          <a href="/agradecimento">Agradecimento</a>
        </nav>
      </header>

      {/* Seção principal */}
      <main className={styles.main}>
        <div className={styles.content}>
          <img src="/logo_main.svg" alt="Ícone do Controle" className={styles.mainLogo} />
          <h2>Tenha acesso para organizar suas tarefas e progredir nos seus jogos!</h2>
          <div className={styles.buttoncontainer}>
            <Link href="/cadastro">
              <button className="w-32 py-2 bg-white text-black rounded-lg shadow-lg hover:bg-gray-300  transition-all duration-300">
                Cadastrar
              </button>
            </Link>
            <Link href="/login">
              <button className="w-32 py-2 bg-white text-black rounded-lg shadow-lg hover:bg-gray-300 transition-all duration-300">
                Login
              </button>
            </Link>

          </div>
        </div>
      </main>
      
      {/* Imagem de fundo */}
      <div className={styles.backgroundImage}></div>
    </div>
  );
}
