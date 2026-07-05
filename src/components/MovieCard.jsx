import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Plus, Check, X } from 'lucide-react';

const MovieCard = ({ item, type, isLargeRow, onRemove }) => {
  const { toggleWatchlist, isInWatchlist } = useUser();
  const mediaType = item.media_type || type || 'movie';
  const saved = isInWatchlist(item.id);

  const imagePath = isLargeRow ? item.poster_path : (item.backdrop_path || item.poster_path);
  const imageUrl = imagePath 
    ? `https://image.tmdb.org/t/p/w500${imagePath}`
    : 'https://via.placeholder.com/500x280?text=No+Image';

  const handleToggle = (e) => {
    e.preventDefault();
    toggleWatchlist(item);
  };

  const handleRemove = (e) => {
    e.preventDefault();
    onRemove();
  };

  return (
    <Link to={`/play/${mediaType}/${item.id}`} className={`row-card ${isLargeRow ? 'row-card-large' : ''}`}>
      <div style={{ position: 'relative' }}>
        <img src={imageUrl} alt={item.title || item.name} loading="lazy" className="row-card-img" />
        
        {onRemove && (
          <button 
            onClick={handleRemove}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'rgba(0,0,0,0.6)',
              border: 'none',
              borderRadius: '50%',
              padding: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10
            }}
          >
            <X size={16} color="white" />
          </button>
        )}

        {item.season && item.episode && (
          <div style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            background: 'rgba(0,0,0,0.8)',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            S{item.season} E{item.episode}
          </div>
        )}
      </div>
      <div className="row-card-info">
        <h4>{item.title || item.name}</h4>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          <span className="rating">⭐ {item.vote_average?.toFixed(1) || 'NR'}</span>
          <button className="watchlist-btn" onClick={handleToggle}>
            {saved ? <Check size={18} color="white" /> : <Plus size={18} color="white" />}
          </button>
        </div>
      </div>
    </Link>
  );
};
export default MovieCard;
