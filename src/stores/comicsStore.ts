import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { toast } from 'react-toastify';
import { getComics, getComicById } from '../api/comicvine';
import { Comic } from '../api/comicvine';
import i18next from 'i18next';
class ComicsStore {
  comics: Comic[] = [];
  searchQuery: string | null = null;
  currentComic: Comic | null = null;
  relatedComics: Comic[] = [];
  favorites: Comic[] = [];
  offset = 0;
  total = 0;
  limit = 8;
  loading = false;
  error: string | null = null;
  currentPage = 1;
  hasMore = true;
  isLoadingMore = false;
  constructor() {
    makeAutoObservable(this);
    this.initStore();
     this.loadFavorites();
    
    reaction(
      () => this.favorites.slice(),
      (favorites) => {
        try {
          const data = JSON.stringify(favorites.map(c => ({
            id: c.id,
            title: c.title,
            thumbnail: c.thumbnail
          })));
          localStorage.setItem('comicvine_favorites', data);
          console.log('Saved favorites:', data);
        } catch (error) {
          console.error('Save error:', error);
        }
      }
    );
  }
  searchComics = async (query: string) => {
    try {
      runInAction(() => {
        this.loading = true;
        this.error = null;
        this.searchQuery = query;
        this.comics = [];
        this.offset = 0;
        this.hasMore = true;
      });
  
      const response = await getComics(0, this.limit, {
        titleStartsWith: query,
      });
  
      runInAction(() => {
        this.comics = response.results;
        this.total = response.total;
        this.offset = 0;
        this.hasMore = this.comics.length < response.total;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err instanceof Error ? err.message : 'Failed to search comics';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };
  loadMoreComics = async () => {
    if (this.isLoadingMore || !this.hasMore) return;
  
    try {
      runInAction(() => {
        this.isLoadingMore = true;
      });
  
      const additionalParams: Record<string, any> = {};
      if (this.searchQuery) {
        additionalParams.titleStartsWith = this.searchQuery;
      }
  
      const response = await getComics(this.comics.length, this.limit, additionalParams);
  
      runInAction(() => {
        this.comics = [...this.comics, ...response.results];
        this.hasMore = this.comics.length < response.total;
        this.isLoadingMore = false;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err instanceof Error ? err.message : 'Failed to load more comics';
        this.isLoadingMore = false;
      });
    }
  };

  resetComics = () => {
    this.comics = [];
    this.searchQuery = null;
    this.hasMore = true;
    this.isLoadingMore = false;
  };
  setCurrentPage = (page: number) => {
    this.currentPage = page;
  };
  private initStore() {
    this.setupReactions();
    this.loadFavorites();
  }

  private setupReactions() {
    reaction(
      () => this.favorites,
      (favorites) => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
      }
    );

    reaction(
      () => this.error,
      (error) => error && toast.error(error)
    );
  }
  
  loadComics = async (page: number = this.currentPage) => {
    const offset = (page - 1) * this.limit; 
    try {
      runInAction(() => {
        this.loading = true;
        this.error = null;
      });
  
      const response = await getComics(offset, this.limit);
      
      runInAction(() => {
        this.comics = response.results;
        this.total = response.total;
        this.offset = offset;
        this.currentPage = page;
      });
    } catch (err) {
    }
  };
  loadComicDetails = async (id: number) => {
    try {
      runInAction(() => {
        this.loading = true;
        this.error = null;
        this.relatedComics = [];
      });
  
      const comic = await getComicById(id);
      
      runInAction(() => {
        this.currentComic = comic;
      });
  
      await this.loadRelatedComics(comic);
    } catch (err) {
      runInAction(() => {
        this.error = err instanceof Error ? err.message : 'Failed to load comic details';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  loadRelatedComics = async (comic: Comic) => {
    try {
      runInAction(() => {
        this.loading = true;
        this.relatedComics = [];
      });

      // Попробуем найти комиксы из той же серии
      if (comic.series && comic.series.resourceURI) {
        // Извлекаем ID серии из resourceURI, предполагая формат: .../4050-{id}/
        const match = comic.series.resourceURI.match(/\/(\d+)-(\d+)\//);
        if (match) {
          const seriesId = match[2]; // Берем второй захватываемый элемент (ID серии)
          const seriesResponse = await getComics(0, 20, {
            filter: `series:${seriesId}`,
            field_list: 'id,name,deck,image,issue_number,cover_date,description',
            limit: 8
          });
          
          const seriesComics = seriesResponse.results.filter(c => c.id !== comic.id);
          
          if (seriesComics.length > 0) {
            runInAction(() => {
              this.relatedComics = seriesComics.slice(0, 4);
            });
            return;
          }
        }
      }
      
      // Если не удалось найти по серии, ищем по названию
      const baseTitle = comic.title.replace(/#\d+.*/, '').trim();
      if (baseTitle) {
        const titleResponse = await getComics(0, 20, {
          titleStartsWith: baseTitle,
          field_list: 'id,name,deck,image,issue_number,cover_date,description',
          limit: 10
        });
        
        const titleComics = titleResponse.results.filter(c => c.id !== comic.id);
        
        if (titleComics.length > 0) {
          runInAction(() => {
            this.relatedComics = titleComics.slice(0, 4);
          });
          return;
        }
      }
      
      // Если не удалось найти по названию, получаем случайные комиксы
      const randomResponse = await getComics(Math.floor(Math.random() * 100), 4, {
        field_list: 'id,name,deck,image,issue_number,cover_date,description',
        limit: 4
      });
      
      runInAction(() => {
        this.relatedComics = randomResponse.results
          .filter(c => c.id !== comic.id)
          .slice(0, 4);
      });

    } catch (err) {
      console.error('Failed to load related comics:', err);
      runInAction(() => {
        this.relatedComics = [];
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };
  

  loadFavorites = () => {
    try {
      const data = localStorage.getItem('comicvine_favorites');
      if (data) {
        this.favorites = JSON.parse(data);
        console.log('Loaded favorites:', this.favorites);
      }
    } catch (error) {
      console.error('Load error:', error);
    }
  };

  toggleFavorite = (comic: Comic) => {
    const exists = this.favorites.some(c => c.id === comic.id);
    if (exists) {
      this.favorites = this.favorites.filter(c => c.id !== comic.id);
      toast.info(i18next.t('removeFavorite'));
    } else {
      this.favorites.push({ ...comic });
      toast.success(i18next.t('addFavorite'));
    }
  };

  isFavorite = (id: number) => {
    return this.favorites.some(c => c.id === id);
  };
}

export const comicsStore = new ComicsStore();