import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDetails, getSeasonDetails } from '../services/tmdb';
import { ChevronLeft, Plus, Check, CheckCircle2 } from 'lucide-react';
import { useUser } from '../context/UserContext';
import MovieCard from '../components/MovieCard';

import { STREAM_PROVIDERS } from '../services/providers';

const Player = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  
  const [providerIndex, setProviderIndex] = useState(0);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [seasonData, setSeasonData] = useState(null);
  
  const [workingProviders, setWorkingProviders] = useState([]);
  const [probing, setProbing] = useState(true);

  const { toggleWatchlist, isInWatchlist, markWatched, getWatchedProgress } = useUser();
  const isSaved = isInWatchlist(Number(id));
  const progress = getWatchedProgress(id);

  useEffect(() => {
    getDetails(type, id).then(data => {
      setDetails(data);
      if (type === 'tv' && progress) {
        setSeason(progress.season || 1);
        setEpisode(progress.episode || 1);
      }
    });
  }, [type, id]);

  useEffect(() => {
    if (type === 'tv' && details) {
      getSeasonDetails(id, season).then(data => setSeasonData(data));
    }
  }, [type, id, season, details]);

  useEffect(() => {
    if (!details) return;
    
    const imdbId = details.imdb_id || details.external_ids?.imdb_id;
    const available = STREAM_PROVIDERS.filter(p => !p.reqImdb || imdbId);
    
    // Auto Probe Servers
    setProbing(true);
    setWorkingProviders([]);
    
    const probeServers = async () => {
      let foundFirst = false;
      const CHUNK_SIZE = 5;
      
      for (let i = 0; i < available.length; i += CHUNK_SIZE) {
        const chunk = available.slice(i, i + CHUNK_SIZE);
        await Promise.all(chunk.map(async (provider) => {
          const testUrl = provider.getUrl(type, id, imdbId, season, episode);
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);
            
            const res = await fetch(`/api/probe?url=${encodeURIComponent(testUrl)}`, { 
              signal: controller.signal 
            });
            clearTimeout(timeoutId);
            
            const data = await res.json();
            if (data.ok) {
              setWorkingProviders(prev => {
                const newArr = [...prev, provider];
                // Keep them sorted by original priority
                const sorted = available.filter(p => newArr.includes(p));
                
                let pref = null;
                try { pref = localStorage.getItem('preferredServer'); } catch(e) {}
                
                if (pref) {
                  const prefIdx = sorted.findIndex(p => p.name === pref);
                  if (prefIdx !== -1) {
                    setProviderIndex(prefIdx);
                  }
                }
                
                return sorted;
              });
              
              if (!foundFirst) {
                foundFirst = true;
                setProbing(false); // Unblock the UI instantly!
              }
            }
          } catch (err) {
            // Probe failed or timed out
          }
        }));
      }
      
      if (!foundFirst) {
        setProbing(false);
      }
    };
    
    probeServers();
  }, [details, type, id, season, episode]);

  // Automatically save to "Continue Watching" history when media loads
  useEffect(() => {
    if (details && !probing) {
      markWatched(details, type, season, episode);
    }
  }, [details, type, season, episode, probing]);

  if (!details || probing) return <div className="loading-text">Auto-Probing Streaming Servers...</div>;

  const imdbId = details.imdb_id || details.external_ids?.imdb_id;
  const currentProvider = workingProviders[providerIndex] || workingProviders[0];
  const iframeSrc = currentProvider ? currentProvider.getUrl(type, id, imdbId, season, episode) : '';

  const handleNextEpisode = () => {
    if (seasonData && episode < seasonData.episodes.length) {
      setEpisode(e => e + 1);
    } else {
      const nextSeason = details.seasons.find(s => s.season_number === season + 1);
      if (nextSeason) {
        setSeason(season + 1);
        setEpisode(1);
      } else {
        alert("No more episodes!");
      }
    }
  };

  return (
    <div className="player-page">
      <div className="player-header">
        <div className="player-title-section">
          <button className="btn back-btn" onClick={() => navigate(-1)}><ChevronLeft size={20} /> Back</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <h1>{details.title || details.name}</h1>
            <button className="btn" style={{ padding: '0.4rem 1rem', background: isSaved ? 'var(--primary)' : 'rgba(255,255,255,0.1)' }} onClick={() => toggleWatchlist({ ...details, media_type: type })}>
              {isSaved ? <><Check size={16}/> In My List</> : <><Plus size={16}/> Add to List</>}
            </button>
          </div>
          {type === 'tv' && <h3 style={{ color: 'var(--text-muted)' }}>Season {season} Episode {episode}</h3>}
        </div>
        
        <div className="server-selector" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>Server:</span>
          <select 
            className="custom-select" 
            value={providerIndex} 
            onChange={(e) => {
              const idx = Number(e.target.value);
              setProviderIndex(idx);
              if (workingProviders[idx]) {
                try {
                  localStorage.setItem('preferredServer', workingProviders[idx].name);
                } catch(err) {}
              }
            }}
            style={{ minWidth: '200px' }}
          >
            {workingProviders.map((p, idx) => (
              <option key={p.name} value={idx}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="video-container glass-panel">
        {workingProviders.length === 0 ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#000', color: 'var(--text-muted)' }}>
            <h2>No Streams Available</h2>
            <p style={{ marginTop: '1rem' }}>We scanned 37 servers, but this media is not available yet.</p>
          </div>
        ) : (
          <iframe 
            src={iframeSrc} 
            allowFullScreen 
            title="Video Player"
          ></iframe>
        )}
      </div>
      
      {(() => {
        const getOfficialProviders = () => {
          if (!details?.['watch/providers']?.results) return [];
          const results = details['watch/providers'].results;
          const targetRegions = ['IN', 'US', 'GB', 'DE', 'FR', 'CA', 'AU'];
          const providersMap = new Map();
          
          targetRegions.forEach(region => {
            if (results[region] && results[region].flatrate) {
              results[region].flatrate.forEach(p => {
                if (!providersMap.has(p.provider_id)) {
                  providersMap.set(p.provider_id, p);
                }
              });
            }
          });
          return Array.from(providersMap.values());
        };
        const officialProviders = getOfficialProviders();

        if (officialProviders.length === 0) return null;
        
        return (
          <div className="official-providers glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0, color: 'var(--text-muted)' }}>Watch Officially (IN/US/EU):</h3>
            {officialProviders.map(p => (
              <div key={p.provider_id} title={p.provider_name} style={{ width: '40px', height: '40px', borderRadius: '0.5rem', overflow: 'hidden' }}>
                <img src={`https://image.tmdb.org/t/p/w200${p.logo_path}`} alt={p.provider_name} style={{ width: '100%', height: '100%' }} />
              </div>
            ))}
          </div>
        );
      })()}

      {type === 'tv' && (
        <div className="tv-controls glass-panel">
          {(() => {
            // Calculate next episode logic
            if (!seasonData?.episodes || !progress) return null;
            let nextEp = null;
            let currentEpIndex = seasonData.episodes.findIndex(e => e.episode_number === progress.episode);
            
            if (progress.season === season && currentEpIndex !== -1 && currentEpIndex < seasonData.episodes.length - 1) {
              nextEp = seasonData.episodes[currentEpIndex + 1];
            } else if (progress.season === season && currentEpIndex === seasonData.episodes.length - 1) {
              // Usually implies next season, but we only have current season data loaded.
              // So we might not show it or just show a text "Next Season".
            }

            if (!nextEp) return null;

            return (
              <div className="up-next-banner">
                <div className="up-next-info">
                  <h4>Up Next</h4>
                  <h3>{nextEp.episode_number}. {nextEp.name || `Episode ${nextEp.episode_number}`}</h3>
                  <p>{nextEp.overview ? (nextEp.overview.length > 150 ? nextEp.overview.substring(0, 150) + '...' : nextEp.overview) : 'No description available.'}</p>
                </div>
                <div className="up-next-action">
                  <button className="btn" onClick={() => setEpisode(nextEp.episode_number)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    Play Episode {nextEp.episode_number}
                  </button>
                </div>
              </div>
            );
          })()}

          <div className="tv-controls-header">
            <h3>Episodes</h3>
            <button className="btn next-btn" onClick={handleNextEpisode}>Mark Watched & Next ⏭</button>
          </div>
          
          <div className="season-tabs">
            {details.seasons?.filter(s => s.season_number > 0).map(s => (
              <button 
                key={s.season_number} 
                className={`season-tab-btn ${s.season_number === season ? 'active' : ''}`}
                onClick={() => { setSeason(s.season_number); setEpisode(1); }}
              >
                Season {s.season_number}
              </button>
            ))}
          </div>

          <div className="episodes-grid">
            {seasonData?.episodes?.map(ep => {
              const isWatched = progress?.season > season || (progress?.season === season && progress?.episode >= ep.episode_number);
              return (
                <div
                  key={ep.episode_number}
                  className={`episode-card ${ep.episode_number === episode ? 'active' : ''}`}
                  onClick={() => setEpisode(ep.episode_number)}
                >
                  <div className="episode-thumbnail">
                    {ep.still_path ? (
                      <img src={`https://image.tmdb.org/t/p/w500${ep.still_path}`} alt={ep.name} loading="lazy" />
                    ) : (
                      <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a1a', color: '#555'}}>
                        No Image
                      </div>
                    )}
                    <div className="episode-number-badge">S{season} E{ep.episode_number}</div>
                    {isWatched && (
                      <div className="episode-watched-badge">
                        <CheckCircle2 size={12} /> Watched
                      </div>
                    )}
                  </div>
                  <div className="episode-info">
                    <h4 className="episode-title">{ep.episode_number}. {ep.name || `Episode ${ep.episode_number}`}</h4>
                    {ep.overview && <p className="episode-overview">{ep.overview}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
      
      {details?.similar?.results && details.similar.results.length > 0 && (
        <div className="recommendations-section">
          <h2>More Like This</h2>
          <div className="recommendations-slider">
            {details.similar.results.map(item => (
              <MovieCard key={item.id} item={item} type={type} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default Player;
