import React, { useEffect, useState } from 'react';
import { X, Star, Calendar, Clock, Award, Users, Film } from 'lucide-react';

const MovieDetailModal = ({ imdbId, onClose, apiKey }) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!imdbId) return;

    const fetchMovieDetail = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbId}&plot=full`);
        const data = await response.json();
        if (data.Response === 'True') {
          setMovie(data);
        } else {
          setError(data.Error || 'Failed to retrieve details.');
        }
      } catch (err) {
        setError('Network error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetail();
    
    // Lock background scroll
    document.body.style.overflow = 'hidden';
    
    // Close on ESC key press
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [imdbId, apiKey, onClose]);

  if (!imdbId) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="close-btn" onClick={onClose} aria-label="Close details">
          <X className="w-6 h-6" />
        </button>

        {loading && (
          <div className="modal-loader">
            <div className="spinner"></div>
            <span>Fetching detailed profile...</span>
          </div>
        )}

        {error && (
          <div className="modal-error">
            <p>⚠️ {error}</p>
          </div>
        )}

        {movie && !loading && !error && (
          <div className="movie-detail-grid">
            <div className="modal-poster-side">
              <img 
                src={movie.Poster !== 'N/A' ? movie.Poster : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=400&auto=format&fit=crop'} 
                alt={movie.Title} 
              />
            </div>
            
            <div className="modal-info-side">
              <div className="modal-header-info">
                <h2>{movie.Title}</h2>
                <div className="meta-row">
                  <span className="rated">{movie.Rated}</span>
                  <span className="meta-item"><Calendar className="w-4 h-4" /> {movie.Released}</span>
                  <span className="meta-item"><Clock className="w-4 h-4" /> {movie.Runtime}</span>
                </div>
              </div>

              {movie.imdbRating !== 'N/A' && (
                <div className="rating-box">
                  <Star className="w-5 h-5 text-yellow" fill="currentColor" />
                  <span className="rating-val">{movie.imdbRating}</span>
                  <span className="rating-scale">/10 ({movie.imdbVotes} votes)</span>
                </div>
              )}

              <div className="genre-tags">
                {movie.Genre.split(', ').map((g) => (
                  <span key={g} className="genre-tag">{g}</span>
                ))}
              </div>

              <div className="plot-box">
                <h3>Plot Outline</h3>
                <p>{movie.Plot}</p>
              </div>

              <div className="details-list">
                <div className="detail-item">
                  <Film className="w-4 h-4" />
                  <span><strong>Director:</strong> {movie.Director}</span>
                </div>
                <div className="detail-item">
                  <Users className="w-4 h-4" />
                  <span><strong>Cast:</strong> {movie.Actors}</span>
                </div>
                {movie.Awards !== 'N/A' && (
                  <div className="detail-item">
                    <Award className="w-4 h-4" />
                    <span><strong>Awards:</strong> {movie.Awards}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 1000;
          animation: fadeIn 0.25s ease-out;
        }

        .modal-content {
          background: #1e293b;
          border: 1px solid var(--border);
          border-radius: 20px;
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          color: var(--text-primary);
          padding: 8px;
          border-radius: 50%;
          cursor: pointer;
          transition: var(--transition);
          z-index: 10;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: rotate(90deg);
        }

        .modal-loader, .modal-error {
          padding: 80px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          color: var(--text-secondary);
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(99, 102, 241, 0.1);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .movie-detail-grid {
          display: grid;
          grid-template-columns: 350px 1fr;
          min-height: 500px;
        }

        @media (max-width: 768px) {
          .movie-detail-grid {
            grid-template-columns: 1fr;
          }
          .modal-poster-side {
            max-height: 400px;
          }
        }

        .modal-poster-side img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .modal-info-side {
          padding: 40px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .modal-header-info h2 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 12px;
          line-height: 1.2;
        }

        .meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          align-items: center;
          font-size: 14px;
          color: var(--text-secondary);
        }

        .rated {
          border: 1px solid var(--text-muted);
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 600;
          font-size: 12px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .rating-box {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 18px;
        }

        .text-yellow {
          color: var(--accent);
        }

        .rating-val {
          font-weight: 700;
          color: var(--text-primary);
        }

        .rating-scale {
          font-size: 14px;
          color: var(--text-muted);
        }

        .genre-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .genre-tag {
          background: rgba(99, 102, 241, 0.1);
          color: #a5b4fc;
          border: 1px solid rgba(99, 102, 241, 0.2);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
        }

        .plot-box h3 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--text-secondary);
        }

        .plot-box p {
          font-size: 15px;
          line-height: 1.6;
          color: var(--text-secondary);
        }

        .details-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          font-size: 14px;
          border-top: 1px solid var(--border);
          padding-top: 20px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
};

export default MovieDetailModal;
