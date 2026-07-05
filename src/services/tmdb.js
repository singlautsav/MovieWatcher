const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const READ_ACCESS_TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchFromTMDB = async (endpoint, params = {}) => {
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
export const getAnime = () => fetchFromTMDB('/discover/tv', { with_genres: 16, with_original_language: 'ja', sort_by: 'popularity.desc' });
export const getKDramas = () => fetchFromTMDB('/discover/tv', { with_original_language: 'ko', sort_by: 'popularity.desc' });

export const getNetworkContent = (networkId, type = 'tv') => fetchFromTMDB(`/discover/${type}`, { 
  with_networks: networkId, 
  sort_by: 'popularity.desc' 
});

// Region Specific
export const getBollywoodHits = () => fetchFromTMDB('/discover/movie', { with_original_language: 'hi', sort_by: 'popularity.desc' });
export const getHollywoodBlockbusters = () => fetchFromTMDB('/discover/movie', { with_original_language: 'en', sort_by: 'popularity.desc' });

// More Movie Genres
export const getSciFiMovies = () => fetchFromTMDB('/discover/movie', { with_genres: 878 });
export const getCrimeMovies = () => fetchFromTMDB('/discover/movie', { with_genres: 80 });
export const getFamilyMovies = () => fetchFromTMDB('/discover/movie', { with_genres: 10751 });
export const getAnimationMovies = () => fetchFromTMDB('/discover/movie', { with_genres: 16 });

// More TV Genres
export const getSciFiTV = () => fetchFromTMDB('/discover/tv', { with_genres: 10765 });
export const getRealityTV = () => fetchFromTMDB('/discover/tv', { with_genres: 10764 });
export const getCrimeTV = () => fetchFromTMDB('/discover/tv', { with_genres: 80 });
