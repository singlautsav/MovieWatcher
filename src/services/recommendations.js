import { fetchFromTMDB } from './tmdb';

export const generateRecommendations = async (profile) => {
  if (!profile) return { movies: [], tv: [] };

  const historyItems = Object.values(profile.history || {});
  const watchlistItems = profile.watchlist || [];

  const allItems = [...historyItems, ...watchlistItems];

  if (allItems.length === 0) {
    return { movies: [], tv: [] };
  }

  // Aggregate genres
  const genreCounts = {};
  allItems.forEach(item => {
    if (item.genre_ids && Array.isArray(item.genre_ids)) {
      item.genre_ids.forEach(id => {
        genreCounts[id] = (genreCounts[id] || 0) + 1;
      });
    }
  });

  // Sort genres by frequency
  const sortedGenres = Object.entries(genreCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([id]) => id);

  // If we don't have enough genre data, return empty
  if (sortedGenres.length === 0) {
    return { movies: [], tv: [] };
  }

  // Take top 3 genres to build a profile
  const topGenres = sortedGenres.slice(0, 3).join(',');

  // Fetch recommendations
  const [movieData, tvData] = await Promise.all([
    fetchFromTMDB('/discover/movie', {
      with_genres: topGenres,
      sort_by: 'popularity.desc',
      'vote_count.gte': 100,
      page: 1
    }),
    fetchFromTMDB('/discover/tv', {
      with_genres: topGenres,
      sort_by: 'popularity.desc',
      'vote_count.gte': 100,
      page: 1
    })
  ]);

  const existingIds = new Set(allItems.map(item => item.id));

  const filterAndFormat = (results, type) => {
    if (!results) return [];
    return results
      .filter(item => !existingIds.has(item.id))
      .map(item => ({ ...item, media_type: type }));
  };

  const recommendedMovies = filterAndFormat(movieData?.results, 'movie');
  const recommendedTV = filterAndFormat(tvData?.results, 'tv');

  // Shuffle arrays to keep it fresh
  const shuffle = (array) => array.sort(() => 0.5 - Math.random());

  return {
    movies: shuffle(recommendedMovies).slice(0, 20),
    tv: shuffle(recommendedTV).slice(0, 20)
  };
};
