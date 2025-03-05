// src/app/api/games/route.js

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get('https://api.rawg.io/api/games', {
      params: {
        key: process.env.NEXT_PUBLIC_RAWG_API_KEY, // Variável de ambiente segura
        page_size: 10,
      },
    });

    return NextResponse.json(response.data); // Retorna os jogos encontrados
  } catch (error) {
    console.error('Erro ao buscar jogos:', error);
    return NextResponse.json({ error: 'Erro ao buscar jogos' }, { status: 500 });
  }
}
