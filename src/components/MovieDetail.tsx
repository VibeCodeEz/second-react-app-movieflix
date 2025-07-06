import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetails, type Movie } from '../services/movieService.ts';
import './MovieDetail.css';

interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newReview, setNewReview] = useState({ author: '', rating: 5, comment: '' });
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (id) {
      loadMovieDetails(id);
    }
  }, [id]);

  const loadMovieDetails = async (imdbId: string) => {
    setLoading(true);
    setError('');
    
    try {
      // Using real API to get movie details
      const movieData = await getMovieDetails(imdbId);
      
      if (movieData) {
        setMovie(movieData);
        // Load mock reviews
        setReviews([
          {
            id: 1,
            author: "MovieFan123",
            rating: 9,
            comment: "Absolutely mind-bending! Christopher Nolan outdid himself with this masterpiece. The concept of dream infiltration is executed perfectly.",
            date: "2024-01-15"
          },
          {
            id: 2,
            author: "CinemaLover",
            rating: 8,
            comment: "Great visual effects and a complex plot that keeps you engaged throughout. The ending leaves you thinking for days.",
            date: "2024-01-10"
          }
        ]);
      } else {
        setError('Movie not found');
      }
    } catch (err) {
      setError('Failed to load movie details');
      console.error('Error loading movie details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.author && newReview.comment) {
      const review: Review = {
        id: reviews.length + 1,
        author: newReview.author,
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString().split('T')[0]
      };
      setReviews(prev => [review, ...prev]);
      setNewReview({ author: '', rating: 5, comment: '' });
    }
  };

  const renderStars = (rating: number) => {
    // OMDB ratings are out of 10, so scale to 5 stars
    const parsed = Number(rating);
    if (isNaN(parsed)) return '';
    const fiveStarRating = Math.round((parsed / 10) * 5);
    const clamped = Math.max(0, Math.min(5, fiveStarRating));
    return '⭐'.repeat(clamped) + '☆'.repeat(5 - clamped);
  };

  if (loading) {
    return (
      <div className="movie-detail-page">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading movie details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="movie-detail-page">
        <div className="container">
          <Link to="/movies" className="back-button">
            ← Back to Movies
          </Link>
          <div className="error-message">
            {error || 'Movie not found'}
          </div>
        </div>
      </div>
    );
  }

  console.log('MovieDetail rendering movie:', movie);

  return (
    <div className="movie-detail-page">
      <div className="container">
        {/* Back Button */}
        <Link to="/movies" className="back-button">
          ← Back to Movies
        </Link>

        {/* Movie Header */}
        <div className="movie-header">
          <div className="movie-poster-large">
            {movie.poster !== 'N/A' ? (
              <img 
                src={movie.poster} 
                alt={movie.title}
                className="movie-poster-image-large"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`poster-placeholder-large ${movie.poster !== 'N/A' ? 'hidden' : ''}`}>
              🎭
            </div>
          </div>
          <div className="movie-header-info">
            <h1 className="movie-title-large">{movie.title}</h1>
            <div className="movie-meta">
              <span className="movie-year-large">{movie.year}</span>
              <span className="movie-duration">{movie.runtime}</span>
              <span className="movie-rated">{movie.rated}</span>
            </div>
            <div className="movie-rating-large">
              ⭐ {movie.imdbRating}/10 ({movie.imdbVotes} votes)
            </div>
            <p className="movie-director-large">Directed by {movie.director}</p>
            <p className="movie-plot">{movie.plot}</p>
            <div className="movie-details">
              <p><strong>Genre:</strong> {movie.genre}</p>
              <p><strong>Released:</strong> {movie.released}</p>
              <p><strong>Country:</strong> {movie.country}</p>
              <p><strong>Language:</strong> {movie.language}</p>
              {movie.awards !== 'N/A' && (
                <p><strong>Awards:</strong> {movie.awards}</p>
              )}
            </div>
            <div className="movie-actions">
              <button className="btn btn-primary">Add to Watchlist</button>
              <button className="btn btn-secondary">Share</button>
            </div>
          </div>
        </div>

        {/* Cast Section */}
        <section className="cast-section">
          <h2 className="section-title">Cast</h2>
          <div className="cast-grid">
            {movie.actors.split(', ').map((actor, index) => (
              <div key={index} className="cast-member">
                <div className="cast-avatar">
                  👤
                </div>
                <p className="cast-name">{actor}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Ratings Section */}
        <section className="ratings-section">
          <h2 className="section-title">Ratings</h2>
          <div className="ratings-grid">
            {movie.ratings.map((rating, index) => (
              <div key={index} className="rating-card">
                <div className="rating-source">{rating.source}</div>
                <div className="rating-value">{rating.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews Section */}
        <section className="reviews-section">
          <h2 className="section-title">Reviews</h2>
          
          {/* Add Review Form */}
          <div className="add-review-form">
            <h3>Add Your Review</h3>
            <form onSubmit={handleAddReview}>
              <div className="form-group">
                <label>Your Name:</label>
                <input
                  type="text"
                  value={newReview.author}
                  onChange={(e) => setNewReview({...newReview, author: e.target.value})}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Rating:</label>
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                  className="form-select"
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Comment:</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  required
                  className="form-textarea"
                  rows={4}
                />
              </div>
              <button type="submit" className="btn btn-primary">Submit Review</button>
            </form>
          </div>

          {/* Reviews List */}
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="review-author">{review.author}</div>
                  <div className="review-rating">{renderStars(review.rating)}</div>
                </div>
                <p className="review-comment">{review.comment}</p>
                <div className="review-date">{review.date}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MovieDetail; 