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
  getNetworkContent
} from '../services/tmdb';

const Home = () => {
  const { activeProfile, removeFromHistory, toggleWatchlist } = useUser();
  const historyList = activeProfile?.history ? Object.values(activeProfile.history).sort((a, b) => b.timestamp - a.timestamp) : [];

  return (
    <div className="home-dashboard">
      <Banner fetchFunction={() => getTrending('movie', 'day')} type="movie" />
      
      <div className="home-rows-container">
        {historyList.length > 0 && (
          <Row title="Continue Watching" dataList={historyList} onRemove={(item) => removeFromHistory(item.id)} />
        )}
        {activeProfile?.watchlist?.length > 0 && (
          <Row title="My List" dataList={activeProfile.watchlist} onRemove={(item) => toggleWatchlist(item)} />
        )}
        <Row title="NETFLIX ORIGINALS" fetchFunction={() => getNetworkContent(213, 'tv')} isLargeRow type="tv" />
        <Row title="AMAZON PRIME" fetchFunction={() => getNetworkContent(1024, 'tv')} isLargeRow type="tv" />
        <Row title="DISNEY+" fetchFunction={() => getNetworkContent(2739, 'tv')} isLargeRow type="tv" />
        <Row title="APPLE TV+" fetchFunction={() => getNetworkContent(3186, 'tv')} isLargeRow type="tv" />
        <Row title="HULU" fetchFunction={() => getNetworkContent(453, 'tv')} isLargeRow type="tv" />
        <Row title="HBO" fetchFunction={() => getNetworkContent(49, 'tv')} isLargeRow type="tv" />
        
        <Row title="Trending Now" fetchFunction={() => getTrending('all', 'week')} />
        <Row title="Top Rated Movies" fetchFunction={() => getTopRated('movie')} type="movie" />
        <Row title="Action Thrillers" fetchFunction={getActionMovies} type="movie" />
        <Row title="Comedies" fetchFunction={getComedyMovies} type="movie" />
        <Row title="Horror Flicks" fetchFunction={getHorrorMovies} type="movie" />
      </div>
    </div>
  );
};
export default Home;
