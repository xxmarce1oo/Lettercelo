import { useState, useEffect } from 'react';
import { FaStar, FaArrowLeft, FaCalendarAlt, FaClock, FaMoneyBillWave, FaVideo, FaUsers } from 'react-icons/fa';
import { fetchMovieDetails, getImageUrl } from '../../services/tmdbApi';
import './MovieDetails.css';

const MovieDetails = ({ movie, onBack }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMovieDetails = async () => {
      setLoading(true);
      try {
        const response = await fetchMovieDetails(movie.id);
        setDetails(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar detalhes do filme.');
        setLoading(false);
        console.error('Erro ao buscar detalhes do filme:', err);
      }
    };

    getMovieDetails();
  }, [movie.id]);

  // Formatar data
  const formatDate = (dateString) => {
    if (!dateString) return 'Data desconhecida';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Formatar duração
  const formatRuntime = (minutes) => {
    if (!minutes) return 'Duração desconhecida';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  // Formatar valor monetário
  const formatCurrency = (value) => {
    if (!value) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  if (loading) {
    return (
      <div className="movie-details-loading">
        <div className="loading-spinner"></div>
        <p>Carregando detalhes...</p>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="movie-details-error">
        <p>{error || 'Erro ao carregar detalhes do filme.'}</p>
        <button className="back-button" onClick={onBack}>
          <FaArrowLeft /> Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="movie-details">
      <button className="back-button" onClick={onBack}>
        <FaArrowLeft /> Voltar para a lista
      </button>

      <div className="movie-details-header">
        <div className="movie-backdrop">
          {details.backdrop_path ? (
            <img 
              src={getImageUrl(details.backdrop_path, 'w1280')} 
              alt={`Banner de ${details.title}`} 
            />
          ) : (
            details.poster_path ? (
              <img 
                src={getImageUrl(details.poster_path, 'w500')} 
                alt={`Poster de ${details.title}`} 
                className="fallback-poster"
              />
            ) : (
              <div className="no-backdrop">
                <span>Imagem não disponível</span>
              </div>
            )
          )}
          <div className="backdrop-overlay"></div>
        </div>

        <div className="movie-header-content">
          <div className="movie-poster-container">
            {details.poster_path ? (
              <img 
                src={getImageUrl(details.poster_path, 'w342')} 
                alt={`Poster de ${details.title}`} 
                className="detail-poster"
              />
            ) : (
              <div className="no-poster detail">
                <span>Sem imagem</span>
              </div>
            )}
          </div>

          <div className="movie-header-info">
            <h1>{details.title}</h1>
            {details.tagline && <p className="movie-tagline">"{details.tagline}"</p>}
            
            <div className="movie-meta">
              <div className="meta-item">
                <FaCalendarAlt />
                <span>{formatDate(details.release_date)}</span>
              </div>
              
              <div className="meta-item">
                <FaClock />
                <span>{formatRuntime(details.runtime)}</span>
              </div>
              
              <div className="meta-rating">
                <FaStar />
                <span>{details.vote_average.toFixed(1)}</span>
                <small>({details.vote_count} votos)</small>
              </div>
            </div>
            
            <div className="movie-genres">
              {details.genres.map(genre => (
                <span key={genre.id} className="genre-tag">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="movie-details-content">
        <div className="movie-overview">
          <h2>Sinopse</h2>
          <p>{details.overview || 'Sinopse não disponível.'}</p>
        </div>
        
        <div className="movie-stats">
          <div className="stat-item">
            <FaMoneyBillWave className="stat-icon" />
            <div className="stat-info">
              <h3>Orçamento</h3>
              <p>{formatCurrency(details.budget)}</p>
            </div>
          </div>
          
          <div className="stat-item">
            <FaMoneyBillWave className="stat-icon revenue" />
            <div className="stat-info">
              <h3>Receita</h3>
              <p>{formatCurrency(details.revenue)}</p>
            </div>
          </div>
          
          <div className="stat-item">
            <FaVideo className="stat-icon" />
            <div className="stat-info">
              <h3>Status</h3>
              <p>{details.status}</p>
            </div>
          </div>
          
          <div className="stat-item">
            <FaUsers className="stat-icon" />
            <div className="stat-info">
              <h3>Popularidade</h3>
              <p>{details.popularity.toFixed(1)}</p>
            </div>
          </div>
        </div>
        
        {details.credits && details.credits.cast && details.credits.cast.length > 0 && (
          <div className="movie-cast">
            <h2>Elenco Principal</h2>
            <div className="cast-list">
              {details.credits.cast.slice(0, 10).map(person => (
                <div key={person.id} className="cast-item">
                  {person.profile_path ? (
                    <img 
                      src={getImageUrl(person.profile_path, 'w185')} 
                      alt={person.name} 
                    />
                  ) : (
                    <div className="no-profile">
                      <span>{person.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="cast-info">
                    <h4>{person.name}</h4>
                    <p>{person.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {details.videos && details.videos.results && details.videos.results.length > 0 && (
          <div className="movie-videos">
            <h2>Vídeos</h2>
            <div className="videos-list">
              {details.videos.results
                .filter(video => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser'))
                .slice(0, 3)
                .map(video => (
                  <div key={video.id} className="video-item">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.key}`}
                      title={video.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                    <p>{video.name}</p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
