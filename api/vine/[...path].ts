import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  // Получаем путь из URL параметров
  const path = request.query.path;
  const pathString = Array.isArray(path) ? path.join('/') : path;
  
  // Формируем полный URL для Comic Vine API
 const comicVineUrl = `https://comicvine.gamespot.com/api/${pathString}`;
  
  // Получаем API ключ из environment переменной
  const apiKey = process.env.COMICVINE_API_KEY || process.env.VITE_COMICVINE_API_KEY;
  
  if (!apiKey) {
    return response.status(500).json({ error: 'API key is not configured' });
  }
  
  try {
    // Перенаправляем запрос к Comic Vine API
    const result = await axios.get(comicVineUrl, {
      params: {
        ...request.query,
        api_key: apiKey,
        format: 'json'
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Comic App) Chrome/120.0.0.0',
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive'
      }
    });
    
    // Возвращаем результат клиенту
    response.status(200).json(result.data);
  } catch (error: any) {
    console.error('Proxy error:', error.message);
    response.status(500).json({ error: 'Failed to fetch data from Comic Vine API' });
  }
}