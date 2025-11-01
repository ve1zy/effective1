import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { toast } from 'react-toastify';
import { getSuperheroes, getSuperheroById, Superhero } from '../api/superhero';
import i18next from 'i18next';

class ComicsStore {
  comics: Superhero[] = [];
  searchQuery: string | null = null;
  currentComic: Superhero | null = null;
  relatedComics: Superhero[] = [];
  favorites: Superhero[] = [];
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
            name: c.name,
            thumbnail: (
              (c.image && typeof c.image === 'object' && 'url' in c.image && c.image.url)
              || (c as any)['image']
              || '/placeholder-comic.jpg'
            )
          })));
          localStorage.setItem('superhero_favorites', data);
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
  
      const response = await getSuperheroes(0, this.limit, query);
  
      runInAction(() => {
        this.comics = response.results;
        this.total = response.total;
        this.offset = 0;
        this.hasMore = this.comics.length < response.total;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err instanceof Error ? err.message : 'Failed to search superheroes';
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

      // For Superhero API, we'll just fetch more superheroes without specific parameters
      // since the API doesn't support offset/limit in the same way
      const response = await getSuperheroes(this.comics.length, this.limit, this.searchQuery || '');

      runInAction(() => {
        this.comics = [...this.comics, ...response.results];
        this.hasMore = this.comics.length < response.total;
        this.isLoadingMore = false;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err instanceof Error ? err.message : 'Failed to load more superheroes';
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
        localStorage.setItem('superhero_favorites', JSON.stringify(favorites));
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

      const response = await getSuperheroes(offset, this.limit, '');
      
      runInAction(() => {
        this.comics = response.results;
        this.total = response.total;
        this.offset = offset;
        this.currentPage = page;
      });
    } catch (err) {
    }
  };
  loadComicDetails = async (id: string) => {
    try {
      runInAction(() => {
        this.loading = true;
        this.error = null;
        this.relatedComics = [];
      });

      const superhero = await getSuperheroById(id);
      
      runInAction(() => {
        this.currentComic = superhero;
      });

      if (superhero) {
        await this.loadRelatedComics(superhero);
      }
    } catch (err) {
      runInAction(() => {
        this.error = err instanceof Error ? err.message : 'Failed to load superhero details';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  loadRelatedComics = async (superhero: Superhero) => {
    try {
      runInAction(() => {
        this.loading = true;
        this.relatedComics = [];
      });

      // For superhero API, we'll just search for similar superheroes based on name
      // Since the API doesn't have series or other relations like Marvel API
      const firstNamePart = superhero.name.split(' ')[0];
      if (firstNamePart && firstNamePart.length > 2) {
        const relatedResponse = await getSuperheroes(0, 20, firstNamePart);
        
        const relatedSuperheroes = relatedResponse.results.filter(c => c.id !== superhero.id);
        
        if (relatedSuperheroes.length > 0) {
          runInAction(() => {
            this.relatedComics = relatedSuperheroes.slice(0, 4);
          });
          return;
        }
      }

      // If no related superheroes found by name, get random superheroes
      const randomResponse = await getSuperheroes(Math.floor(Math.random() * 100), 4, '');
      
      runInAction(() => {
        this.relatedComics = randomResponse.results
          .filter(c => c.id !== superhero.id)
          .slice(0, 4);
      });

    } catch (err) {
      console.error('Failed to load related superheroes:', err);
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
      const data = localStorage.getItem('superhero_favorites');
      if (data) {
        this.favorites = JSON.parse(data);
        console.log('Loaded favorites:', this.favorites);
      }
    } catch (error) {
      console.error('Load error:', error);
    }
  };

  toggleFavorite = (superhero: Superhero) => {
    const exists = this.favorites.some(c => c.id === superhero.id);
    if (exists) {
      this.favorites = this.favorites.filter(c => c.id !== superhero.id);
      toast.info(i18next.t('removeFavorite'));
    } else {
      this.favorites.push({ ...superhero });
      toast.success(i18next.t('addFavorite'));
    }
  };

  isFavorite = (id: string) => {
    return this.favorites.some(c => c.id === id);
  };
}

export const comicsStore = new ComicsStore();