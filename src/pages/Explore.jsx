import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { discoverContent, searchContent, getGenres } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import { Search, Filter, Star, X } from 'lucide-react';

const Explore = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [genres, setGenres] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [isSearchMode, setIsSearchMode] = useState(false);
  
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    getGenres(type || 'movie').then(data => {
      if (data?.genres) setGenres(data.genres);
    });
  }, [type]);

  const fetchResults = useCallback(async (pageNum = 1, append = false) => {
    setLoading(true);
    let data;
    
    if (isSearchMode && searchQuery.trim() !== '') {
      data = await searchContent(searchQuery, pageNum);
    } else {
      const params = {
        page: pageNum,
        sort_by: sortBy,
        'vote_average.gte': minRating,
        ...(selectedGenre ? { with_genres: selectedGenre } : {})
      };
      data = await discoverContent(type || 'movie', params);
    }

    if (data?.results) {
      setItems(prev => append ? [...prev, ...data.results] : data.results);
      setTotalPages(data.total_pages);
    }
    setLoading(false);
  }, [type, isSearchMode, searchQuery, sortBy, minRating, selectedGenre]);

  useEffect(() => {
    setPage(1);
    fetchResults(1, false);
  }, [fetchResults]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchMode(true);
      setPage(1);
      fetchResults(1, false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearchMode(false);
    setPage(1);
  };

  const loadMore = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchResults(nextPage, true);
    }
  };

  return (
    <div className="explore-page">
      <div className="explore-header">
        <h1>{isSearchMode ? `Search Results` : `Explore ${type === 'tv' ? 'TV Shows' : 'Movies'}`}</h1>

        <form onSubmit={handleSearchSubmit} className="search-bar">
          <input 
            type="text" 
            placeholder="Search movies, tv shows..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">
            <Search size={20} />
          </button>
        </form>
      </div>

      {!isSearchMode && (
        <button className="mobile-filter-toggle btn" onClick={() => setShowMobileFilters(true)}>
          <Filter size={20} /> Filters
        </button>
      )}

      <div className="explore-layout">
        {!isSearchMode && (
          <>
            <div className={`filters-overlay ${showMobileFilters ? 'active' : ''}`} onClick={() => setShowMobileFilters(false)}></div>
            <aside className={`filters-sidebar glass-panel ${showMobileFilters ? 'mobile-open' : ''}`}>
              <div className="filter-header-mobile">
                <h3>Filters</h3>
                <button onClick={() => setShowMobileFilters(false)} className="close-btn"><X size={24} /></button>
              </div>

              <div className="filter-group">
                <label>Sort By</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="custom-select">
                  <option value="popularity.desc">Popularity (Desc)</option>
                  <option value="popularity.asc">Popularity (Asc)</option>
                  <option value="vote_average.desc">Rating (Desc)</option>
                  <option value="primary_release_date.desc">Newest First</option>
                  <option value="primary_release_date.asc">Oldest First</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Genre</label>
                <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} className="custom-select">
                  <option value="">All Genres</option>
                  {genres.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="range-label">
                  <span>Min Rating</span>
                  <span><Star size={14} fill="gold" color="gold" /> {minRating}+</span>
                </label>
                <input 
                  type="range" 
                  min="0" max="10" step="1" 
                  value={minRating} 
                  onChange={(e) => setMinRating(e.target.value)} 
                  className="custom-range"
                />
              </div>
            </aside>
          </>
        )}

        <div className="explore-content">
          {isSearchMode && (
            <div style={{ marginBottom: '2rem' }}>
              <button className="btn" onClick={clearSearch}>← Back to Explore</button>
            </div>
          )}

          {items.length === 0 && !loading ? (
            <div className="no-results glass-panel">
              <h2>No results found</h2>
              <p>Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <>
              <div className="grid-layout">
                {items.map(item => (
                  <MovieCard key={item.id} item={item} type={item.media_type || type} />
                ))}
              </div>
              
              {loading && <div className="loading-text">Loading...</div>}
              
              {!loading && page < totalPages && (
                <div className="load-more-container">
                  <button className="btn" onClick={loadMore}>Load More</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default Explore;
