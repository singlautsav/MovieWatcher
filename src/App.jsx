import { Routes, Route } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Player from './pages/Player';
import LiveTV from './pages/LiveTV';
import Profiles from './pages/Profiles';
import Search from './pages/Search';
import Grid from './pages/Grid';

const AppContent = () => {
  const { activeProfile } = useUser();

  if (!activeProfile) {
    return <Profiles />;
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Home />} />
        <Route path="/tv" element={<Home />} />
        <Route path="/explore/:type" element={<Explore />} />
        <Route path="/search" element={<Search />} />
        <Route path="/grid" element={<Grid />} />
        <Route path="/play/:type/:id" element={<Player />} />
        <Route path="/live" element={<LiveTV />} />
      </Routes>
      <footer style={{ 
        textAlign: 'center', 
        padding: '2rem', 
        color: 'var(--text-muted)',
        fontSize: '0.9rem',
        letterSpacing: '1px'
      }}>
        Made with ❤️ for S
      </footer>
    </>
  );
};

function App() {
  return (
    <div className="app">
      <UserProvider>
        <AppContent />
      </UserProvider>
    </div>
  );
}

export default App;
