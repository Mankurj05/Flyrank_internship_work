import React from 'react';
import { Star, Film, Tv, Radio } from 'lucide-react';

const MovieCard = ({ movie, isFavorite, onToggleFavorite, onClick }) => {
  const getMediaTypeIcon = (type) => {
    switch (type) {
      case 'series':
        return <Tv className="w-4 h-4" />;
      case 'episode':
        return <Radio className="w-4 h-4" />;
      default:
        return <Film className="w-4 h-4" />;
    }
  };

  const posterUrl = movie.Poster !== 'N/A' 
    ? movie.Poster 
    : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=300&auto=format&fit=crop';

  return (
    <div className="movie-card animate-fade-in">
      <div className="poster-container">
        <img 
          src={posterUrl} 
          alt={movie.Title} 
          loading="lazy" 
          onClick={onClick}
          className="movie-poster"
        />
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(movie);
          }}
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          aria-label={isFavorite ? "Remove from watchlist" : "Add to watchlist"}
        >
          <Star className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} />
        </button>

        <span className="type-badge">
          {getMediaTypeIcon(movie.Type)}
          <span>{movie.Type.toUpperCase()}</span>
        </span>
      </div>

      <div className="movie-info" onClick={onClick}>
        <span className="movie-year">{movie.Year}</span>
        <h3 className="movie-title">{movie.Title}</h3>
      </div>
      
      <style>{`
        .movie-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          transition: var(--transition);
          display: flex;
          flex-direction: column;
          height: 100%;
          cursor: pointer;
        }

        .movie-card:hover {
          transform: translateY(-5px);
          border-color: var(--border-focus);
          background: var(--bg-card-hover);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
        }

        .poster-container {
          position: relative;
          aspect-ratio: 2/3;
          width: 100%;
          overflow: hidden;
          background: #1e293b;
        }

        .movie-poster {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition);
        }

        .movie-card:hover .movie-poster {
          transform: scale(1.05);
        }

        .favorite-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          padding: 8px;
          border-radius: 50%;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        .favorite-btn:hover {
          color: var(--accent);
          transform: scale(1.1);
          background: rgba(15, 23, 42, 0.8);
        }

        .favorite-btn.active {
          color: var(--accent);
          border-color: var(--accent);
        }

        .type-badge {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(4px);
          border: 1px solid var(--border);
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          letter-spacing: 0.5px;
        }

        .movie-info {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex-grow: 1;
        }

        .movie-year {
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 500;
        }

        .movie-title {
          font-size: 16px;
          font-weight: 600;
          line-height: 1.4;
          color: var(--text-primary);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default MovieCard;
