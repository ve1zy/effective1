import axios from 'axios';

const FALLBACK_DESCRIPTION = 'No description available';

function sanitizeDescription(description?: string | null): string {
  if (!description) {
    return FALLBACK_DESCRIPTION;
  }

  return description.replace(/\s+/g, ' ').trim() || FALLBACK_DESCRIPTION;
}

const baseUrl = import.meta.env.VITE_JIKAN_API_BASE_URL || 'https://api.jikan.moe/v4';

const parsePositiveNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};

const RATE_LIMIT_DELAY_MS = parsePositiveNumber(import.meta.env.VITE_JIKAN_RATE_LIMIT_MS, 650);
const RETRY_DELAY_MS = parsePositiveNumber(import.meta.env.VITE_JIKAN_RETRY_DELAY_MS, 1200);
const MAX_RETRY_ATTEMPTS = parsePositiveNumber(import.meta.env.VITE_JIKAN_RETRY_ATTEMPTS, 2);

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let requestQueue: Promise<unknown> = Promise.resolve();
let lastRequestTime = 0;

const enqueueRateLimited = <T>(fn: () => Promise<T>): Promise<T> => {
  const runWithRateLimit = async () => {
    const now = Date.now();
    const waitTime = Math.max(0, RATE_LIMIT_DELAY_MS - (now - lastRequestTime));

    if (waitTime > 0) {
      await delay(waitTime);
    }

    const result = await fn();
    lastRequestTime = Date.now();
    return result;
  };

  const resultPromise = requestQueue.then(runWithRateLimit);
  requestQueue = resultPromise.then(
    () => undefined,
    () => undefined
  );

  return resultPromise;
};

const requestWithRetry = async <T>(fn: () => Promise<T>, attemptsLeft: number = MAX_RETRY_ATTEMPTS): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    const is429 = axios.isAxiosError(error) && error.response?.status === 429;

    if (is429 && attemptsLeft > 0) {
      await delay(RETRY_DELAY_MS);
      return requestWithRetry(fn, attemptsLeft - 1);
    }

    throw error;
  }
};

const performRequest = <T>(fn: () => Promise<T>): Promise<T> => {
  return enqueueRateLimited(() => requestWithRetry(fn));
};

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

export interface ComicsResponse {
  results: Comic[];
  total: number;
  hasNextPage: boolean;
}

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Accept': 'application/json, text/plain, */*',
  },
  // Отключаем автоматические редиректы
  maxRedirects: 0,
  validateStatus: (status) => status >= 200 && status < 300,
  timeout: 15000
});

interface JikanPagination {
  last_visible_page?: number;
  has_next_page?: boolean;
  current_page?: number;
  items?: {
    count?: number;
    total?: number;
    per_page?: number;
  };
}

interface JikanImageSet {
  image_url?: string;
  small_image_url?: string;
  large_image_url?: string;
}

interface JikanManga {
  mal_id: number;
  title?: string;
  title_english?: string;
  title_japanese?: string;
  synopsis?: string | null;
  images?: {
    jpg?: JikanImageSet;
    webp?: JikanImageSet;
  };
  chapters?: number | null;
  url?: string;
  type?: string | null;
  authors?: Array<{ name?: string | null }>;
  genres?: Array<{ name?: string | null }>;
}

interface JikanListResponse<T> {
  data: T[];
  pagination?: JikanPagination;
}

interface JikanItemResponse<T> {
  data: T;
}

interface JikanRecommendation {
  entry: JikanManga;
}

const pickImageUrl = (images?: { jpg?: JikanImageSet; webp?: JikanImageSet }): string => {
  const jpg = images?.jpg;
  const webp = images?.webp;
  return (
    jpg?.image_url ||
    webp?.image_url ||
    jpg?.large_image_url ||
    webp?.large_image_url ||
    jpg?.small_image_url ||
    webp?.small_image_url ||
    ''
  );
};

const transformMangaToComic = (manga: JikanManga): Comic => {
  const fallbackTitle = manga.title_english || manga.title_japanese || 'Unknown Title';
  const seriesName = manga.genres?.[0]?.name || manga.type || 'Unknown Series';
  const issueNumber = typeof manga.chapters === 'number' ? manga.chapters : undefined;

  return {
    id: manga.mal_id,
    title: (manga.title || fallbackTitle || '').toString().trim() || 'Unknown Title',
    thumbnail: pickImageUrl(manga.images),
    description: sanitizeDescription(manga.synopsis),
    issueNumber,
    series: {
      resourceURI: manga.url || '',
      name: seriesName || 'Unknown Series',
    },
  };
};

const estimateTotal = (pagination: JikanPagination | undefined, currentLength: number, limit: number): number => {
  if (!pagination) {
    return currentLength;
  }

  if (pagination.items?.total) {
    return pagination.items.total;
  }

  if (pagination.last_visible_page && pagination.current_page) {
    return pagination.last_visible_page * limit;
  }

  if (pagination.has_next_page) {
    return currentLength + limit;
  }

  return currentLength;
};

export const getComics = async (
  offset: number = 0,
  limit: number = 10,
  additionalParams: Record<string, any> = {}
): Promise<ComicsResponse> => {
  const page = Math.floor(offset / limit) + 1;

  const params: Record<string, any> = {
    limit,
    page,
    sfw: true,
  };

  let endpoint = '/top/manga';

  if (additionalParams.titleStartsWith || additionalParams.name) {
    endpoint = '/manga';
    const query = additionalParams.titleStartsWith || additionalParams.name;
    params.q = query;
    params.order_by = 'score';
    params.sort = 'desc';
  }

  const response = await performRequest(() => api.get<JikanListResponse<JikanManga>>(endpoint, { params }));

  const mangaList = Array.isArray(response.data.data) ? response.data.data : [];
  const comics = mangaList.map(transformMangaToComic);
  const total = estimateTotal(response.data.pagination, comics.length + (page - 1) * limit, limit);
  const hasNextPage = Boolean(response.data.pagination?.has_next_page);

  return {
    results: comics,
    total,
    hasNextPage,
  };
};

export const getComicById = async (id: number): Promise<Comic> => {
  const endpoint = `/manga/${id}/full`;

  try {
    const response = await performRequest(() => api.get<JikanItemResponse<JikanManga>>(endpoint));
    return transformMangaToComic(response.data.data);
  } catch (error) {
    const fallbackEndpoint = `/manga/${id}`;
    const response = await performRequest(() => api.get<JikanItemResponse<JikanManga>>(fallbackEndpoint));
    return transformMangaToComic(response.data.data);
  }
};

export const getRelatedComics = async (id: number, limit: number = 8): Promise<Comic[]> => {
  try {
    const response = await performRequest(() => api.get<JikanListResponse<JikanRecommendation>>(`/manga/${id}/recommendations`));
    const recommendations = response.data.data
      .map((item) => transformMangaToComic(item.entry))
      .filter((comic) => comic.id !== id);

    if (recommendations.length > 0) {
      return recommendations.slice(0, limit);
    }
  } catch (error) {
    console.error('Failed to fetch recommendations:', error);
  }

  // Fallback to top manga list if recommendations are unavailable
  try {
    const response = await getComics(0, limit);
    return response.results.filter((comic) => comic.id !== id).slice(0, limit);
  } catch (error) {
    console.error('Failed to fetch fallback comics:', error);
    return [];
  }
};
