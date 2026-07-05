import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, Search } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';
  const [show, setShow] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setShow(true);
      else setShow(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`nav ${show ? "nav-black" : "nav-transparent"}`}>
      <Link to="/" className="logo">MOVIEWATCHER</Link>
      
      <div className={`nav-links ${menuOpen ? 'mobile-open' : ''}`}>
        <Link to="/" className={isActive('/')} onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/movies" className={isActive('/movies')} onClick={() => setMenuOpen(false)}>Movies</Link>
        <Link to="/tv" className={isActive('/tv')} onClick={() => setMenuOpen(false)}>TV Shows</Link>
        <Link to="/live" className={isActive('/live')} onClick={() => setMenuOpen(false)}>Live TV</Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to="/search" style={{ display: 'flex', alignItems: 'center' }}>
          <Search size={24} color="white" />
        </Link>
        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} color="white" /> : <Menu size={28} color="white" />}
        </button>
      </div>
    </nav>
  );
};
export default Navbar;
