import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPopularMovies, type SearchResult } from '../services/movieService.ts';
import './Home.css';

const Home: React.FC = () => {
  const [featuredMovies, setFeaturedMovies] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroMovie, setHeroMovie] = useState<SearchResult | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const loadFeaturedMovies = async () => {
      try {
        const response = await getPopularMovies();
        setFeaturedMovies(response.movies.slice(0, 6)); // Show first 6 movies
        if (response.movies.length > 0) {
          setHeroMovie(response.movies[0]); // Use first movie as hero
        }
      } catch (error) {
        console.error('Error loading featured movies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedMovies();
  }, []);

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex(prev => (prev + 1) % Math.min(featuredMovies.length, 5));
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  const nextSlide = () => {
    setCarouselIndex(prev => (prev + 1) % Math.min(featuredMovies.length, 5));
  };

  const prevSlide = () => {
    setCarouselIndex(prev => prev === 0 ? Math.min(featuredMovies.length - 1, 4) : prev - 1);
  };

  const goToSlide = (index: number) => {
    setCarouselIndex(index);
  };

  return (
    <div className="home">
      {/* Netflix-style Hero Section */}
      <section className="hero">
        <div className="hero-background">
          {heroMovie?.poster && heroMovie.poster !== 'N/A' ? (
            <img 
              src={heroMovie.poster} 
              alt={heroMovie.title}
              className="hero-bg-image"
            />
          ) : (
            <div className="hero-bg-placeholder">
              <span>🎬</span>
            </div>
          )}
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="container">
            <div className="hero-text">
              <h1 className="hero-title">
                {heroMovie ? heroMovie.title : 'Welcome to MovieFlix'}
              </h1>
              <p className="hero-subtitle">
                {heroMovie ? `${heroMovie.year} • ${heroMovie.type}` : 'Discover amazing movies, track your favorites, and never miss a great film again.'}
              </p>
              <div className="hero-buttons">
                <Link to="/movies" className="btn btn-primary hero-btn">
                  <span>🎬</span>
                  Browse Movies
                </Link>
                <Link to="/watchlist" className="btn btn-outline hero-btn">
                  <span>📋</span>
                  My List
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Movie Carousel Section */}
      <section className="carousel-section">
        <div className="container">
          <h2 className="section-title">Featured Movies</h2>
          {loading ? (
            <div className="carousel-skeleton">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="skeleton-card">
                  <div className="skeleton-poster"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-text"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="carousel-container">
                <button className="carousel-btn prev" onClick={prevSlide}>
                  ‹
                </button>
                <div className="carousel-track">
                  {featuredMovies.slice(0, 5).map((movie, index) => (
                    <div 
                      key={movie.imdbID} 
                      className={`carousel-slide ${index === carouselIndex ? 'active' : ''}`}
                      style={{ transform: `translateX(${(index - carouselIndex) * 100}%)` }}
                    >
                      <div className="carousel-card">
                        <div className="carousel-poster">
                          {movie.poster !== 'N/A' ? (
                            <img 
                              src={movie.poster} 
                              alt={movie.title}
                              className="carousel-poster-image"
                            />
                          ) : (
                            <div className="carousel-poster-placeholder">
                              🎭
                            </div>
                          )}
                          <div className="carousel-overlay">
                            <Link to={`/movie/${movie.imdbID}`} className="carousel-play-btn">
                              ▶ Play
                            </Link>
                          </div>
                        </div>
                        <div className="carousel-info">
                          <h3 className="carousel-title">{movie.title}</h3>
                          <p className="carousel-year">{movie.year}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="carousel-btn next" onClick={nextSlide}>
                  ›
                </button>
              </div>
              <div className="carousel-indicators">
                {featuredMovies.slice(0, 5).map((_, index) => (
                  <button
                    key={index}
                    className={`indicator ${index === carouselIndex ? 'active' : ''}`}
                    onClick={() => goToSlide(index)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Featured Movies Section */}
      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">Trending Now</h2>
          <div className="movies-grid">
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading trending movies...</p>
              </div>
            ) : (
              featuredMovies.map((movie) => (
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
                  </div>
                  <div className="movie-info">
                    <h3 className="movie-title">{movie.title}</h3>
                    <p className="movie-year">{movie.year}</p>
                    <p className="movie-type">{movie.type}</p>
                    <Link to={`/movie/${movie.imdbID}`} className="btn btn-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="view-all-container">
            <Link to="/movies" className="btn btn-outline">
              View All Movies
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">🎬</div>
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Movies</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🎭</div>
              <div className="stat-number">50+</div>
              <div className="stat-label">Genres</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🌍</div>
              <div className="stat-number">100+</div>
              <div className="stat-label">Countries</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⚡</div>
              <div className="stat-number">24/7</div>
              <div className="stat-label">Available</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 