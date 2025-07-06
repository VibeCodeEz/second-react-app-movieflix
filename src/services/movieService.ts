// OMDB API Configuration
const OMDB_API_KEY = 'c37ef71f';
const OMDB_BASE_URL = 'http://www.omdbapi.com/';

export interface Movie {
  id: string;
  title: string;
  year: string;
  rated: string;
  released: string;
  runtime: string;
  genre: string;
  director: string;
  writer: string;
  actors: string;
  plot: string;
  language: string;
  country: string;
  awards: string;
  poster: string;
  ratings: Rating[];
  metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  type: string;
  dvd: string;
  boxOffice: string;
  production: string;
  website: string;
  response: string;
}

export interface Rating {
  source: string;
  value: string;
}

export interface SearchResult {
  title: string;
  year: string;
  imdbID: string;
  type: string;
  poster: string;
}

// Update SearchResult and SearchResponse types if needed
export interface SearchResponse {
  movies: SearchResult[];
  totalResults: number;
}

// Helper to map OMDB Search result to your SearchResult type
function mapOmdbToSearchResult(item: any): SearchResult {
  return {
    title: item.Title,
    year: item.Year,
    imdbID: item.imdbID,
    type: item.Type,
    poster: item.Poster,
  };
}

// Search movies by title with pagination
export const searchMovies = async (searchTerm: string, page: number = 1): Promise<SearchResponse> => {
  console.log('searchMovies called with:', searchTerm, 'page:', page);
  try {
    const response = await fetch(
      `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(searchTerm)}&type=movie&page=${page}`
    );
    const data = await response.json();
    if (data.Response === 'True') {
      return {
        movies: (data.Search || []).map(mapOmdbToSearchResult),
        totalResults: parseInt(data.totalResults) || (data.Search ? data.Search.length : 0),
      };
    } else {
      return { movies: [], totalResults: 0 };
    }
  } catch (error) {
    return { movies: [], totalResults: 0 };
  }
};

function mapOmdbToMovie(item: any): Movie {
  return {
    id: item.imdbID,
    title: item.Title,
    year: item.Year,
    rated: item.Rated,
    released: item.Released,
    runtime: item.Runtime,
    genre: item.Genre,
    director: item.Director,
    writer: item.Writer,
    actors: item.Actors,
    plot: item.Plot,
    language: item.Language,
    country: item.Country,
    awards: item.Awards,
    poster: item.Poster,
    ratings: (item.Ratings || []).map((r: any) => ({
      source: r.Source,
      value: r.Value,
    })),
    metascore: item.Metascore,
    imdbRating: item.imdbRating,
    imdbVotes: item.imdbVotes,
    imdbID: item.imdbID,
    type: item.Type,
    dvd: item.DVD,
    boxOffice: item.BoxOffice,
    production: item.Production,
    website: item.Website,
    response: item.Response,
  };
}

// Get movie details by IMDB ID
export const getMovieDetails = async (imdbId: string): Promise<Movie | null> => {
  try {
    const response = await fetch(
      `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&i=${imdbId}&plot=full`
    );
    const data = await response.json();
    
    if (data.Response === 'True') {
      return mapOmdbToMovie(data);
    } else {
      console.error('Movie details error:', data.Error);
      return null;
    }
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};

// Get popular movies (using search with common terms and pagination)
export const getPopularMovies = async (page: number = 1): Promise<SearchResponse> => {
  const popularTerms = ['avengers', 'batman', 'spider', 'star wars', 'marvel'];
  const randomTerm = popularTerms[Math.floor(Math.random() * popularTerms.length)];
  try {
    const response = await fetch(
      `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&s=${randomTerm}&type=movie&page=${page}`
    );
    const data = await response.json();
    if (data.Response === 'True') {
      return {
        movies: (data.Search || []).map(mapOmdbToSearchResult),
        totalResults: parseInt(data.totalResults) || (data.Search ? data.Search.length : 0),
      };
    } else {
      return { movies: [], totalResults: 0 };
    }
  } catch (error) {
    return { movies: [], totalResults: 0 };
  }
};

// Mock data for development (when API key is not available)
export const getMockMovies = (): SearchResult[] => {
  return [
    {
      title: "Inception",
      year: "2010",
      imdbID: "tt1375666",
      type: "movie",
      poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg"
    },
    {
      title: "The Dark Knight",
      year: "2008",
      imdbID: "tt0468569",
      type: "movie",
      poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg"
    },
    {
      title: "Interstellar",
      year: "2014",
      imdbID: "tt0816692",
      type: "movie",
      poster: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg"
    },
    {
      title: "Pulp Fiction",
      year: "1994",
      imdbID: "tt0110912",
      type: "movie",
      poster: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg"
    }
  ];
};

export const getMockMovieDetails = (imdbId: string): Movie | null => {
  const mockMovies: { [key: string]: Movie } = {
    "tt1375666": {
      id: "tt1375666",
      title: "Inception",
      year: "2010",
      rated: "PG-13",
      released: "16 Jul 2010",
      runtime: "148 min",
      genre: "Action, Adventure, Sci-Fi",
      director: "Christopher Nolan",
      writer: "Christopher Nolan",
      actors: "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page",
      plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      language: "English, Japanese, French",
      country: "United States, United Kingdom",
      awards: "Won 4 Oscars. 157 wins & 220 nominations total",
      poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
      ratings: [
        { source: "Internet Movie Database", value: "8.8/10" },
        { source: "Rotten Tomatoes", value: "87%" },
        { source: "Metacritic", value: "74/100" }
      ],
      metascore: "74",
      imdbRating: "8.8",
      imdbVotes: "2,448,585",
      imdbID: "tt1375666",
      type: "movie",
      dvd: "07 Dec 2010",
      boxOffice: "$292,576,195",
      production: "N/A",
      website: "N/A",
      response: "True"
    },
    "tt0468569": {
      id: "tt0468569",
      title: "The Dark Knight",
      year: "2008",
      rated: "PG-13",
      released: "18 Jul 2008",
      runtime: "152 min",
      genre: "Action, Crime, Drama",
      director: "Christopher Nolan",
      writer: "Jonathan Nolan, Christopher Nolan",
      actors: "Christian Bale, Heath Ledger, Aaron Eckhart",
      plot: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      language: "English, Mandarin",
      country: "United States, United Kingdom",
      awards: "Won 2 Oscars. 159 wins & 163 nominations total",
      poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
      ratings: [
        { source: "Internet Movie Database", value: "9.0/10" },
        { source: "Rotten Tomatoes", value: "94%" },
        { source: "Metacritic", value: "84/100" }
      ],
      metascore: "84",
      imdbRating: "9.0",
      imdbVotes: "2,756,361",
      imdbID: "tt0468569",
      type: "movie",
      dvd: "09 Dec 2008",
      boxOffice: "$534,858,444",
      production: "N/A",
      website: "N/A",
      response: "True"
    }
  };

  return mockMovies[imdbId] || null;
}; 