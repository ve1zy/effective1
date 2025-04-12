import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { toast } from 'react-toastify';
import { getComics, getComicById } from '../api/marvel';
import { Comic } from '../api/marvel';

class ComicsStore {
  comics: Comic[] = [];
  currentComic: Comic | null = null;
  relatedComics: Comic[] = [];
  favorites: Comic[] = [];
  offset = 0;
  total = 0;
  limit = 8;
  loading = false;
  error: string | null = null;
  currentPage = 1;
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
          localStorage.setItem('marvel_favorites', data);
          console.log('Saved favorites:', data);
        } catch (error) {
          console.error('Save error:', error);
        }
      }
    );
  }
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
  
      if (comic.series) {
        const seriesId = comic.series.resourceURI.split('/').pop();
        const seriesResponse = await getComics(0, 20, {
          series: seriesId,
          orderBy: '-modified',
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
  
      const baseTitle = comic.title.replace(/#\d+.*/, '').trim();
      if (baseTitle) {
        const titleResponse = await getComics(0, 20, {
          titleStartsWith: baseTitle,
          orderBy: '-modified',
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
  
      const randomResponse = await getComics(Math.floor(Math.random() * 100), 4, {
        orderBy: '-modified',
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
      const data = localStorage.getItem('marvel_favorites');
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
      toast.info('Removed from favorites');
    } else {
      this.favorites.push({ ...comic });
      toast.success('Added to favorites');
    }
  };

  isFavorite = (id: number) => {
    return this.favorites.some(c => c.id === id);
  };
}

export const comicsStore = new ComicsStore();