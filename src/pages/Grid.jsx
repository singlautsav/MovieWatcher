import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchFromTMDB } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import { ArrowLeft } from 'lucide-react';

const Grid = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  const endpoint = queryParams.get('endpoint');
  const title = queryParams.get('title') || 'Explore';
  const type = queryParams.get('type') || 'movie';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchResults = useCallback(async (pageNum = 1, append = false) => {
    if (!endpoint) return;
    setLoading(true);

    // If endpoint already has query params, we need to append page with &
    // otherwise with ?
    const separator = endpoint.includes('?') ? '&' : '?';
    const paginatedEndpoint = `${endpoint}${separator}page=${pageNum}`;

    const data = await fetchFromTMDB(paginatedEndpoint);

    if (data?.results) {
      setItems(prev => append ? [...prev, ...data.results] : data.results);
      setTotalPages(data.total_pages);
    }
    setLoading(false);
  }, [endpoint]);

  useEffect(() => {
    setPage(1);
    fetchResults(1, false);
  }, [fetchResults]);

  const loadMore = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchResults(nextPage, true);
    }
  };

  return (
    <div className="explore-page" style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '50px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', padding: '0 2rem' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', marginRight: '1rem', display: 'flex', alignItems: 'center' }}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ margin: 0 }}>{title}</h1>
      </div>

      {items.length > 0 ? (
        <>
          <div className="grid-layout" style={{ padding: '0 2rem' }}>
            {items.map((item, idx) => (
              <MovieCard key={`${item.id}-${idx}`} item={item} type={type} />
            ))}
          </div>
          {page < totalPages && (
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button className="btn" onClick={loadMore} disabled={loading}>
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      ) : loading ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
      ) : (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No results found.</div>
      )}
    </div>
  );
};

export default Grid;
