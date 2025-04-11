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
  
  loadComics = async (offset: number) => {
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
      });
    } catch (err) {
      runInAction(() => {
        this.error = err instanceof Error ? err.message : 'Failed to load comics';
      });
      throw err;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
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

       await this.loadRelatedComics(comic.title);
    } catch (err) {
      runInAction(() => {
        this.error = err instanceof Error ? err.message : 'Failed to load comic details';
      });
      throw err;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  loadRelatedComics = async (title: string) => {
    try {
      runInAction(() => {
        this.loading = true;
        this.relatedComics = [];
      });
  
      const baseTitle = title.replace(/#\d+.*/, '').trim();
      
      const response = await getComics(0, 20, {
        titleStartsWith: baseTitle,
        orderBy: '-onsaleDate', 
        limit: 20
      });
  
      runInAction(() => {
         this.relatedComics = response.results
          .filter(c => c.id !== this.currentComic?.id)
          .slice(0, 4);
        
        if (this.relatedComics.length === 0) {
          this.loadAlternativeComics();
        }
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
  private loadAlternativeComics = async () => {
    try {
      const response = await getComics(0, 4, {
        orderBy: '-onsaleDate',
        limit: 4
      });
      
      runInAction(() => {
        this.relatedComics = response.results
          .filter(c => c.id !== this.currentComic?.id)
          .slice(0, 4);
      });
    } catch (err) {
      console.error('Failed to load alternative comics:', err);
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