export const STREAM_PROVIDERS = [
  { 
    name: 'VidFast (Premium)', 
    reqImdb: false, 
    isWrapper: false,
    getUrl: (type, tmdb, imdb, s, e) => type === 'movie' 
      ? `https://vidfast.pro/movie/${tmdb}?autoPlay=true&theme=e50914&title=false&hideServer=false` 
      : `https://vidfast.pro/tv/${tmdb}/${s}/${e}?autoPlay=true&theme=e50914&nextButton=true&autoNext=true&title=false` 
  },
  { 
    name: 'VidSrc.to', 
    reqImdb: false, 
    isWrapper: true,
    getUrl: (type, tmdb, imdb, s, e) => type === 'movie' 
      ? `https://vidsrc.to/embed/movie/${tmdb}` 
      : `https://vidsrc.to/embed/tv/${tmdb}/${s}/${e}` 
  },
  { 
    name: 'VidSrc.me', 
    reqImdb: true, 
    isWrapper: true,
    getUrl: (type, tmdb, imdb, s, e) => type === 'movie' 
      ? `https://vidsrc.me/embed/${imdb}/` 
      : `https://vidsrc.me/embed/${imdb}/${s}-${e}/` 
  },
  { 
    name: 'VidSrc.pm', 
    reqImdb: false, 
    isWrapper: true,
    getUrl: (type, tmdb, imdb, s, e) => type === 'movie' 
      ? `https://vidsrc.pm/embed/movie/${tmdb}` 
      : `https://vidsrc.pm/embed/tv/${tmdb}/${s}/${e}` 
  },
  { 
    name: 'VidSrc.cc', 
    reqImdb: false, 
    isWrapper: true,
    getUrl: (type, tmdb, imdb, s, e) => type === 'movie' 
      ? `https://vidsrc.cc/v2/embed/movie/${tmdb}` 
      : `https://vidsrc.cc/v2/embed/tv/${tmdb}/${s}/${e}` 
  },
  { 
    name: 'VidSrc.icu', 
    reqImdb: false, 
    isWrapper: true,
    getUrl: (type, tmdb, imdb, s, e) => type === 'movie' 
      ? `https://vidsrc.icu/embed/movie/${tmdb}` 
      : `https://vidsrc.icu/embed/tv/${tmdb}/${s}/${e}` 
  },
  { 
    name: 'VidSrc.rip', 
    reqImdb: false, 
    isWrapper: true,
    getUrl: (type, tmdb, imdb, s, e) => type === 'movie' 
      ? `https://vidsrc.rip/embed/movie/${tmdb}` 
      : `https://vidsrc.rip/embed/tv/${tmdb}/${s}/${e}` 
  },
  { 
    name: 'Vidlink.pro', 
    reqImdb: false, 
    isWrapper: false,
    getUrl: (type, tmdb, imdb, s, e) => type === 'movie' 
      ? `https://vidlink.pro/movie/${tmdb}` 
      : `https://vidlink.pro/tv/${tmdb}/${s}/${e}` 
  },
  { 
    name: '2Embed.cc', 
    reqImdb: false, 
    isWrapper: false,
    getUrl: (type, tmdb, imdb, s, e) => type === 'movie' 
      ? `https://streamsrcs.2embed.cc/vnest?tmdb=${tmdb}` 
      : `https://streamsrcs.2embed.cc/xps-tv?tmdb=${tmdb}&s=${s}&e=${e}` 
  },
  { 
    name: '2Embed.skin', 
    reqImdb: false, 
    isWrapper: false,
    getUrl: (type, tmdb, imdb, s, e) => type === 'movie' 
      ? `https://streamsrcs.2embed.cc/vnest?tmdb=${tmdb}` 
      : `https://streamsrcs.2embed.cc/xps-tv?tmdb=${tmdb}&s=${s}&e=${e}` 
  },
  { 
    name: '2Embed.org', 
    reqImdb: false, 
    isWrapper: false,
    getUrl: (type, tmdb, imdb, s, e) => type === 'movie' 
      ? `https://streamsrcs.2embed.cc/vnest?tmdb=${tmdb}` 
      : `https://streamsrcs.2embed.cc/xps-tv?tmdb=${tmdb}&s=${s}&e=${e}` 
  },
  { 
    name: 'AutoEmbed.co', 
    reqImdb: false, 
    isWrapper: false,
    getUrl: (type, tmdb, imdb, s, e) => type === 'movie' 
      ? `https://autoembed.co/movie/tmdb/${tmdb}` 
      : `https://autoembed.co/tv/tmdb/${tmdb}-${s}-${e}` 
  },
  { 
    name: 'Embed.su', 
    reqImdb: false, 
    isWrapper: true,
    getUrl: (type, tmdb, imdb, s, e) => type === 'movie' 
      ? `https://embed.su/embed/movie/${tmdb}` 
      : `https://embed.su/embed/tv/${tmdb}/${s}/${e}` 
  },
  { 
    name: 'SuperEmbed', 
    reqImdb: false, 
    isWrapper: false,
    getUrl: (type, tmdb, imdb, s, e) => type === 'movie' 
      ? `https://multiembed.mov/?video_id=${tmdb}&tmdb=1` 
      : `https://multiembed.mov/?video_id=${tmdb}&tmdb=1&s=${s}&e=${e}` 
  },
  { 
    name: 'MoviesAPI.to', 
    reqImdb: false, 
    isWrapper: false,
    getUrl: (type, tmdb, imdb, s, e) => type === 'movie' 
      ? `https://moviesapi.to/movie/${tmdb}` 
      : `https://moviesapi.to/tv/${tmdb}-${s}-${e}` 
  },
  { 
    name: 'MoviesAPI.club', 
    reqImdb: false, 
    isWrapper: false,
    getUrl: (type, tmdb, imdb, s, e) => type === 'movie' 
      ? `https://moviesapi.club/movie/${tmdb}` 
      : `https://moviesapi.club/tv/${tmdb}-${s}-${e}` 
  },
  { 
    name: 'SmashyStream', 
    reqImdb: false, 
    isWrapper: false,
    getUrl: (type, tmdb, imdb, s, e) => type === 'movie' 
      ? `https://player.smashy.stream/movie/${tmdb}` 
      : `https://player.smashy.stream/tv/${tmdb}?s=${s}&e=${e}` 
  },
  { 
    name: 'NontonGo', 
    reqImdb: false, 
    isWrapper: false,
    getUrl: (type, tmdb, imdb, s, e) => type === 'movie' 
      ? `https://nontongo.win/embed/movie/${tmdb}` 
      : `https://nontongo.win/embed/tv/${tmdb}/${s}/${e}` 
  },
  { 
    name: 'VidCore', 
    reqImdb: false, 
    isWrapper: false,
    getUrl: (type, tmdb, imdb, s, e) => type === 'movie' 
      ? `https://vidcore.org/embed/movie/${tmdb}` 
      : `https://vidcore.org/embed/tv/${tmdb}/${s}/${e}` 
  },
  { 
    name: 'GdrivePlayer', 
    reqImdb: false, 
    isWrapper: false,
    getUrl: (type, tmdb, imdb, s, e) => type === 'movie' 
      ? `https://databasegdriveplayer.co/player.php?type=movie&tmdb=${tmdb}` 
      : `https://databasegdriveplayer.co/player.php?type=series&tmdb=${tmdb}&season=${s}&episode=${e}` 
  },
  { 
    name: '2Embed.ru', 
    reqImdb: true, 
    isWrapper: false,
    getUrl: (type, tmdb, imdb, s, e) => type === 'movie' 
      ? `https://2embed.ru/embed/imdb/movie?id=${imdb}` 
      : `https://2embed.ru/embed/imdb/series?id=${imdb}&season=${s}&episode=${e}` 
  },
  { 
    name: 'VidSync', 
    reqImdb: false, 
    isWrapper: false,
    getUrl: (type, tmdb, imdb, s, e) => type === 'movie' 
      ? `https://vidsync.xyz/embed/movie/${tmdb}?autoPlay=false&theme=e50914` 
      : `https://vidsync.xyz/embed/tv/${tmdb}/${s}/${e}?autoPlay=false&theme=e50914` 
  },
  { 
    name: 'VidKing', 
    reqImdb: false, 
    isWrapper: false,
    getUrl: (type, tmdb, imdb, s, e) => type === 'movie' 
      ? `https://www.vidking.net/embed/movie/${tmdb}?autoPlay=false` 
      : `https://www.vidking.net/embed/tv/${tmdb}/${s}/${e}?autoPlay=false` 
  },
  { 
    name: '111Movies', 
    reqImdb: false, 
    isWrapper: false,
    getUrl: (type, tmdb, imdb, s, e) => type === 'movie' 
      ? `https://111movies.net/movie/${tmdb}` 
      : `https://111movies.net/tv/${tmdb}/${s}/${e}` 
  },
  { 
    name: 'Airflix', 
    reqImdb: false, 
    isWrapper: false,
    getUrl: (type, tmdb, imdb, s, e) => type === 'movie' 
      ? `https://airflix1.com/embed/movie/${tmdb}` 
      : `https://airflix1.com/embed/tv/${tmdb}/${s}/${e}` 
  },
  { 
    name: 'Hexa', 
    reqImdb: false, 
    isWrapper: false,
    getUrl: (type, tmdb, imdb, s, e) => type === 'movie' 
      ? `https://hexa.su/watch/movie/${tmdb}` 
      : `https://hexa.su/watch/tv/${tmdb}/${s}/${e}` 
  },
  { 
    name: 'MappleTV', 
    reqImdb: false, 
    isWrapper: false,
    getUrl: (type, tmdb, imdb, s, e) => type === 'movie' 
      ? `https://mappletv.uk/watch/movie/${tmdb}` 
      : `https://mappletv.uk/watch/tv/${tmdb}/${s}/${e}` 
  },
  { 
    name: 'Peachify', 
    reqImdb: false, 
    isWrapper: false,
    getUrl: (type, tmdb, imdb, s, e) => type === 'movie' 
      ? `https://peachify.top/embed/movie/${tmdb}` 
      : `https://peachify.top/embed/tv/${tmdb}/${s}/${e}` 
  },
  { 
    name: 'Videasy', 
    reqImdb: false, 
    isWrapper: false,
    getUrl: (type, tmdb, imdb, s, e) => type === 'movie' 
      ? `https://player.videasy.net/movie/${tmdb}` 
      : `https://player.videasy.net/tv/${tmdb}/${s}/${e}` 
  },
  { 
    name: 'Vidzee', 
    reqImdb: false, 
    isWrapper: false,
    getUrl: (type, tmdb, imdb, s, e) => type === 'movie' 
      ? `https://player.vidzee.wtf/embed/movie/${tmdb}` 
      : `https://player.vidzee.wtf/embed/tv/${tmdb}/${s}/${e}` 
  },
  { 
    name: 'Rivestream', 
    reqImdb: false, 
    isWrapper: false,
    getUrl: (type, tmdb, imdb, s, e) => type === 'movie' 
      ? `https://rivestream.org/embed?type=movie&id=${tmdb}` 
      : `https://rivestream.org/embed?type=tv&id=${tmdb}&season=${s}&episode=${e}` 
  },
  { 
    name: 'Vidlux', 
    reqImdb: false, 
    isWrapper: false,
    getUrl: (type, tmdb, imdb, s, e) => type === 'movie' 
      ? `https://vidlux.xyz/embed/movie/${tmdb}` 
      : `https://vidlux.xyz/embed/tv/${tmdb}/${s}/${e}` 
  },
  { 
    name: 'Vidora', 
    reqImdb: false, 
    isWrapper: false,
    getUrl: (type, tmdb, imdb, s, e) => type === 'movie' 
      ? `https://vidora.su/movie/${tmdb}` 
      : `https://vidora.su/tv/${tmdb}/${s}/${e}` 
  },
  { 
    name: 'Vidrock', 
    reqImdb: false, 
    isWrapper: false,
    getUrl: (type, tmdb, imdb, s, e) => type === 'movie' 
      ? `https://vidrock.ru/movie/${tmdb}` 
      : `https://vidrock.ru/tv/${tmdb}/${s}/${e}` 
  },
  { 
    name: 'Fmovies', 
    reqImdb: false, 
    isWrapper: false,
    getUrl: (type, tmdb, imdb, s, e) => type === 'movie' 
      ? `https://www.fmovies.gd/watch/movie/${tmdb}` 
      : `https://www.fmovies.gd/watch/tv/${tmdb}/${s}/${e}` 
  },
  { 
    name: 'CinemaOS', 
    reqImdb: false, 
    isWrapper: false,
    getUrl: (type, tmdb, imdb, s, e) => type === 'movie' 
      ? `https://cinemaos.tech/player/${tmdb}` 
      : `https://cinemaos.tech/player/tv/${tmdb}/${s}/${e}` 
  },
  { 
    name: 'Mov2day', 
    reqImdb: false, 
    isWrapper: false,
    getUrl: (type, tmdb, imdb, s, e) => type === 'movie' 
      ? `https://cdn.mov2day.xyz/embed/movie/${tmdb}` 
      : `https://cdn.mov2day.xyz/embed/tv/${tmdb}/${s}/${e}` 
  }
];
