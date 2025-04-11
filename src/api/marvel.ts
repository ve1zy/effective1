import axios, { AxiosResponse } from 'axios';
import md5 from 'md5';

const publicKey = import.meta.env.VITE_MARVEL_PUBLIC_KEY;
const privateKey = import.meta.env.VITE_MARVEL_PRIVATE_KEY;
const baseUrl = 'https://gateway.marvel.com/v1/public';

  export interface Comic {
    id: number;
    title: string;
    thumbnail: string;
    description?: string; // Делаем необязательным
    issueNumber?: number;
    series?: {
      resourceURI: string;
      name: string;
    };
  }
interface MarvelResponseData<T> {
  offset: number;
  limit: number;
  total: number;
  count: number;
  results: T[];
}

interface MarvelApiResponse<T> {
  code: number;
  status: string;
  data: MarvelResponseData<T>;
}

interface ComicApiResponse {
  id: number;
  title: string;
  description: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  issueNumber: number;
  series: {
    resourceURI: string;
    name: string;
  };
}

export interface ComicsResponse {
  results: Comic[];
  total: number;
}

const getAuthParams = () => {
  const ts = Date.now();
  const hash = md5(ts + privateKey + publicKey);
  return { ts, apikey: publicKey, hash };
};

const api = axios.create({
  baseURL: baseUrl,
});

// Интерцептор для преобразования ответа
api.interceptors.response.use(
  (response: AxiosResponse<MarvelApiResponse<ComicApiResponse>>) => {
    // Возвращаем стандартный AxiosResponse, но с преобразованными данными
    return {
      ...response,
      data: response.data.data
    };
  },
  error => {
    const message = error.response?.data?.message || 'API request failed';
    return Promise.reject(new Error(message));
  }
);

export const getComics = async (
  offset: number = 0,
  limit: number = 20,
  additionalParams: Record<string, any> = {}
): Promise<ComicsResponse> => {
  const params = {
    ...getAuthParams(),
    offset,
    limit,
    orderBy: 'title',
    ...additionalParams,
  };
  
  const response = await api.get<MarvelResponseData<ComicApiResponse>>('/comics', { params });
  
  return {
    results: response.data.results.map(comic => ({
      id: comic.id,
      title: comic.title,
      thumbnail: `${comic.thumbnail.path}.${comic.thumbnail.extension}`,
      description: comic.description || 'No description available',
      issueNumber: comic.issueNumber,
      series: comic.series,
    })),
    total: response.data.total,
  };
};
export const getComicById = async (id: number): Promise<Comic> => {
  const response = await api.get<MarvelResponseData<ComicApiResponse>>(`/comics/${id}`, { 
    params: getAuthParams() 
  });

  if (response.data.results.length === 0) {
    throw new Error('Comic not found');
  }

  const comic = response.data.results[0];
  return {
    id: comic.id,
    title: comic.title,
    thumbnail: `${comic.thumbnail.path}.${comic.thumbnail.extension}`,
    description: comic.description || 'No description available',
    issueNumber: comic.issueNumber,
    series: comic.series,
  };
};