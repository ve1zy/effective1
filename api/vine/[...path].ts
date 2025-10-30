import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(request: VercelRequest, response: VercelResponse) {
   // Устанавливаем CORS заголовки
   response.setHeader('Access-Control-Allow-Credentials', 'true');
   response.setHeader('Access-Control-Allow-Origin', '*');
   response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
   response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
   
   // Обработка preflight запросов
   if (request.method === 'OPTIONS') {
     return response.status(200).end();
   }
   
   // Получаем путь из URL параметров
   const path = request.query.path;
   const pathString = Array.isArray(path) ? path.join('/') : path;
   
   // Формируем полный URL для Comic Vine API
   const comicVineUrl = `https://comicvine.gamespot.com/api/${pathString}/`;
   
   console.log('Proxy request to:', comicVineUrl);
   console.log('Request query params:', request.query);
   console.log('Environment API key exists:', !!process.env.VITE_COMICVINE_API_KEY);
   
   // Получаем API ключ из environment переменной
   const apiKey = process.env.VITE_COMICVINE_API_KEY || process.env.COMICVINE_API_KEY;
   
   // В целях отладки, если переменная не найдена, возвращаем ошибку с описанием
   if (!apiKey) {
     console.error('Environment variables checked:', {
       VITE_COMICVINE_API_KEY: process.env.VITE_COMICVINE_API_KEY,
       COMICVINE_API_KEY: process.env.COMICVINE_API_KEY
     });
     return response.status(500).json({
       error: 'API key is not configured properly',
       available_envs: Object.keys(process.env).filter(key => key.includes('COMICVINE'))
     });
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
         'User-Agent': 'Mozilla/5.0 (Comic App) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
         'Accept': 'application/json, text/plain, */*',
         'Accept-Encoding': 'gzip, deflate, br',
         'Accept-Language': 'en-US,en;q=0.9',
         'Connection': 'keep-alive',
         'Referer': 'https://comicvine.gamespot.com/'
       },
       timeout: 15000, // Увеличиваем таймаут до 15 секунд
       validateStatus: (status) => status < 500 // Допускаем ошибки сервера как ответы, чтобы обработать их
     });
     
     // Проверяем, является ли ответ HTML вместо JSON
     const contentType = result.headers['content-type'];
     if (contentType && contentType.includes('text/html')) {
       console.error('Comic Vine API returned HTML instead of JSON');
       return response.status(502).json({
         error: 'Comic Vine API temporarily unavailable',
         message: 'Received HTML response instead of JSON'
       });
     }
 
     // Возвращаем результат клиенту
     response.status(200).json(result.data);
   } catch (error: any) {
     console.error('Proxy error:', error.message);
     console.error('Error details:', error);
     
     // Если это ошибка запроса (например, 404 или 403 от Comic Vine)
     if (error.response) {
       // Возвращаем статус ошибки от Comic Vine API
       return response.status(error.response.status || 500).json({
         error: 'Comic Vine API error',
         details: error.response.data || error.message,
         status: error.response.status
       });
     } else if (error.request) {
       // Ошибка сети
       return response.status(504).json({
         error: 'Network error',
         details: 'Unable to reach Comic Vine API'
       });
     } else {
       // Другие ошибки
       return response.status(500).json({
         error: 'Internal server error',
         details: error.message
       });
     }
   }
 }