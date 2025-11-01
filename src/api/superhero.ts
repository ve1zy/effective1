import axios, { AxiosResponse } from 'axios';

const accessToken = '4140ddbdf3378de017c4cedbc8082221';

// Определяем URL в зависимости от среды
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Клиентская сторона
    if (process.env.NODE_ENV === 'development') {
      // В разработке используем прокси, токен будет добавлен в Vite конфиге
      return `/api/superhero/${accessToken}`;
    } else {
      // На продакшене используем прямой URL, который будет переписан на Vercel
      return `/api/superhero`;
    }
  } else {
    // Серверная сторона (SSR) - использовать прямой URL
    return `https://superheroapi.com/api/${accessToken}`;
  }
};

const baseUrl = getBaseUrl();

export interface Powerstats {
  intelligence: string;
  strength: string;
  speed: string;
  durability: string;
  power: string;
 combat: string;
}

export interface Biography {
  'full-name': string;
  'alter-egos': string;
  aliases: string[];
  'place-of-birth': string;
  'first-appearance': string;
  publisher: string;
  alignment: string;
}

export interface Appearance {
  gender: string;
  race: string;
  height: string[];
  weight: string[];
  'eye-color': string;
  'hair-color': string;
}

export interface Work {
  occupation: string;
  base: string;
}

export interface Connections {
  'group-affiliation': string;
  relatives: string;
}

export interface Image {
  url: string;
}

export interface Superhero {
  id: string;
  name: string;
  powerstats: Powerstats;
  biography: Biography;
  appearance: Appearance;
  work: Work;
  connections: Connections;
  image: Image;
  // Добавим также альтернативное поле на случай если API возвращает изображение в другом формате
  [key: string]: any;
}

export interface SuperheroSearchResult {
  response: string;
  id: string;
  name: string;
  url: string;
}

export interface SuperheroApiResponse {
  response: string;
  results: Superhero[];
  'results-for': string;
}

const api = axios.create({
  baseURL: baseUrl,
});

api.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    return response;
  },
  error => {
    const message = error.response?.data?.message || 'API request failed';
    return Promise.reject(new Error(message));
  }
);

export const getSuperheroes = async (
  offset: number = 0,
  limit: number = 10,
  name: string = ''
): Promise<{ results: Superhero[]; total: number }> => {
  try {
    let response;
    
    if (name) {
      // Search by name
      response = await api.get(`/search/${name}`);
    } else {
      // For pagination, we'll need to implement a different approach
      // since Superhero API doesn't support offset/limit in the same way
      // For now, we'll return a default list or handle this differently
      response = await api.get('/search/a'); // Search for 'a' as default
    }
    
    if (response.data && response.data.response === 'success') {
      // Filter results if a name was provided
      let results: any[] = response.data.results;
      console.log('Superheroes API response:', results);
      
      // Обработка изображений для всех супергероев
      const processedResults = results.map((hero: any) => {
        let processedHero = { ...hero };
        
        // Проверяем структуру изображения и при необходимости корректируем
        if (hero.image) {
          if (typeof hero.image === 'string') {
            // Если image - строка, оборачиваем в объект
            processedHero.image = { url: hero.image };
          } else if (typeof hero.image === 'object' && !hero.image.url) {
            // Если image - объект, но нет поля url, ищем возможные альтернативные поля
            if (hero.image['url']) {
              processedHero.image = { url: hero.image['url'] };
            } else {
              // Проверяем другие возможные поля для изображения
              const imageUrl = hero.image['xs'] || hero.image['sm'] || hero.image['md'] ||
                             hero.image['lg'] || hero.image['main'] || '/placeholder-comic.jpg';
              processedHero.image = { url: imageUrl };
            }
          }
        } else {
          // Если изображение отсутствует, устанавливаем заглушку
          processedHero.image = { url: '/placeholder-comic.jpg' };
        }
        
        return processedHero as Superhero;
      });
      
      if (name) {
        results = processedResults.filter((hero: any) =>
          hero.name.toLowerCase().includes(name.toLowerCase())
        );
      } else {
        results = processedResults;
      }
      
      return {
        results: results.slice(offset, offset + limit) as Superhero[],
        total: results.length,
      };
    } else {
      return { results: [], total: 0 };
    }
  } catch (error) {
    console.error('Error fetching superheroes:', error);
    return { results: [], total: 0 };
  }
};

