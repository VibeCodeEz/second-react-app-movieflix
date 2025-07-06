import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { searchMovies, type SearchResult } from '../services/movieService.ts';
import './Movies.css';

// Extended SearchResult with genre information
interface MovieWithGenre extends SearchResult {
  genre?: string;
}

const Movies: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('title');
  const [movies, setMovies] = useState<MovieWithGenre[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const observer = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [hasMore, setHasMore] = useState(true);
  
  // Advanced filters
  const [yearRange, setYearRange] = useState({ min: '', max: '' });
  const [ratingFilter, setRatingFilter] = useState('All');
  const [languageFilter, setLanguageFilter] = useState('All');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Genre mapping for common movie titles
  const getGenreFromTitle = (title: string): string => {
    const titleLower = title.toLowerCase();
    
    // Action movies
    if (titleLower.includes('avengers') || titleLower.includes('iron man') || 
        titleLower.includes('captain america') || titleLower.includes('thor') ||
        titleLower.includes('spider-man') || titleLower.includes('batman') ||
        titleLower.includes('superman') || titleLower.includes('x-men') ||
        titleLower.includes('deadpool') || titleLower.includes('black panther') ||
        titleLower.includes('guardians') || titleLower.includes('ant-man')) {
      return 'Action';
    }
    
    // Adventure movies
    if (titleLower.includes('indiana jones') || titleLower.includes('pirates') ||
        titleLower.includes('jurassic') || titleLower.includes('tomb raider') ||
        titleLower.includes('mummy') || titleLower.includes('national treasure')) {
      return 'Adventure';
    }
    
    // Comedy movies
    if (titleLower.includes('hangover') || titleLower.includes('superbad') ||
        titleLower.includes('bridesmaids') || titleLower.includes('anchorman') ||
        titleLower.includes('step brothers') || titleLower.includes('zoolander')) {
      return 'Comedy';
    }
    
    // Drama movies
    if (titleLower.includes('shawshank') || titleLower.includes('godfather') ||
        titleLower.includes('pulp fiction') || titleLower.includes('forrest gump') ||
        titleLower.includes('schindler') || titleLower.includes('goodfellas')) {
      return 'Drama';
    }
    
    // Sci-Fi movies
    if (titleLower.includes('star wars') || titleLower.includes('star trek') ||
        titleLower.includes('matrix') || titleLower.includes('blade runner') ||
        titleLower.includes('alien') || titleLower.includes('predator') ||
        titleLower.includes('terminator') || titleLower.includes('back to the future')) {
      return 'Sci-Fi';
    }
    
    // Default to Action for superhero/marvel movies
    if (titleLower.includes('marvel') || titleLower.includes('dc')) {
      return 'Action';
    }
    
    return 'Action'; // Default genre
  };

  // Add genre information to movies
  const addGenreToMovies = (movies: SearchResult[]): MovieWithGenre[] => {
    return movies.map(movie => ({
      ...movie,
      genre: getGenreFromTitle(movie.title)
    }));
  };

  useEffect(() => {
    loadMovies();
    // eslint-disable-next-line
  }, [page]);

  useEffect(() => {
    if (loading) return;
    if (!hasMore) return;
    if (!sentinelRef.current) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new window.IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prev => prev + 1);
      }
    }, { threshold: 1 });
    observer.current.observe(sentinelRef.current);
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [loading, hasMore, sentinelRef.current]);

  const loadMovies = async (search: string = '', reset: boolean = false) => {
    setLoading(true);
    setError('');
    try {
      // Use a broader search term if no specific search is provided
      const searchTerm = search || 'movie';
      console.log('Loading movies with search term:', searchTerm, 'page:', page);
      
      const results = await searchMovies(searchTerm, page);
      console.log('Search results:', results);
      
      const moviesWithGenre = addGenreToMovies(results.movies);
      if (reset) {
        setMovies(moviesWithGenre);
      } else {
        setMovies(prev => [...prev, ...moviesWithGenre]);
      }

      const hasMoreResults = results.movies.length > 0 && (movies.length + results.movies.length) < results.totalResults;
      console.log('Has more results:', hasMoreResults, 'Total results:', results.totalResults);
      setHasMore(hasMoreResults);
    } catch (error) {
      console.error('Error loading movies:', error);
      setError('Failed to load movies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setPage(1);
    setMovies([]);
    setHasMore(true);
    await loadMovies(searchTerm, true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedGenre('All');
    setYearRange({ min: '', max: '' });
    setRatingFilter('All');
    setLanguageFilter('All');
    setPage(1);
    setMovies([]);
    setHasMore(true);
    loadMovies('', true);
  };

  // Filter movies by all criteria
  const filteredMovies = movies.filter(movie => {
    // Genre filter
    if (selectedGenre !== 'All' && movie.genre !== selectedGenre) {
      return false;
    }
    
    // Year range filter
    const movieYear = parseInt(movie.year);
    if (yearRange.min && movieYear < parseInt(yearRange.min)) {
      return false;
    }
    if (yearRange.max && movieYear > parseInt(yearRange.max)) {
      return false;
    }
    
    // Rating filter (simulated - using year as proxy for rating)
    if (ratingFilter !== 'All') {
      const movieRating = movieYear >= 2020 ? 'Recent' : movieYear >= 2010 ? 'Modern' : 'Classic';
      if (ratingFilter !== movieRating) {
        return false;
      }
    }
    
    // Language filter (simulated - using type as proxy)
    if (languageFilter !== 'All' && movie.type !== languageFilter.toLowerCase()) {
      return false;
    }
    
    return true;
  });

  // Sort filtered movies
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'year':
        return parseInt(b.year) - parseInt(a.year);
      default:
        return 0;
    }
  });

  // Get genre counts for display
  const getGenreCounts = () => {
    const counts: { [key: string]: number } = {};
    movies.forEach(movie => {
      const genre = movie.genre || 'Action';
      counts[genre] = (counts[genre] || 0) + 1;
    });
    return counts;
  };

  const genreCounts = getGenreCounts();

  return (
    <div className="movies-page">
      <div className="container">
        <h1 className="page-title">Movies</h1>
        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="search-input"
            />
            <button 
              onClick={handleSearch}
              className="search-button"
              disabled={loading}
            >
              {loading ? '🔍' : '🔍'}
            </button>
          </div>
          
          {/* Advanced Filters Toggle */}
          <div className="advanced-filters-toggle">
            <button 
              className="btn btn-outline"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              {showAdvancedFilters ? '▼' : '▲'} Advanced Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="advanced-filters">
              <div className="filter-row">
                <div className="filter-group">
                  <label>Year Range:</label>
                  <div className="year-range">
                    <input
                      type="number"
                      placeholder="Min Year"
                      value={yearRange.min}
                      onChange={(e) => setYearRange(prev => ({ ...prev, min: e.target.value }))}
                      className="year-input"
                      min="1900"
                      max="2030"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      placeholder="Max Year"
                      value={yearRange.max}
                      onChange={(e) => setYearRange(prev => ({ ...prev, max: e.target.value }))}
                      className="year-input"
                      min="1900"
                      max="2030"
                    />
                  </div>
                </div>
                
                <div className="filter-group">
                  <label>Rating:</label>
                  <select 
                    value={ratingFilter} 
                    onChange={(e) => setRatingFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="All">All Ratings</option>
                    <option value="Recent">Recent (2020+)</option>
                    <option value="Modern">Modern (2010-2019)</option>
                    <option value="Classic">Classic (Pre-2010)</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <label>Type:</label>
                  <select 
                    value={languageFilter} 
                    onChange={(e) => setLanguageFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="All">All Types</option>
                    <option value="movie">Movies</option>
                    <option value="series">Series</option>
                    <option value="episode">Episodes</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="filter-controls">
            <div className="filter-group">
              <label>Genre:</label>
              <select 
                value={selectedGenre} 
                onChange={(e) => handleGenreChange(e.target.value)}
                className="filter-select"
              >
                <option value="All">All ({movies.length})</option>
                <option value="Action">Action ({genreCounts['Action'] || 0})</option>
                <option value="Adventure">Adventure ({genreCounts['Adventure'] || 0})</option>
                <option value="Comedy">Comedy ({genreCounts['Comedy'] || 0})</option>
                <option value="Drama">Drama ({genreCounts['Drama'] || 0})</option>
                <option value="Sci-Fi">Sci-Fi ({genreCounts['Sci-Fi'] || 0})</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Sort by:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="title">Title</option>
                <option value="year">Year</option>
              </select>
            </div>
            <button 
              onClick={clearAllFilters}
              className="btn btn-outline clear-filters-btn"
            >
              Clear All
            </button>
          </div>
        </div>
        {error && (
          <div className="error-message">{error}</div>
        )}
        <div className="results-info">
          {loading && movies.length === 0 ? 'Loading...' : 
           `Found ${sortedMovies.length} movies`
          }
        </div>
        {loading && movies.length === 0 ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading movies...</p>
          </div>
        ) : (
          <div className="movies-grid">
            {sortedMovies.map((movie) => (
              <div key={movie.imdbID} className="movie-card">
                <div className="movie-poster">
                  {movie.poster !== 'N/A' ? (
                    <img 
                      src={movie.poster} 
                      alt={movie.title}
                      className="movie-poster-image"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`poster-placeholder ${movie.poster !== 'N/A' ? 'hidden' : ''}`}>
                    🎭
                  </div>
                  <div className="movie-year-badge">
                    {movie.year}
                  </div>
                  {movie.genre && (
                    <div className="movie-genre-badge">
                      {movie.genre}
                    </div>
                  )}
                </div>
                <div className="movie-info">
                  <h3 className="movie-title">{movie.title}</h3>
                  <p className="movie-year">{movie.year}</p>
                  <p className="movie-type">{movie.type}</p>
                  {movie.genre && (
                    <p className="movie-genre">{movie.genre}</p>
                  )}
                  <Link to={`/movie/${movie.imdbID}`} className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
            <div ref={sentinelRef} style={{ height: 1 }} />
          </div>
        )}
        {!loading && sortedMovies.length === 0 && movies.length > 0 && (
          <div className="no-results">
            <div className="no-results-icon">🎭</div>
            <h3>No movies found</h3>
            <p>Try adjusting your filters or search for different movies.</p>
            <button 
              onClick={clearAllFilters}
              className="btn btn-outline"
            >
              Clear All Filters
            </button>
          </div>
        )}
        {!loading && movies.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">🎬</div>
            <h3>No movies found</h3>
            <p>Try searching for different movies or clear your filters.</p>
            <button 
              onClick={clearAllFilters}
              className="btn btn-outline"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies; 