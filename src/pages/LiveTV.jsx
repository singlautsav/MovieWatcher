import { useEffect, useState, useRef } from 'react';
import Hls from 'hls.js';
import { getIndianChannels } from '../services/iptv';

const LiveTV = () => {
  const [channels, setChannels] = useState([]);
  const [filteredChannels, setFilteredChannels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const [activeChannel, setActiveChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    getIndianChannels().then(data => {
      setChannels(data);
      setFilteredChannels(data);
      
      const uniqueCats = [...new Set(data.map(c => c.category))].filter(Boolean);
      setCategories(['All', ...uniqueCats.sort()]);
      setLoading(false);
    });
    
    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
    };
  }, []);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredChannels(channels);
    } else {
      setFilteredChannels(channels.filter(c => c.category === selectedCategory));
    }
  }, [selectedCategory, channels]);

  const playChannel = (channel) => {
    setActiveChannel(channel);
    const m3u8Url = channel.url;

    if (!m3u8Url) {
      alert("Stream not available for this channel.");
      return;
    }

    if (videoRef.current) {
      if (Hls.isSupported()) {
        if (hlsRef.current) hlsRef.current.destroy();
        const hls = new Hls();
        hlsRef.current = hls;
        hls.loadSource(m3u8Url);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoRef.current.play().catch(e => console.log("Auto-play prevented", e));
        });
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = m3u8Url;
        videoRef.current.addEventListener('loadedmetadata', () => {
          videoRef.current.play();
        });
      }
    }
  };

  if (loading) return <div className="loading-text">Loading Live TV Channels...</div>;

  return (
    <div className="livetv-page">
      <div className="livetv-layout">
        <aside className="channel-list glass-panel">
          <h2>Live TV</h2>
          
          <select 
            value={selectedCategory} 
            onChange={e => setSelectedCategory(e.target.value)}
            className="custom-select"
            style={{ marginTop: '1rem', marginBottom: '1rem' }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <div className="channel-buttons">
            {filteredChannels.map(c => (
              <button 
                key={c.id || c.name} 
                className={`btn channel-btn ${activeChannel?.name === c.name ? 'active' : ''}`}
                onClick={() => playChannel(c)}
              >
                {c.name}
              </button>
            ))}
            {filteredChannels.length === 0 && <p>No channels found.</p>}
          </div>
        </aside>
        
        <div className="player-container glass-panel">
          {activeChannel ? (
            <>
              <h2 className="channel-title">{activeChannel.name}</h2>
              <div className="video-wrapper">
                <video ref={videoRef} controls></video>
              </div>
            </>
          ) : (
            <div className="placeholder-text">
              Select a channel from the list to start watching
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default LiveTV;
