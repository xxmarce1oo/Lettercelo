import { useState, useEffect } from 'react';
import { FaTimes, FaSadTear } from 'react-icons/fa';
import MovieCard from './MovieCard';
import './FavoriteMovies.css';

const FavoriteMovies = ({ onClose, onSelectMovie }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar favoritos do localStorage
    const loadFavorites = () => {
      setLoading(true);
      try {
        const storedFavorites = localStorage.getItem('favoriteMovies');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const handleRemoveFavorite = (movieId) => {
    const updatedFavorites = favorites.filter(movie => movie.id !== movieId);
    setFavorites(updatedFavorites);
    localStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));
  };

  if (loading) {
    return (
      <div className="favorites-overlay">
        <div className="favorites-container">
          <div className="favorites-header">
            <h2>Meus Favoritos</h2>
            <button className="close-button" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
          <div className="favorites-loading">
            <div className="loading-spinner"></div>
            <p>Carregando favoritos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-overlay">
      <div className="favorites-container">
        <div className="favorites-header">
          <h2>Meus Favoritos</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        {favorites.length === 0 ? (
          <div className="no-favorites">
            <FaSadTear size={48} />
            <p>Você ainda não tem filmes favoritos</p>
            <p className="no-favorites-subtitle">Adicione filmes aos favoritos clicando no ícone de coração nos cards de filmes</p>
          </div>
        ) : (
          <div className="favorites-grid">
            {favorites.map(movie => (
              <div key={movie.id} className="favorite-item">
                <MovieCard 
                  movie={movie} 
                  genres={movie.genre_ids} 
                  onSelect={() => onSelectMovie(movie)} 
                />
                <button 
                  className="remove-favorite" 
                  onClick={() => handleRemoveFavorite(movie.id)}
                >
                  <FaTimes /> Remover
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteMovies;
