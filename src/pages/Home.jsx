import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Banner from '../components/Banner';
import Row from '../components/Row';
import { useUser } from '../context/UserContext';
import { 
  getNetflixOriginals, 
  getTrending, 
  getTopRated, 
  getActionMovies, 
  getComedyMovies, 
  getHorrorMovies,
  getNetworkContent,
  getBollywoodHits,
  getHollywoodBlockbusters,
  getRomanceMovies,
  getDocumentaries,
  getSciFiMovies,
  getCrimeMovies,
  getFamilyMovies,
  getAnimationMovies,
  getAnime,
  getKDramas,
  getSciFiTV,
  getRealityTV,
  getCrimeTV
} from '../services/tmdb';
import { generateRecommendations } from '../services/recommendations';

const Home = () => {
  const location = useLocation();
  const { activeProfile, removeFromHistory, toggleWatchlist } = useUser();
  const [recommendations, setRecommendations] = useState({ movies: [], tv: [] });

  const historyList = activeProfile?.history ? Object.values(activeProfile.history).sort((a, b) => b.timestamp - a.timestamp) : [];

  let mode = 'all';
  if (location.pathname === '/movies') mode = 'movie';
  if (location.pathname === '/tv') mode = 'tv';

  useEffect(() => {
    const fetchRecs = async () => {
      const recs = await generateRecommendations(activeProfile);
      setRecommendations(recs);
    };
    fetchRecs();
  }, [activeProfile]);

  return (
    <div className="home-dashboard">
      {/* Banner */}
      {mode === 'movie' && <Banner fetchFunction={() => getTrending('movie', 'day')} type="movie" />}
      {mode === 'tv' && <Banner fetchFunction={() => getTrending('tv', 'day')} type="tv" />}
      {mode === 'all' && <Banner fetchFunction={() => getTrending('all', 'day')} type="movie" />}
      
      <div className="home-rows-container">
        
        {/* User Specific Rows (Only on 'all' hub) */}
        {mode === 'all' && historyList.length > 0 && (
          <Row title="Continue Watching" dataList={historyList} onRemove={(item) => removeFromHistory(item.id)} />
        )}
        {mode === 'all' && activeProfile?.watchlist?.length > 0 && (
          <Row title="My List" dataList={activeProfile.watchlist} onRemove={(item) => toggleWatchlist(item)} />
        )}

        {/* Movies Hub */}
        {(mode === 'all' || mode === 'movie') && (
          <>
            {recommendations.movies.length > 0 && (
              <Row title="Movies You'd Love" dataList={recommendations.movies} type="movie" />
            )}
            <Row title="Trending Movies" fetchFunction={() => getTrending('movie', 'week')} endpoint="/trending/movie/week" type="movie" />
            <Row title="Top Rated Movies" fetchFunction={() => getTopRated('movie')} endpoint="/movie/top_rated" type="movie" />
            <Row title="Bollywood Hits" fetchFunction={getBollywoodHits} endpoint="/discover/movie?with_original_language=hi&sort_by=popularity.desc" type="movie" />
            <Row title="Hollywood Blockbusters" fetchFunction={getHollywoodBlockbusters} endpoint="/discover/movie?with_original_language=en&sort_by=popularity.desc" type="movie" />
            <Row title="Action Thrillers" fetchFunction={getActionMovies} endpoint="/discover/movie?with_genres=28" type="movie" />
            <Row title="Sci-Fi & Fantasy" fetchFunction={getSciFiMovies} endpoint="/discover/movie?with_genres=878" type="movie" />
            <Row title="Comedies" fetchFunction={getComedyMovies} endpoint="/discover/movie?with_genres=35" type="movie" />
            <Row title="Romance" fetchFunction={getRomanceMovies} endpoint="/discover/movie?with_genres=10749" type="movie" />
            <Row title="Crime Thrillers" fetchFunction={getCrimeMovies} endpoint="/discover/movie?with_genres=80" type="movie" />
            <Row title="Horror Flicks" fetchFunction={getHorrorMovies} endpoint="/discover/movie?with_genres=27" type="movie" />
            <Row title="Family Friendly" fetchFunction={getFamilyMovies} endpoint="/discover/movie?with_genres=10751" type="movie" />
            <Row title="Animation" fetchFunction={getAnimationMovies} endpoint="/discover/movie?with_genres=16" type="movie" />
            <Row title="Documentaries" fetchFunction={getDocumentaries} endpoint="/discover/movie?with_genres=99" type="movie" />
          </>
        )}

        {/* TV Shows Hub */}
        {(mode === 'all' || mode === 'tv') && (
          <>
            {recommendations.tv.length > 0 && (
              <Row title="TV Shows You'll Love" dataList={recommendations.tv} type="tv" />
            )}
            <Row title="Trending TV Shows" fetchFunction={() => getTrending('tv', 'week')} endpoint="/trending/tv/week" type="tv" />
            <Row title="NETFLIX ORIGINALS" fetchFunction={() => getNetworkContent(213, 'tv')} endpoint="/discover/tv?with_networks=213&sort_by=popularity.desc" isLargeRow type="tv" />
            <Row title="AMAZON PRIME" fetchFunction={() => getNetworkContent(1024, 'tv')} endpoint="/discover/tv?with_networks=1024&sort_by=popularity.desc" isLargeRow type="tv" />
            <Row title="HBO MAX" fetchFunction={() => getNetworkContent(49, 'tv')} endpoint="/discover/tv?with_networks=49&sort_by=popularity.desc" isLargeRow type="tv" />
            <Row title="APPLE TV+" fetchFunction={() => getNetworkContent(3186, 'tv')} endpoint="/discover/tv?with_networks=3186&sort_by=popularity.desc" isLargeRow type="tv" />
            <Row title="DISNEY+" fetchFunction={() => getNetworkContent(2739, 'tv')} endpoint="/discover/tv?with_networks=2739&sort_by=popularity.desc" isLargeRow type="tv" />
            <Row title="Sci-Fi & Fantasy TV" fetchFunction={getSciFiTV} endpoint="/discover/tv?with_genres=10765" type="tv" />
            <Row title="Anime Collection" fetchFunction={getAnime} endpoint="/discover/tv?with_genres=16&with_original_language=ja&sort_by=popularity.desc" type="tv" />
            <Row title="K-Dramas" fetchFunction={getKDramas} endpoint="/discover/tv?with_original_language=ko&sort_by=popularity.desc" type="tv" />
            <Row title="Crime TV" fetchFunction={getCrimeTV} endpoint="/discover/tv?with_genres=80" type="tv" />
            <Row title="Reality TV" fetchFunction={getRealityTV} endpoint="/discover/tv?with_genres=10764" type="tv" />
          </>
        )}
      </div>
    </div>
  );
};
export default Home;
