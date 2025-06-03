import axios from 'axios';

// ATENÇÃO: É uma boa prática guardar chaves de API em variáveis de ambiente (.env)
const API_KEY = '0dab813c532987b4efff279ee6690fdd'; 
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Tamanhos de imagem disponíveis
export const IMAGE_SIZES = {
  poster: {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
    original: 'original'
  },
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original'
  },
  profile: {
    small: 'w45',
    medium: 'w185',
    large: 'h632',
    original: 'original'
  }
};

// ==================================================================
// >> A LINHA CRÍTICA PROVAVELMENTE É ESTA <<
// Garanta que a palavra "export" está aqui na frente da função.
export const getImageUrl = (path, size = IMAGE_SIZES.poster.medium) => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};
// ==================================================================


// Instância do axios configurada
const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'pt-BR'
  }
});

// Endpoints da API
export const fetchPopularMovies = (page = 1) => {
  return tmdbApi.get('/movie/popular', {
    params: { page }
  });
};

export const fetchTopRatedMovies = (page = 1) => {
  return tmdbApi.get('/movie/top_rated', {
    params: { page }
  });
};

export const fetchUpcomingMovies = (page = 1) => {
  return tmdbApi.get('/movie/upcoming', {
    params: { page }
  });
};

export const fetchMovieDetails = (movieId) => {
  return tmdbApi.get(`/movie/${movieId}`, {
    params: {
      append_to_response: 'videos,credits'
    }
  });
};

export const searchMovies = (query, page = 1) => {
  // A função search estava usando axios diretamente, vamos padronizar para usar a instância tmdbApi
  return tmdbApi.get('/search/movie', {
    params: {
      query,
      page
    }
  });
};

export const fetchMovieGenres = () => {
  return tmdbApi.get('/genre/movie/list');
};

export const fetchMoviesByGenre = (genreId, page = 1) => {
  return tmdbApi.get('/discover/movie', {
    params: {
      with_genres: genreId,
      page
    }
  });
};

export default tmdbApi;