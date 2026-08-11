import React, { useState, useEffect } from 'react';
import { Search, Heart, Film, ArrowUpDown, RefreshCw, StarOff } from 'lucide-react';
import MovieCard from './components/MovieCard';
import MovieDetailModal from './components/MovieDetailModal';

const API_KEY = '9e2e7655';

function App() {
  const [query, setQuery] = useState('Marvel');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImdbId, setSelectedImdbId] = useState(null);
  
  // Filters & Sorting
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('none');
  const [viewWatchlistOnly, setViewWatchlistOnly] = useState(false);

  // Watchlist (favorites) loaded from LocalStorage
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('cine_watchlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist Watchlist
  useEffect(() => {
    localStorage.setItem('cine_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Fetch initial movies
  useEffect(() => {
    handleSearch('Marvel');
  }, []);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError('');
    setViewWatchlistOnly(false); // Reset to search view

    try {
      const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (data.Response === 'True') {
        setMovies(data.Search || []);
      } else {
        setMovies([]);
        setError(data.Error || 'No movies found.');
      }
    } catch (err) {
      setError('Network communication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };

  const toggleFavorite = (movie) => {
    const isAlreadyFavorited = watchlist.some((item) => item.imdbID === movie.imdbID);
    if (isAlreadyFavorited) {
      setWatchlist(watchlist.filter((item) => item.imdbID !== movie.imdbID));
    } else {
      setWatchlist([...watchlist, movie]);
    }
  };

  // Determine current active list (Search results or Watchlist)
  const displaySourceList = viewWatchlistOnly ? watchlist : movies;

  // Filter list
  const filteredMovies = displaySourceList.filter((movie) => {
    if (typeFilter === 'all') return true;
    return movie.Type === typeFilter;
  });

  // Sort list
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    if (sortBy === 'year-desc') return parseInt(b.Year) - parseInt(a.Year);
    if (sortBy === 'year-asc') return parseInt(a.Year) - parseInt(b.Year);
    if (sortBy === 'title-asc') return a.Title.localeCompare(b.Title);
    if (sortBy === 'title-desc') return b.Title.localeCompare(a.Title);
    return 0; // none
  });

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="logo-container" onClick={() => { setQuery('Marvel'); handleSearch('Marvel'); }}>
          <Film className="logo-icon" />
          <h1>CineSeek</h1>
        </div>

        <form onSubmit={handleSearchSubmit} className="search-bar">
          <input 
            type="text" 
            placeholder="Search movies, series..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" aria-label="Search">
            <Search className="w-5 h-5" />
          </button>
        </form>

        <button 
          onClick={() => setViewWatchlistOnly(!viewWatchlistOnly)}
          className={`watchlist-toggle-btn ${viewWatchlistOnly ? 'active' : ''}`}
        >
          <Heart className="w-5 h-5" fill={viewWatchlistOnly ? "currentColor" : "none"} />
          <span>My Watchlist ({watchlist.length})</span>
        </button>
      </header>

      {/* Control panel */}
      <main className="main-content">
        <div className="controls-panel">
          <h2>{viewWatchlistOnly ? 'Saved Watchlist' : `Search Results for "${query}"`}</h2>
          
          <div className="filters-group">
            {/* Filter by Type */}
            <div className="control-item">
              <label htmlFor="filterType">Type</label>
              <select 
                id="filterType" 
                value={typeFilter} 
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Media</option>
                <option value="movie">Movies</option>
                <option value="series">TV Shows</option>
                <option value="episode">Episodes</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="control-item">
              <label htmlFor="sortOrder">Sort</label>
              <div className="sort-select-wrapper">
                <ArrowUpDown className="sort-icon w-4 h-4" />
                <select 
                  id="sortOrder" 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="none">Default</option>
                  <option value="year-desc">Year: Newest</option>
                  <option value="year-asc">Year: Oldest</option>
                  <option value="title-asc">Title: A-Z</option>
                  <option value="title-desc">Title: Z-A</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="loading-state">
            <RefreshCw className="spinner-icon w-8 h-8" />
            <p>Scanning cinema databases...</p>
          </div>
        ) : error && !viewWatchlistOnly ? (
          <div className="error-state">
            <p className="error-text">❌ {error}</p>
            <p className="error-sub">Verify the spelling or search for another movie keyword.</p>
          </div>
        ) : sortedMovies.length === 0 ? (
          <div className="empty-state">
            {viewWatchlistOnly ? (
              <>
                <StarOff className="empty-icon w-12 h-12" />
                <p>Your watchlist is empty.</p>
                <p className="empty-sub">Click the star button on any movie card to add it to your watchlist.</p>
              </>
            ) : (
              <>
                <Film className="empty-icon w-12 h-12" />
                <p>No results match the selected filters.</p>
              </>
            )}
          </div>
        ) : (
          <div className="movie-grid">
            {sortedMovies.map((movie) => (
              <MovieCard 
                key={movie.imdbID}
                movie={movie}
                isFavorite={watchlist.some((item) => item.imdbID === movie.imdbID)}
                onToggleFavorite={toggleFavorite}
                onClick={() => setSelectedImdbId(movie.imdbID)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {selectedImdbId && (
        <MovieDetailModal 
          imdbId={selectedImdbId} 
          apiKey={API_KEY} 
          onClose={() => setSelectedImdbId(null)}
        />
      )}

      <footer className="app-footer">
        <p>© 2026 CineSeek. All movie details fetched from OMDb API.</p>
      </footer>

      <style>{`
        .app-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .app-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 5%;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 100;
          gap: 20px;
        }

        @media (max-width: 768px) {
          .app-header {
            flex-direction: column;
            padding: 20px;
          }
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }

        .logo-icon {
          color: var(--primary);
          width: 32px;
          height: 32px;
        }

        .logo-container h1 {
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.5px;
          background: linear-gradient(to right, #ffffff, #a5b4fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .search-bar {
          display: flex;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid var(--border);
          border-radius: 30px;
          overflow: hidden;
          width: 100%;
          max-width: 450px;
          transition: var(--transition);
        }

        .search-bar:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
        }

        .search-bar input {
          flex-grow: 1;
          background: transparent;
          border: none;
          color: var(--text-primary);
          padding: 12px 20px;
          font-family: inherit;
          font-size: 15px;
          outline: none;
        }

        .search-bar button {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 0 20px;
          cursor: pointer;
          transition: var(--transition);
        }

        .search-bar button:hover {
          color: var(--primary);
        }

        .watchlist-toggle-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          color: var(--text-primary);
          padding: 10px 20px;
          border-radius: 30px;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          transition: var(--transition);
        }

        .watchlist-toggle-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .watchlist-toggle-btn.active {
          background: rgba(239, 68, 68, 0.15);
          border-color: var(--danger);
          color: var(--danger);
        }

        .main-content {
          flex-grow: 1;
          padding: 40px 5%;
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
          box-sizing: border-box;
        }

        .controls-panel {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .controls-panel h2 {
          font-size: 20px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .filters-group {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .control-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .control-item label {
          font-size: 14px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .control-item select {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid var(--border);
          color: var(--text-primary);
          padding: 8px 16px;
          border-radius: 8px;
          font-family: inherit;
          font-size: 14px;
          outline: none;
          cursor: pointer;
          transition: var(--transition);
        }

        .control-item select:focus {
          border-color: var(--primary);
        }

        .sort-select-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .sort-icon {
          position: absolute;
          left: 12px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .sort-select-wrapper select {
          padding-left: 36px !important;
        }

        /* Movie Grid */
        .movie-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 30px;
        }

        /* Load & States */
        .loading-state, .error-state, .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          text-align: center;
          color: var(--text-secondary);
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
        }

        .spinner-icon {
          color: var(--primary);
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        .empty-icon {
          color: var(--text-muted);
          margin-bottom: 16px;
        }

        .empty-sub, .error-sub {
          font-size: 14px;
          color: var(--text-muted);
          margin-top: 6px;
        }

        .app-footer {
          text-align: center;
          padding: 30px 20px;
          font-size: 13px;
          color: var(--text-muted);
          border-top: 1px solid var(--border);
          background: rgba(15, 23, 42, 0.4);
          margin-top: 60px;
        }
      `}</style>
    </div>
  );
}

export default App;
