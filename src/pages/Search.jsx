import { useState, useEffect, useRef } from 'react';
import { searchContent } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import { Search as SearchIcon, X } from 'lucide-react';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const inputRef = useRef(null);

  useEffect(() => {
    // Auto focus the search input when the page loads
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const fetchResults = async (searchQuery, pageNum = 1, append = false) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    
    setLoading(true);
    const data = await searchContent(searchQuery, pageNum);
    
    if (data?.results) {
      // Filter out people, only keep movies and tv shows
      const filtered = data.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv');
      setResults(prev => append ? [...prev, ...filtered] : filtered);
      setTotalPages(data.total_pages);
    }
    setLoading(false);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      fetchResults(query, 1, false);
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const loadMore = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchResults(query, nextPage, true);
    }
  };

  return (
    <div className="explore-page" style={{ minHeight: '100vh', paddingTop: '100px' }}>
      <div className="explore-header" style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
        <div className="search-bar" style={{ width: '100%', maxWidth: '600px', display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.1)', borderRadius: '30px', padding: '0.5rem 1.5rem', border: '1px solid rgba(255,255,255,0.2)' }}>
          <SearchIcon size={20} color="var(--text-muted)" style={{ marginRight: '1rem' }} />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Search for movies, TV shows..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', outline: 'none' }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <X size={20} color="var(--text-muted)" />
            </button>
          )}
        </div>
      </div>

      {loading && page === 1 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Searching...</div>
      ) : results.length > 0 ? (
        <>
          <div className="grid-layout">
            {results.map((item) => (
              <MovieCard key={`${item.media_type}-${item.id}`} movie={item} type={item.media_type} />
            ))}
          </div>
          {page < totalPages && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button className="btn" onClick={loadMore} disabled={loading}>
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      ) : query.trim() !== '' ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <h2>No results found for "{query}"</h2>
          <p>Try checking your spelling or using more general terms.</p>
        </div>
      ) : (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '4rem' }}>
          <SearchIcon size={64} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <h2>What do you want to watch?</h2>
        </div>
      )}
    </div>
  );
};

export default Search;
