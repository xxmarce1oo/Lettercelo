import { useState, useEffect } from 'react';
import { FaStar, FaHeart } from 'react-icons/fa';
import { getImageUrl } from '../../services/tmdbApi';
import './MovieCard.css';

const MovieCard = ({ movie, genres, onSelect }) => {
  const [movieGenres, setMovieGenres] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  // Mapear IDs de gênero para nomes
  useEffect(() => {
    if (Array.isArray(genres)) {
      // Se genres for um array de objetos com id e name
      if (typeof genres[0] === 'object') {
        const genreNames = movie.genre_ids
          .map(id => genres.find(g => g.id === id))
          .filter(Boolean)
          .map(g => g.name);
        setMovieGenres(genreNames);
      } else {
        // Se genres for apenas um array de IDs
        setMovieGenres(genres);
      }
    }
  }, [movie, genres]);

  // Verificar se o filme está nos favoritos
  useEffect(() => {
    const checkFavorite = () => {
      try {
        const storedFavorites = localStorage.getItem('favoriteMovies');
        if (storedFavorites) {
          const favorites = JSON.parse(storedFavorites);
          setIsFavorite(favorites.some(fav => fav.id === movie.id));
        }
      } catch (error) {
        console.error('Erro ao verificar favoritos:', error);
      }
    };

    checkFavorite();
  }, [movie.id]);

  // Calcular cor de fundo baseada na nota
  const getRatingColor = (rating) => {
    if (rating >= 7) return 'var(--success-color)';
    if (rating >= 5) return 'var(--warning-color)';
    return 'var(--error-color)';
  };

  const handleClick = () => {
    onSelect(movie);
  };

  const toggleFavorite = (e) => {
    e.stopPropagation(); // Evitar que o clique propague para o card
    
    try {
      // Obter favoritos atuais
      const storedFavorites = localStorage.getItem('favoriteMovies');
      let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
      
      if (isFavorite) {
        // Remover dos favoritos
        favorites = favorites.filter(fav => fav.id !== movie.id);
      } else {
        // Adicionar aos favoritos
        favorites.push({
          ...movie,
          // Garantir que temos os gêneros salvos como objetos
          genre_ids: Array.isArray(movie.genre_ids) ? movie.genre_ids : 
                    Array.isArray(movie.genres) ? movie.genres.map(g => g.id) : []
        });
      }
      
      // Salvar no localStorage
      localStorage.setItem('favoriteMovies', JSON.stringify(favorites));
      setIsFavorite(!isFavorite);
      
      // Disparar evento para notificar outros componentes
      window.dispatchEvent(new Event('favoritesUpdated'));
    } catch (error) {
      console.error('Erro ao atualizar favoritos:', error);
    }
  };

  return (
    <div className="movie-card" onClick={handleClick}>
      <div className="movie-poster">
        {movie.poster_path ? (
          <img
            src={getImageUrl(movie.poster_path)}
            alt={`Poster de ${movie.title}`}
          />
        ) : (
          <div className="no-poster">Sem imagem</div>
        )}
        {movie.vote_average > 0 && (
          <div
            className="movie-rating"
            style={{ backgroundColor: getRatingColor(movie.vote_average) }}
          >
            <FaStar />
            <span>{movie.vote_average.toFixed(1)}</span>
          </div>
        )}
        <button
          className={`favorite-button ${isFavorite ? 'active' : ''}`}
          onClick={toggleFavorite}
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <FaHeart />
        </button>
      </div>

      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-release-date">
          {movie.release_date ? (
            new Date(movie.release_date).toLocaleDateString('pt-BR')
          ) : (
            'Data desconhecida'
          )}
        </p>
        
        {movieGenres.length > 0 && (
          <div className="movie-genres">
            {movieGenres.slice(0, 2).map((genre, index) => (
              <span key={index} className="genre-tag">
                {genre}
              </span>
            ))}
            {movieGenres.length > 2 && (
              <span className="genre-tag more">+{movieGenres.length - 2}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
