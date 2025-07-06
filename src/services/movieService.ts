// OMDB API Configuration
const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY || 'c37ef71f';
const OMDB_BASE_URL = import.meta.env.VITE_OMDB_BASE_URL || 'https://www.omdbapi.com/';

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

// Enhanced search with fallback
export const searchMovies = async (searchTerm: string, page: number = 1): Promise<SearchResponse> => {
  console.log('searchMovies called with:', searchTerm, 'page:', page);
  
  try {
    const response = await fetch(
      `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(searchTerm)}&type=movie&page=${page}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      console.error('API Response not ok:', response.status, response.statusText);
      // Fallback to mock data for better user experience
      console.log('Falling back to mock data due to API error');
      return { movies: getMockMovies(), totalResults: getMockMovies().length };
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    
    if (data.Response === 'True') {
      return {
        movies: (data.Search || []).map(mapOmdbToSearchResult),
        totalResults: parseInt(data.totalResults) || (data.Search ? data.Search.length : 0),
      };
    } else {
      console.error('API Error:', data.Error);
      // Fallback to mock data for better user experience
      console.log('Falling back to mock data due to API error');
      return { movies: getMockMovies(), totalResults: getMockMovies().length };
    }
  } catch (error) {
    console.error('Fetch error:', error);
    // Fallback to mock data for better user experience
    console.log('Falling back to mock data due to fetch error');
    return { movies: getMockMovies(), totalResults: getMockMovies().length };
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
      `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&i=${imdbId}&plot=full`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      console.error('Movie details API Response not ok:', response.status, response.statusText);
      return null;
    }
    
    const data = await response.json();
    console.log('Movie details API Response:', data);
    
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
  const popularTerms = ['movie', 'action', 'drama', 'comedy', 'adventure'];
  const randomTerm = popularTerms[Math.floor(Math.random() * popularTerms.length)];
  try {
    const response = await fetch(
      `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&s=${randomTerm}&type=movie&page=${page}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      console.error('Popular movies API Response not ok:', response.status, response.statusText);
      return { movies: [], totalResults: 0 };
    }
    
    const data = await response.json();
    console.log('Popular movies API Response:', data);
    
    if (data.Response === 'True') {
      return {
        movies: (data.Search || []).map(mapOmdbToSearchResult),
        totalResults: parseInt(data.totalResults) || (data.Search ? data.Search.length : 0),
      };
    } else {
      console.error('Popular movies API Error:', data.Error);
      // Fallback to mock data for better user experience
      console.log('Falling back to mock data for popular movies');
      return { movies: getMockMovies(), totalResults: getMockMovies().length };
    }
  } catch (error) {
    console.error('Popular movies fetch error:', error);
    // Fallback to mock data for better user experience
    console.log('Falling back to mock data for popular movies');
    return { movies: getMockMovies(), totalResults: getMockMovies().length };
  }
};

// Test API connection
export const testApiConnection = async (): Promise<boolean> => {
  try {
    console.log('Testing API connection...');
    console.log('API Key:', OMDB_API_KEY ? 'Present' : 'Missing');
    console.log('Base URL:', OMDB_BASE_URL);
    
    const response = await fetch(
      `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&s=movie&type=movie&page=1`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('Test response status:', response.status);
    const data = await response.json();
    console.log('Test response data:', data);
    
    return data.Response === 'True';
  } catch (error) {
    console.error('API test failed:', error);
    return false;
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
    },
    {
      title: "The Shawshank Redemption",
      year: "1994",
      imdbID: "tt0111161",
      type: "movie",
      poster: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg"
    },
    {
      title: "Forrest Gump",
      year: "1994",
      imdbID: "tt0109830",
      type: "movie",
      poster: "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjExXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg"
    },
    {
      title: "The Matrix",
      year: "1999",
      imdbID: "tt0133093",
      type: "movie",
      poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg"
    },
    {
      title: "Goodfellas",
      year: "1990",
      imdbID: "tt0099685",
      type: "movie",
      poster: "https://m.media-amazon.com/images/M/MV5BY2NkZjEzMDgtN2RjYy00YzM1LWI4ZmQtMjMgYjAxNWQ0ODI@._V1_SX300.jpg"
    },
    {
      title: "The Silence of the Lambs",
      year: "1991",
      imdbID: "tt0102926",
      type: "movie",
      poster: "https://m.media-amazon.com/images/M/MV5BNjNhZTk0ZmEtNjJhMi00YzFlLWE1MmEtYzM1M2ZmMGMwMTU4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg"
    },
    {
      title: "Fight Club",
      year: "1999",
      imdbID: "tt0137523",
      type: "movie",
      poster: "https://m.media-amazon.com/images/M/MV5BNDIzNDU0YzEtYzE5Ni00ZjlkLTk5ZjgtNjM3NWE4YzA3Nzk3XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg"
    },
    {
      title: "The Godfather",
      year: "1972",
      imdbID: "tt0068646",
      type: "movie",
      poster: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg"
    },
    {
      title: "Schindler's List",
      year: "1993",
      imdbID: "tt0108052",
      type: "movie",
      poster: "https://m.media-amazon.com/images/M/MV5BNDE4OTMxMTctNmRhYy00NWE2LTg3YzItYTk3M2UwOTU5Njg4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg"
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