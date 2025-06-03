import { useState, useEffect, useContext } from 'react';
import { FaSearch, FaFilter, FaStar, FaCalendarAlt, FaHeart, FaTimes, FaUser, FaMoon, FaSun, FaSignOutAlt, FaChevronDown, FaBookmark, FaRobot } from 'react-icons/fa';
import { fetchPopularMovies, fetchTopRatedMovies, fetchUpcomingMovies, fetchMovieGenres, searchMovies, fetchMoviesByGenre, getImageUrl } from '../../services/tmdbApi';
import { useTheme } from '../../contexts/ThemeContext';
import MovieCard from './MovieCard';
import MovieDetails from './MovieDetails';
import FavoriteMovies from './FavoriteMovies';
import MovieAI from './MovieAI';
import { useNavigate } from 'react-router-dom';
import './MovieLibrary.css';

const MovieLibrary = () => {
  const { darkMode, toggleTheme } = useTheme();
  const [userEmail, setUserEmail] = useState('');
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [showGenreFilter, setShowGenreFilter] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [showAI, setShowAI] = useState(false);
  const navigate = useNavigate();

  // Carregar filmes com base na aba ativa, busca ou gênero selecionado
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        let response;
        
        // Se tiver gênero selecionado, priorizar a busca por gênero
        if (selectedGenre) {
          response = await fetchMoviesByGenre(selectedGenre.id, page);
        }
        // Se estiver buscando, ignorar a aba ativa
        else if (isSearching && searchQuery.trim() !== '') {
          response = await searchMovies(searchQuery, page);
        } else {
          // Se não estiver buscando, usar a aba ativa
          switch (activeTab) {
            case 'popular':
              response = await fetchPopularMovies(page);
              break;
            case 'top_rated':
              response = await fetchTopRatedMovies(page);
              break;
            case 'upcoming':
              response = await fetchUpcomingMovies(page);
              break;
            default:
              response = await fetchPopularMovies(page);
          }
        }
        
        setMovies(response.data.results);
        setTotalPages(response.data.total_pages > 500 ? 500 : response.data.total_pages);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar filmes. Por favor, tente novamente.');
        setLoading(false);
        console.error('Erro ao buscar filmes:', err);
      }
    };

    fetchMovies();
  }, [activeTab, page, isSearching, searchQuery, selectedGenre]);

  // Obter email do usuário do localStorage
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      setUserEmail(userEmail);
    }
    
    // Contar favoritos
    const countFavorites = () => {
      try {
        const storedFavorites = localStorage.getItem('favoriteMovies');
        if (storedFavorites) {
          const favorites = JSON.parse(storedFavorites);
          setFavoritesCount(favorites.length);
        }
      } catch (error) {
        console.error('Erro ao contar favoritos:', error);
      }
    };
    
    countFavorites();
    
    // Adicionar listener para atualizações de favoritos
    window.addEventListener('favoritesUpdated', countFavorites);
    
    return () => {
      window.removeEventListener('favoritesUpdated', countFavorites);
    };
  }, []);

  // Carregar gêneros de filmes
  useEffect(() => {
    const getGenres = async () => {
      try {
        const response = await fetchMovieGenres();
        setGenres(response.data.genres);
      } catch (err) {
        console.error('Erro ao buscar gêneros:', err);
      }
    };

    getGenres();
  }, []);

  // Manipular mudança de aba
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
    setSelectedMovie(null);
    // Se estiver em modo de busca, sair dele
    if (isSearching) {
      setIsSearching(false);
      setSearchQuery('');
    }
    // Limpar gênero selecionado
    if (selectedGenre) {
      setSelectedGenre(null);
    }
  };

  // Manipular clique em um filme
  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };
  
  // Voltar para a lista de filmes
  const handleBackToList = () => {
    setSelectedMovie(null);
  };

  // Manipular mudança de página
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  // Manipular busca de filmes
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      setIsSearching(true);
      setPage(1);
    }
  };

  // Limpar busca
  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setPage(1);
  };

  // Alternar exibição do filtro de gêneros
  const toggleGenreFilter = () => {
    setShowGenreFilter(!showGenreFilter);
  };

  // Selecionar gênero
  const handleGenreSelect = (genre) => {
    // Se o mesmo gênero já estiver selecionado, limpar a seleção
    if (selectedGenre && selectedGenre.id === genre.id) {
      setSelectedGenre(null);
    } else {
      setSelectedGenre(genre);
    }
    setPage(1);
    setShowGenreFilter(false);
    // Se estiver em modo de busca, sair dele
    if (isSearching) {
      setIsSearching(false);
      setSearchQuery('');
    }
  };

  // Limpar filtro de gênero
  const clearGenreFilter = () => {
    setSelectedGenre(null);
    setPage(1);
  };

  // Fazer logout
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  // Alternar exibição de favoritos
  const toggleFavorites = () => {
    setShowFavorites(!showFavorites);
    if (showAI) setShowAI(false);
  };

  // Alternar exibição do assistente de IA
  const toggleAI = () => {
    setShowAI(!showAI);
    if (showFavorites) setShowFavorites(false);
  };

  // Renderizar os filmes
  const renderMovies = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando filmes...</p>
        </div>
      );
    }

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    if (movies.length === 0) {
      return <div className="no-results">Nenhum filme encontrado.</div>;
    }

    return (
      <div className="movies-grid">
        {movies.map(movie => (
          <MovieCard 
            key={movie.id} 
            movie={movie} 
            genres={genres}
            onSelect={() => handleMovieClick(movie)} 
          />
        ))}
      </div>
    );
  };

  // Renderizar paginação
  const renderPagination = () => {
    return (
      <div className="pagination">
        <button 
          className="pagination-button" 
          disabled={page === 1} 
          onClick={() => handlePageChange(page - 1)}
        >
          Anterior
        </button>
        
        <span className="page-info">
          Página {page} de {totalPages}
        </span>
        
        <button 
          className="pagination-button" 
          disabled={page === totalPages} 
          onClick={() => handlePageChange(page + 1)}
        >
          Próxima
        </button>
      </div>
    );
  };

  return (
    <div className="movie-library">
      {selectedMovie ? (
        <MovieDetails 
          movie={selectedMovie} 
          onBack={() => setSelectedMovie(null)} 
        />
      ) : showFavorites ? (
        <FavoriteMovies 
          onClose={() => setShowFavorites(false)} 
          onSelectMovie={setSelectedMovie} 
        />
      ) : (
        <>
          {showAI && <MovieAI onClose={() => setShowAI(false)} />}
          <header className="library-header">
            <div className="header-left">
              <h1>Lettercelo</h1>
            </div>
            <div className="header-right">
              <form className="search-bar" onSubmit={handleSearch}>
                <FaSearch className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Buscar filmes..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    type="button" 
                    className="clear-search" 
                    onClick={handleClearSearch}
                  >
                    <FaTimes />
                  </button>
                )}
                <button type="submit" className="search-button">
                  Buscar
                </button>
              </form>
              
              <div className="user-controls">
                <span className="user-email">{userEmail}</span>
                <button 
                  className={`favorites-button ${showFavorites ? 'active' : ''}`}
                  onClick={toggleFavorites} 
                  title="Meus Favoritos"
                >
                  <FaBookmark />
                  {favoritesCount > 0 && <span className="favorites-count">{favoritesCount}</span>}
                </button>
                <button 
                  className={`ai-button ${showAI ? 'active' : ''}`}
                  onClick={toggleAI} 
                  title="Assistente de Filmes IA"
                >
                  <FaRobot />
                </button>
                <button 
                  className="theme-toggle" 
                  title={`Modo ${darkMode ? 'Claro' : 'Escuro'}`}
                  onClick={toggleTheme}
                >
                  {darkMode ? <FaSun /> : <FaMoon />}
                </button>
                <button className="logout-button" onClick={handleLogout} title="Sair">
                  <FaSignOutAlt />
                </button>
              </div>
            </div>
          </header>
          
          <div className="library-controls">
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'popular' && !isSearching && !selectedGenre ? 'active' : ''}`}
                onClick={() => handleTabChange('popular')}
                disabled={loading}
              >
                <FaHeart /> Populares
              </button>
              <button 
                className={`tab ${activeTab === 'top_rated' && !isSearching && !selectedGenre ? 'active' : ''}`}
                onClick={() => handleTabChange('top_rated')}
                disabled={loading}
              >
                <FaStar /> Mais Votados
              </button>
              <button 
                className={`tab ${activeTab === 'upcoming' && !isSearching && !selectedGenre ? 'active' : ''}`}
                onClick={() => handleTabChange('upcoming')}
                disabled={loading}
              >
                <FaCalendarAlt /> Em Breve
              </button>
              
              <button 
                className="filter-button" 
                onClick={toggleGenreFilter}
                disabled={loading}
                title="Filtrar por Gênero"
              >
                <FaFilter />
              </button>
            </div>
            
            {isSearching && (
              <div className="search-indicator">
                <span>Resultados para: "{searchQuery}"</span>
                <button onClick={handleClearSearch} className="clear-search-small">
                  <FaTimes /> Limpar
                </button>
              </div>
            )}
            
            {selectedGenre && (
              <div className="genre-indicator">
                <span>Filtrando por gênero: {selectedGenre.name}</span>
                <button onClick={clearGenreFilter} className="clear-search-small">
                  <FaTimes /> Limpar
                </button>
              </div>
            )}
          </div>
          
          {renderMovies()}
          
          {!loading && movies.length > 0 && renderPagination()}
        </>
      )}
    </div>
  );
};

export default MovieLibrary;
