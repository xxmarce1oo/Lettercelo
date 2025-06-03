import React, { useState, useEffect, useRef } from 'react';
import { FaRobot, FaPaperPlane, FaTimes, FaSearch, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import './MovieAI.css';
import { searchMovies, fetchMovieDetails } from '../../services/tmdbApi';

const MovieAI = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  // O estado da conversa agora é a ÚNICA fonte da verdade.
  const [conversation, setConversation] = useState([]);
  
  const movieCache = useRef(new Map());
  const conversationEndRef = useRef(null); // Ref para o final da conversa

  const GEMINI_API_KEY = 'AIzaSyCpE9o29rtAdWHXaC053o3kb6WZVqh1_Bw'; 
  const MODEL_NAME = 'gemini-1.5-flash-latest';
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`;

  // Efeito para rolar para o final da conversa sempre que ela for atualizada
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, loading]);

  useEffect(() => {
    setConversation([
      { role: 'assistant', type: 'text', content: 'Olá! Sou seu assistente de filmes. Peça uma recomendação e me diga o que achou!' }
    ]);
  }, []);

  const searchAndDisplayMovie = async (movieName) => {
    const cachedMovie = movieName.toLowerCase();
    if (movieCache.current.has(cachedMovie)) {
      return movieCache.current.get(cachedMovie);
    }
    try {
      const resultsResponse = await searchMovies(movieName);
      const results = resultsResponse.data.results;
      if (results && results.length > 0) {
        const bestResult = { ...results[0], rating: null }; // Adiciona estado de avaliação
        movieCache.current.set(cachedMovie, bestResult);
        return bestResult;
      }
      return null;
    } catch (error) {
      console.error(`Erro ao buscar "${movieName}":`, error);
      return null;
    }
  };

  const handleMovieClick = async (movie) => {
    // Implementação de detalhes pode ser adicionada aqui se desejado
    console.log("Clicou para ver detalhes de:", movie.title);
  };

  // NOVA FUNÇÃO: Lida com a avaliação do usuário
  const handleRating = (messageIndex, movieIndex, rating) => {
    const newConversation = [...conversation];
    const recommendationMessage = newConversation[messageIndex];
    const ratedMovie = recommendationMessage.movies[movieIndex];

    // Evita re-avaliar
    if (ratedMovie.rating) return;

    ratedMovie.rating = rating; // 'liked' ou 'disliked'
    
    const feedbackMessage = rating === 'liked' 
      ? `Ótimo! Fico feliz que você gostou de "${ratedMovie.title}". Vou lembrar disso. 👍`
      : `Entendido. Anotei que você não curtiu "${ratedMovie.title}". Vou tentar algo diferente. 👎`;
    
    // Adiciona o feedback como uma nova mensagem na conversa
    newConversation.push({ role: 'assistant', type: 'text', content: feedbackMessage });

    setConversation(newConversation);
  };

  // No seu arquivo MovieAI.jsx, substitua esta função inteira:

// No seu arquivo MovieAI.jsx, substitua esta função:

const getAiRecommendations = async (userQuery, history) => {
  // O novo prompt super eficaz que criamos juntos!
  const extractionPrompt = `
    [PERSONA E OBJETIVO]
    Você é um assistente de cinema especialista e conciso. Seu objetivo principal é recomendar 5 filmes que correspondam precisamente às preferências do usuário, priorizando obras novas e relevantes.

    [CONTEXTO FORNECIDO]
    - PEDIDO ATUAL DO USUÁRIO: "${userQuery}"
    - HISTÓRICO DA CONVERSA: O histórico completo da conversa está sendo fornecido. Use-o para entender o contexto, as preferências implícitas e o feedback do usuário (👍/👎).

    [REGRAS DE EXECUÇÃO]
    1.  **NÃO REPETIR:** Esta é a regra mais importante. NÃO recomende filmes que já foram mencionados ou recomendados no HISTÓRICO DA CONVERSA. O usuário sempre espera sugestões novas.
    2.  **ANÁLISE PROFUNDA:** Analise cuidadosamente o PEDIDO ATUAL e o HISTÓRICO para entender todos os detalhes, como gênero, humor, atores, diretores e ano. Interprete nuances para inferir as melhores recomendações.
    3.  **SELEÇÃO DE FILMES:** Selecione 5 filmes que se encaixem perfeitamente nos critérios. Os filmes devem ser relevantes para o público de língua portuguesa.
    4.  **RELEVÂNCIA:** Priorize filmes lançados nos últimos anos (2020 em diante), a menos que o usuário peça especificamente por um período diferente (ex: "filmes dos anos 90").

    [FORMATO DE SAÍDA OBRIGATÓRIO]
    - Sua ÚNICA resposta deve ser um array JSON contendo os títulos dos 5 filmes em português.
    - Não adicione nenhuma outra palavra, explicação, ou formatação de markdown.
    - Exemplo de formato de saída: ["Título do Filme 1", "Título do Filme 2", "Título do Filme 3", "Título do Filme 4", "Título do Filme 5"]
  `;

  try {
    const contents = history.map(msg => {
      let messageText = '';
      if (msg.type === 'recommendation' && msg.movies) {
        const movieTitles = msg.movies.map(movie => movie.title).join(', ');
        messageText = `Filmes recomendados anteriormente: ${movieTitles}`;
      } else {
        messageText = msg.content;
      }
      return { role: msg.role === 'user' ? 'user' : 'model', parts: [{ text: messageText }] };
    });
    
    contents.push({ role: 'user', parts: [{ text: extractionPrompt }] });
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents, generationConfig: { temperature: 0.7 } })
    });

    if (!response.ok) throw new Error(`Erro na API Gemini: ${response.status}`);
    const data = await response.json();
    if (!data.candidates) throw new Error('Resposta da IA em formato inesperado.');
    
    const rawText = data.candidates[0].content.parts[0].text;
    const match = rawText.match(/\[.*\]/s);
    
    if (match && match[0]) {
      const movieTitles = JSON.parse(match[0]);
      if (movieTitles && movieTitles.length > 0) {
        const searchPromises = movieTitles.map(title => searchAndDisplayMovie(title));
        const foundMovies = (await Promise.all(searchPromises)).filter(Boolean);
        setConversation(prev => [...prev, { role: 'assistant', type: 'recommendation', movies: foundMovies }]);
      } else {
        throw new Error('A IA retornou um array vazio.');
      }
    } else {
      setConversation(prev => [...prev, { role: 'assistant', type: 'text', content: rawText }]);
    }
  } catch (error) {
    console.error('Falha ao obter recomendações da IA:', error);
    setConversation(prev => [...prev, { role: 'assistant', type: 'text', content: 'Desculpe, não consegui gerar recomendações no momento.' }]);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const userMessage = { role: 'user', type: 'text', content: query };
    setConversation(prev => [...prev, userMessage]);
    setLoading(true);

    const currentQuery = query;
    setQuery('');
    
    const historyForApi = [...conversation, userMessage].slice(0, -1);
    await getAiRecommendations(currentQuery, historyForApi);
    
    setLoading(false);
  };

  return (
    <div className="movie-ai-container">
      <div className="movie-ai-header">
        <div className="movie-ai-title"><FaRobot className="ai-icon" /><h3>Assistente de Filmes</h3></div>
        <button className="close-button" onClick={onClose}><FaTimes /></button>
      </div>
      
      <div className="conversation-container">
        {conversation.map((message, msgIndex) => {
          if (message.type === 'text') {
            return (
              <div key={msgIndex} className={`message ${message.role}`}>
                {message.role === 'assistant' && <FaRobot className="message-icon" />}
                <div className="message-content">{message.content}</div>
              </div>
            );
          }
          if (message.type === 'recommendation') {
            return (
              <div key={msgIndex} className="recommendation-group">
                <div className="message assistant">
                  <FaRobot className="message-icon" />
                  <div className="message-content">Encontrei estas sugestões para você:</div>
                </div>
                <div className="search-results">
                  {message.movies.map((movie, movieIndex) => (
                    <div key={movie.id} className="search-result-item">
                      <div className="movie-poster" onClick={() => handleMovieClick(movie)}>
                        {movie.poster_path ? (
                          <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} alt={movie.title} />
                        ) : (
                          <div className="no-poster"><FaSearch /></div>
                        )}
                      </div>
                      <div className="movie-info">
                        <h4>{movie.title} ({movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'})</h4>
                        <div className="movie-rating-actions">
                          <button 
                            onClick={() => handleRating(msgIndex, movieIndex, 'liked')} 
                            className={`rating-btn like ${movie.rating === 'liked' ? 'selected' : ''}`}
                            disabled={!!movie.rating}
                          >
                            <FaThumbsUp />
                          </button>
                          <button 
                            onClick={() => handleRating(msgIndex, movieIndex, 'disliked')} 
                            className={`rating-btn dislike ${movie.rating === 'disliked' ? 'selected' : ''}`}
                            disabled={!!movie.rating}
                          >
                            <FaThumbsDown />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          return null;
        })}

        {loading && <div className="message assistant loading"><FaRobot className="message-icon" /><div className="loading-dots"><span></span><span></span><span></span></div></div>}
        
        <div ref={conversationEndRef} />
      </div>
      
      <form className="query-form" onSubmit={handleSubmit}>
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Peça uma recomendação..." disabled={loading} />
        <button type="submit" disabled={loading}><FaPaperPlane /></button>
      </form>
    </div>
  );
};

export default MovieAI;