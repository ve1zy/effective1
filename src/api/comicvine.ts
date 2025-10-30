import axios, { AxiosResponse } from 'axios';

function processDescription(description: string): string {
  if (!description) return 'No description available';

 const cleanDescription = description.replace(/<[^>]*>/g, (match) => {
    if (match.includes('p>')) {
      return '. ';
    } else if (match.includes('br')) {
      return '\n';
    }
    return ' ';
  }).replace(/\s+/g, ' ').trim();
  
  return cleanDescription || 'No description available';
}

const apiKey = import.meta.env.VITE_COMICVINE_API_KEY || '';
const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

// Добавляем проверку на наличие API ключа в клиентском коде
if (!apiKey) {
  console.error('VITE_COMICVINE_API_KEY is not set in client environment');
}

export interface Comic {
  id: number;
  title: string;
  thumbnail: string;
  description?: string;
  issueNumber?: number;
  series?: {
    resourceURI: string;
    name: string;
  };
}

interface ComicVineResponse<T> {
  status_code: number;
 error: string;
 results: T;
  number_of_total_results: number;
  number_of_page_results: number;
}

export interface ComicsResponse {
  results: Comic[];
  total: number;
}

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Accept': 'application/json',
  },
  // Добавляем обработку ошибок редиректа
  maxRedirects: 0,
  validateStatus: (status) => status >= 200 && status < 300 || status === 302
});

api.interceptors.response.use(
  (response: AxiosResponse<ComicVineResponse<any>>) => {
    console.log('Full API Response:', response);
    if (response.data.status_code !== 1) {
      console.error('API Error Response:', response.data);
      throw new Error(response.data.error || 'API request failed');
    }
    return response;
  },
  error => {
    console.error('Full API Error:', error);
    const message = error.response?.data?.error || error.message || 'API request failed';
    return Promise.reject(new Error(message));
  }
);

export const getComics = async (
  offset: number = 0,
  limit: number = 10,
 additionalParams: Record<string, any> = {}
): Promise<ComicsResponse> => {
  const params: any = {
    api_key: apiKey,
    format: 'json',
    offset,
    limit,
    field_list: 'id,name,deck,image,issue_number,cover_date,description',
    ...additionalParams,
  };
  
  console.log('Making API request with params:', params);

  let endpoint = '/vine/issues/';
  const searchParams = { ...params };
  
  if (additionalParams.name || additionalParams.titleStartsWith) {
    endpoint = '/vine/search/';
    searchParams.resources = 'issue';
    if (additionalParams.titleStartsWith) {
      searchParams.query = additionalParams.titleStartsWith;
    }
    if (additionalParams.name) {
      searchParams.query = additionalParams.name;
    }
  }

  const response = await api.get<ComicVineResponse<any>>(endpoint, { params: searchParams });
  
  console.log('Raw API Response:', response.data);
  
  const resultsData = response.data.results;
  if (!resultsData) {
    console.error('No results in response:', response.data);
    return { results: [], total: 0 };
  }

  const comicsArray = Array.isArray(resultsData.results) ? resultsData.results : resultsData;
  const total = response.data.number_of_total_results || 0;
  
  console.log('Processing comics array:', comicsArray);
  
  if (!Array.isArray(comicsArray)) {
    console.error('Comics data is not an array:', comicsArray);
    return { results: [], total: 0 };
  }
  
  const processedResults = comicsArray.map((comic: any) => {
    console.log('Processing individual comic:', comic);
    
    return {
      id: comic.id || 0,
      title: (comic.name || comic.title || comic.issue_name || 'Unknown Title').toString().trim(),
      thumbnail: (comic.image && (comic.image.original_url || comic.image.thumb_url)) || '',
      description: processDescription(comic.deck || comic.description || 'No description available'),
      issueNumber: comic.issue_number ? parseInt(comic.issue_number) : undefined,
      series: {
        resourceURI: comic.series?.resource_uri || comic.series?.api_detail_url || '',
        name: (comic.series?.name || comic.cover_date || comic.publication_date || 'Unknown Series').toString().trim()
      },
    };
  });
  
  console.log('Processed results:', processedResults);
  
  return {
    results: processedResults,
    total,
  };
};

export const getComicById = async (id: number): Promise<Comic> => {
  const params = {
    api_key: apiKey,
    format: 'json',
    field_list: 'id,name,deck,image,issue_number,cover_date,description,series',
  };

  console.log('Making single comic API request for ID:', id, 'with params:', params);
  
  const response = await api.get<ComicVineResponse<any>>(`/vine/issue/4000-${id}/`, { params });

  console.log('Single comic raw response:', response.data);

  if (!response.data.results) {
    throw new Error('Comic not found');
  }

  const comic = response.data.results;
  console.log('Processing single comic:', comic);
  
  return {
    id: comic.id || id,
    title: (comic.name || comic.title || comic.issue_name || 'Unknown Title').toString().trim(),
    thumbnail: (comic.image && (comic.image.original_url || comic.image.thumb_url)) || '',
    description: processDescription(comic.deck || comic.description || 'No description available'),
    issueNumber: comic.issue_number ? parseInt(comic.issue_number) : undefined,
    series: {
      resourceURI: comic.series?.resource_uri || comic.series?.api_detail_url || '',
      name: (comic.series?.name || comic.cover_date || comic.publication_date || 'Unknown Series').toString().trim()
    },
  };
};