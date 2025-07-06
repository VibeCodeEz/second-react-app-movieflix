import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Watchlist.css';

interface WatchlistMovie {
  id: number;
  title: string;
  year: number;
  rating: number;
  genre: string;
  director: string;
  addedDate: string;
  watched: boolean;
}

const Watchlist: React.FC = () => {
  const [watchlist, setWatchlist] = useState<WatchlistMovie[]>([
    {
      id: 1,
      title: "Inception",
      year: 2010,
      rating: 8.8,
      genre: "Sci-Fi",
      director: "Christopher Nolan",
      addedDate: "2024-01-15",
      watched: false
    },
    {
      id: 2,
      title: "The Dark Knight",
      year: 2008,
      rating: 9.0,
      genre: "Action",
      director: "Christopher Nolan",
      addedDate: "2024-01-10",
      watched: true
    },
    {
      id: 3,
      title: "Interstellar",
      year: 2014,
      rating: 8.6,
      genre: "Sci-Fi",
      director: "Christopher Nolan",
      addedDate: "2024-01-05",
      watched: false
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'watched' | 'unwatched'>('all');

  const toggleWatched = (id: number) => {
    setWatchlist(prev => 
      prev.map(movie => 
        movie.id === id ? { ...movie, watched: !movie.watched } : movie
      )
    );
  };

  const removeFromWatchlist = (id: number) => {
    setWatchlist(prev => prev.filter(movie => movie.id !== id));
  };

  const filteredWatchlist = watchlist.filter(movie => {
    if (filter === 'watched') return movie.watched;
    if (filter === 'unwatched') return !movie.watched;
    return true;
  });

  const watchedCount = watchlist.filter(movie => movie.watched).length;
  const unwatchedCount = watchlist.filter(movie => !movie.watched).length;

  return (
    <div className="watchlist-page">
      <div className="container">
        <h1 className="page-title">My List</h1>
        
        {/* Stats */}
        <div className="watchlist-stats">
          <div className="stat-card">
            <div className="stat-icon">📽️</div>
            <div className="stat-number">{watchlist.length}</div>
            <div className="stat-label">Total Movies</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-number">{watchedCount}</div>
            <div className="stat-label">Watched</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-number">{unwatchedCount}</div>
            <div className="stat-label">To Watch</div>
          </div>
        </div>

        {/* Filters */}
        <div className="watchlist-filters">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              <span>🎬</span>
              All ({watchlist.length})
            </button>
            <button 
              className={`filter-btn ${filter === 'watched' ? 'active' : ''}`}
              onClick={() => setFilter('watched')}
            >
              <span>✅</span>
              Watched ({watchedCount})
            </button>
            <button 
              className={`filter-btn ${filter === 'unwatched' ? 'active' : ''}`}
              onClick={() => setFilter('unwatched')}
            >
              <span>⏳</span>
              To Watch ({unwatchedCount})
            </button>
          </div>
        </div>

        {/* Watchlist */}
        {filteredWatchlist.length > 0 ? (
          <div className="watchlist-grid">
            {filteredWatchlist.map((movie) => (
              <div key={movie.id} className={`watchlist-card ${movie.watched ? 'watched' : ''}`}>
                <div className="movie-poster">
                  <div className="poster-placeholder">
                    🎭
                  </div>
                  <div className="movie-rating">
                    ⭐ {movie.rating}
                  </div>
                  {movie.watched && (
                    <div className="watched-badge">
                      ✓ Watched
                    </div>
                  )}
                  <div className="movie-year-badge">
                    {movie.year}
                  </div>
                </div>
                <div className="movie-info">
                  <h3 className="movie-title">{movie.title}</h3>
                  <p className="movie-year">{movie.year}</p>
                  <p className="movie-genre">{movie.genre}</p>
                  <p className="movie-director">Dir: {movie.director}</p>
                  <p className="added-date">Added: {movie.addedDate}</p>
                  <div className="movie-actions">
                    <Link to={`/movie/${movie.id}`} className="btn btn-primary">
                      View Details
                    </Link>
                    <button 
                      onClick={() => toggleWatched(movie.id)}
                      className={`btn ${movie.watched ? 'btn-outline' : 'btn-primary'}`}
                    >
                      {movie.watched ? 'Mark Unwatched' : 'Mark Watched'}
                    </button>
                    <button 
                      onClick={() => removeFromWatchlist(movie.id)}
                      className="btn btn-danger"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-watchlist">
            <div className="empty-icon">📽️</div>
            <h3>Your list is empty</h3>
            <p>Start adding movies to your list to keep track of what you want to watch!</p>
            <Link to="/movies" className="btn btn-primary">
              Browse Movies
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist; 