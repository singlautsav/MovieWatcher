import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from './MovieCard';
import { ChevronLeft, ChevronRight, ChevronRight as ChevronRightIcon } from 'lucide-react';

const Row = ({ title, fetchFunction, endpoint, dataList, isLargeRow, type, onRemove }) => {
  const [items, setItems] = useState([]);
  const rowRef = useRef(null);

  useEffect(() => {
    if (dataList) {
      setItems(dataList);
    } else if (fetchFunction) {
      fetchFunction().then(data => {
        if (data?.results) setItems(data.results);
      });
    }
  }, [fetchFunction, dataList]);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="row-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingRight: '2rem' }}>
        <h2 className="row-title" style={{ marginBottom: 0 }}>{title}</h2>
        {endpoint && (
          <Link 
            to={`/grid?endpoint=${encodeURIComponent(endpoint)}&title=${encodeURIComponent(title)}&type=${type || 'movie'}`}
            style={{ 
              color: 'var(--text-muted)', 
              fontSize: '0.9rem', 
              display: 'flex', 
              alignItems: 'center', 
              textDecoration: 'none',
              fontWeight: 600,
              paddingBottom: '0.5rem'
            }}
            className="see-all-link"
          >
            See All <ChevronRightIcon size={16} />
          </Link>
        )}
      </div>
      <div className="row-wrapper">
        <button className="slider-btn left" onClick={() => scroll('left')}>
          <ChevronLeft size={40} />
        </button>
        
        <div className="row-posters" ref={rowRef}>
          {items.map(item => (
            <MovieCard key={item.id} item={item} isLargeRow={isLargeRow} type={type} onRemove={onRemove ? () => onRemove(item) : undefined} />
          ))}
        </div>

        <button className="slider-btn right" onClick={() => scroll('right')}>
          <ChevronRight size={40} />
        </button>
      </div>
    </div>
  );
};
export default Row;
