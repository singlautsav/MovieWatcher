const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const READ_ACCESS_TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3';

const fetchFromTMDB = async (endpoint, params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `${BASE_URL}${endpoint}${query ? `?${query}` : ''}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${READ_ACCESS_TOKEN}`
      }
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("TMDB Fetch Error:", error);
    return null;
  }
};

export const getTrending = (type = 'all', time = 'day') => fetchFromTMDB(`/trending/${type}/${time}`);
export const getPopular = (type = 'movie') => fetchFromTMDB(`/${type}/popular`);
export const getDetails = (type, id) => fetchFromTMDB(`/${type}/${id}`, { append_to_response: 'videos,credits,similar,external_ids,watch/providers' });
export const searchContent = (query, page = 1) => fetchFromTMDB(`/search/multi`, { query, page });
export const getSeasonDetails = (seriesId, seasonNumber) => fetchFromTMDB(`/tv/${seriesId}/season/${seasonNumber}`);
export const discoverContent = (type, params = {}) => fetchFromTMDB(`/discover/${type}`, params);
export const getGenres = (type) => fetchFromTMDB(`/genre/${type}/list`);

// Netflix-specific rows
export const getNetflixOriginals = () => fetchFromTMDB('/discover/tv', { with_networks: 213, sort_by: 'popularity.desc' });
export const getAmazonOriginals = () => fetchFromTMDB('/discover/tv', { with_networks: 1024, sort_by: 'popularity.desc' });
export const getTopRated = (type = 'movie') => fetchFromTMDB(`/${type}/top_rated`);
export const getActionMovies = () => fetchFromTMDB('/discover/movie', { with_genres: 28 });
export const getComedyMovies = () => fetchFromTMDB('/discover/movie', { with_genres: 35 });
export const getHorrorMovies = () => fetchFromTMDB('/discover/movie', { with_genres: 27 });
export const getRomanceMovies = () => fetchFromTMDB('/discover/movie', { with_genres: 10749 });
export const getDocumentaries = () => fetchFromTMDB('/discover/movie', { with_genres: 99 });
export const getNetworkContent = (networkId, type = 'tv') => fetchFromTMDB(`/discover/${type}`, { 
  with_networks: networkId, 
  sort_by: 'popularity.desc' 
});

export const getAnime = () => fetchFromTMDB('/discover/tv', { with_genres: 16, with_original_language: 'ja' });
