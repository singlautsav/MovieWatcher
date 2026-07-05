import { createContext, useState, useEffect, useContext } from 'react';
import { loadUserData, saveUserData } from '../services/storage';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [data, setData] = useState(() => loadUserData() || { profiles: [] });
  const [activeProfileId, setActiveProfileIdState] = useState(() => localStorage.getItem('activeProfileId') || null);

  const setActiveProfileId = (id) => {
    setActiveProfileIdState(id);
    if (id) {
      localStorage.setItem('activeProfileId', id);
    } else {
      localStorage.removeItem('activeProfileId');
    }
  };

  const saveAndSet = (newData) => {
    setData(newData);
    saveUserData(newData);
  };

  const createProfile = (name, color) => {
    const newProfile = { id: Date.now().toString(), name, color, watchlist: [], history: {} };
    saveAndSet({ ...data, profiles: [...data.profiles, newProfile] });
  };

  const deleteProfile = (id) => {
    saveAndSet({ ...data, profiles: data.profiles.filter(p => p.id !== id) });
  };

  const activeProfile = data.profiles.find(p => p.id === activeProfileId);

  const toggleWatchlist = (item) => {
    if (!activeProfile) return;
    const isSaved = activeProfile.watchlist.find(w => w.id === item.id);
    let newWatchlist = isSaved 
      ? activeProfile.watchlist.filter(w => w.id !== item.id)
      : [...activeProfile.watchlist, item];
      
    const newProfiles = data.profiles.map(p => p.id === activeProfile.id ? { ...p, watchlist: newWatchlist } : p);
    saveAndSet({ ...data, profiles: newProfiles });
  };

  const isInWatchlist = (itemId) => {
    if (!activeProfile) return false;
    return !!activeProfile.watchlist.find(w => w.id === itemId);
  };

  const markWatched = (details, type, season, episode) => {
    if (!activeProfile || !details) return;
    const newHistory = { 
      ...activeProfile.history, 
      [`${details.id}`]: { 
        id: details.id,
        title: details.name || details.title,
        poster_path: details.poster_path,
        backdrop_path: details.backdrop_path,
        media_type: type,
        vote_average: details.vote_average,
        season, 
        episode,
        timestamp: Date.now()
      } 
    };
    const newProfiles = data.profiles.map(p => p.id === activeProfile.id ? { ...p, history: newHistory } : p);
    saveAndSet({ ...data, profiles: newProfiles });
  };

  const removeFromHistory = (mediaId) => {
    if (!activeProfile) return;
    const newHistory = { ...activeProfile.history };
    delete newHistory[`${mediaId}`];
    
    const newProfiles = data.profiles.map(p => p.id === activeProfile.id ? { ...p, history: newHistory } : p);
    saveAndSet({ ...data, profiles: newProfiles });
  };

  const getWatchedProgress = (mediaId) => {
    if (!activeProfile) return null;
    return activeProfile.history[`${mediaId}`] || null;
  };

  return (
    <UserContext.Provider value={{ 
      data, 
      activeProfile, 
      setActiveProfileId, 
      createProfile, 
      deleteProfile,
      toggleWatchlist, 
      isInWatchlist,
      markWatched,
      removeFromHistory,
      getWatchedProgress
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
