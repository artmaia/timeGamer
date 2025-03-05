'use client';

import Link from 'next/link';

const ThankYouPage = () => {
  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-br from-purple-500 to-pink-500`}>
      {/* Header */}
      <header style={{ backgroundColor: '#34177B' }} className="text-white p-6 flex justify-between items-center shadow-md z-20 relative">
        <div className="text-xl font-bold">
          <img src="/logo_header.svg" alt="Logo do Site" className="h-8" />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 py-8">
        <img src="/logo_header.svg" alt="Logo do TimeGamer" className="h-24 mb-6 mx-auto" /> {/* Logo repetida no conteúdo */}

        <h2 className="text-3xl font-semibold mb-6 text-center text-white">
          Agradecemos por utilizar o TimeGamer!
        </h2>

        {/* Section - Sobre */}
        <div className="max-w-3xl text-lg text-white text-left sm:text-justify space-y-6 mb-8">
          <h3 className="text-xl font-bold">Sobre</h3>
          <p>
            O TimeGamer é um sistema de gerenciamento de atividades e jogos, permitindo que o usuário aproveite seu tempo da melhor forma,
            equilibrando produtividade e diversão.
          </p>
          <p>
            Desenvolvido com carinho pela nossa equipe, o TimeGamer proporciona uma experiência única de otimização de tempo, garantindo que você se mantenha focado enquanto também aproveita para se divertir com jogos.
          </p>
          <p>
            Através de Criatividade, o TimeGamer permite organizar suas tarefas e usar intervalos para jogos de maneira saudável.
          </p>
        </div>

        {/* Section - Equipe */}
        <div className="max-w-3xl text-lg text-white text-left sm:text-justify space-y-6">
          <h3 className="text-xl font-bold">Equipe</h3>
          <p>
            Este aplicativo foi desenvolvido pelos alunos Arthur Maia e Eiji Taguchi no âmbito do Instituto de Ciências Exatas e Tecnologia (ICET) da Universidade Federal do Amazonas (UFAM), do curso de Engenharia de Software e Sistemas de Informação, sob a orientação do professor Rainer Xavier de Amorim.
          </p>
        </div>

      </main>
    </div>
  );
};

export default ThankYouPage;
