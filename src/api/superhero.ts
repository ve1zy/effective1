import axios, { AxiosResponse } from 'axios';

const accessToken = '4140ddbdf3378de017c4cedbc8082221';
const baseUrl = `/api/superhero/api/${accessToken}`;

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
      response = await api.get<SuperheroApiResponse>(`/search/${name}`);
    } else {
      // For pagination, we'll need to implement a different approach
      // since Superhero API doesn't support offset/limit in the same way
      // For now, we'll return a default list or handle this differently
      response = await api.get<SuperheroApiResponse>('/search/a'); // Search for 'a' as default
    }
    
    if (response.data.response === 'success') {
      // Filter results if a name was provided
      let results = response.data.results;
      console.log('Superheroes API response:', results);
      if (name) {
        results = results.filter(hero =>
          hero.name.toLowerCase().includes(name.toLowerCase())
        );
      }
      
      return {
        results: results.slice(offset, offset + limit),
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
    const response = await api.get<Superhero>(`/${id}`);
    
    console.log('Superhero API response:', response.data);
    
    if (response.data) {
      return response.data;
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
    const response = await api.get<Image>(`/${id}/image`);
    
    if (response.data) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching superhero image:', error);
    return null;
  }
};