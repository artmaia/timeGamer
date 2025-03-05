'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const GamesPage = () => {
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);

  // Fetch games from the API when the page loads
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('/api/games');
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setGames(data.results);
      } catch (error) {
        setError('Erro ao carregar os jogos');
        console.error(error);
      }
    };

    fetchGames();
  }, []);

  if (error) {
    return <div className="text-center text-red-600 mt-10">{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-500 to-pink-500">
      {/* Header */}
      <header style={{ backgroundColor: '#34177B' }} className="text-white p-6 flex justify-between items-center shadow-md">
        <div className="text-xl font-bold">
          <img src="/logo_header.svg" alt="Logo do Site" className="h-8" />
        </div>
        <div className="text-xl font-bold">
          <Link href="/main">
              <svg
                className="w-6 h-6 text-white cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
          </Link>
        </div>
      </header>

      {/* Main content: Display games */}
      <div className="flex flex-wrap justify-center gap-6 p-8">
        {games.map((game) => (
          <div
            key={game.id}
            className="w-64 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300"
          >
            <img
              src={game.background_image || '/default-thumbnail.png'}
              alt={game.name}
              className="w-full h-40 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800">{game.name}</h2>
              <div className="mt-2">
                {/* "Saiba mais" link */}
                <a
                  href={game.website || `https://rawg.io/games/${game.slug}`} // Fallback: Página do jogo no site RAWG
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Saiba mais
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamesPage;