export const getSuperheroById = async (id: string): Promise<Superhero | null> => {
  try {
    const response = await api.get(`/${id}`);
    
    console.log('Superhero API response:', response.data);
    
    if (response.data) {
      // Обработка возможных вариантов структуры изображения
      const superheroData = response.data;
      let processedData = { ...superheroData };
      
      // Проверяем структуру изображения и при необходимости корректируем
      if (superheroData.image) {
        if (typeof superheroData.image === 'string') {
          // Если image - строка, оборачиваем в объект
          processedData.image = { url: superheroData.image };
        } else if (typeof superheroData.image === 'object' && !superheroData.image.url) {
          // Если image - объект, но нет поля url, ищем возможные альтернативные поля
          if (superheroData.image['url']) {
            processedData.image = { url: superheroData.image['url'] };
          } else {
            // Проверяем другие возможные поля для изображения
            const imageUrl = superheroData.image['xs'] || superheroData.image['sm'] || superheroData.image['md'] ||
                           superheroData.image['lg'] || superheroData.image['main'] || '/placeholder-comic.jpg';
            processedData.image = { url: imageUrl };
          }
        }
      } else {
        // Если изображение отсутствует, устанавливаем заглушку
        processedData.image = { url: '/placeholder-comic.jpg' };
      }
      
      return processedData as Superhero;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching superhero by ID:', error);
    return null;
  }
};

export const getSuperheroPowerstats = async (id: string): Promise<Powerstats | null> => {
  try {
    const response = await api.get<Powerstats>(`/${id}/powerstats`);
    
    if (response.data) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching superhero powerstats:', error);
    return null;
  }
};

export const getSuperheroBiography = async (id: string): Promise<Biography | null> => {
  try {
    const response = await api.get<Biography>(`/${id}/biography`);
    
    if (response.data) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching superhero biography:', error);
    return null;
  }
};

export const getSuperheroAppearance = async (id: string): Promise<Appearance | null> => {
  try {
    const response = await api.get<Appearance>(`/${id}/appearance`);
    
    if (response.data) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching superhero appearance:', error);
    return null;
  }
};

export const getSuperheroWork = async (id: string): Promise<Work | null> => {
  try {
    const response = await api.get<Work>(`/${id}/work`);
    
    if (response.data) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching superhero work:', error);
    return null;
  }
};

export const getSuperheroConnections = async (id: string): Promise<Connections | null> => {
  try {
    const response = await api.get<Connections>(`/${id}/connections`);
    
    if (response.data) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching superhero connections:', error);
    return null;
  }
};

export const getSuperheroImage = async (id: string): Promise<Image | null> => {
  try {
    const response = await api.get(`/${id}/image`);
    
    if (response.data) {
      // Обработка возможных вариантов структуры изображения
      if (typeof response.data === 'string') {
        // Если ответ - строка, оборачиваем в объект
        return { url: response.data } as Image;
      } else if (typeof response.data === 'object' && response.data.url) {
        // Если объект уже имеет url, возвращаем как есть
        return response.data as Image;
      } else if (typeof response.data === 'object') {
        // Если объект, но нет поля url, ищем возможные альтернативные поля
        const imageUrl = response.data['url'] || response.data['xs'] || response.data['sm'] || response.data['md'] ||
                       response.data['lg'] || response.data['main'] || '/placeholder-comic.jpg';
        return { url: imageUrl } as Image;
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching superhero image:', error);
    return null;
  }
};