import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info } from 'lucide-react';

const Banner = ({ fetchFunction, type }) => {
  const [movie, setMovie] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFunction().then(data => {
      if (data?.results) {
        // Pick a random movie from the results
        const randomItem = data.results[Math.floor(Math.random() * data.results.length)];
        setMovie(randomItem);
      }
    });
  }, [fetchFunction]);

  if (!movie) return <header className="banner" style={{ background: '#111' }}></header>;

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  return (
    <header className="banner" style={{
      backgroundImage: `url("https://image.tmdb.org/t/p/original${movie.backdrop_path}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center center'
    }}>
      <div className="banner-contents">
        <h1 className="banner-title">
          {movie.title || movie.name || movie.original_name}
        </h1>
        
        <div className="banner-buttons">
          <button className="banner-button play" onClick={() => navigate(`/play/${movie.media_type || type || 'movie'}/${movie.id}`)}>
            <Play fill="currentColor" size={20} /> Play
          </button>
          <button className="banner-button info">
            <Info size={20} /> More Info
          </button>
        </div>
        
        <h1 className="banner-description">
          {truncate(movie.overview, 150)}
        </h1>
      </div>
      <div className="banner-fadeBottom" />
    </header>
  );
};
export default Banner;
