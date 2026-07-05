const STREAM_PROVIDERS = [
  { name: 'VidFast (Premium)', url: `https://vidfast.pro/movie/1184308` },
  { name: 'VidSrc.to', url: `https://vidsrc.to/embed/movie/1184308` },
  { name: 'VidSrc.pm', url: `https://vidsrc.pm/embed/movie/1184308` },
  { name: 'VidSrc.cc', url: `https://vidsrc.cc/v2/embed/movie/1184308` },
  { name: 'VidSrc.icu', url: `https://vidsrc.icu/embed/movie/1184308` },
  { name: 'VidSrc.rip', url: `https://vidsrc.rip/embed/movie/1184308` },
  { name: 'Vidlink.pro', url: `https://vidlink.pro/movie/1184308` },
  { name: '2Embed.cc', url: `https://2embed.cc/embed/1184308` },
  { name: '2Embed.skin', url: `https://2embed.skin/embed/movie/1184308` },
  { name: '2Embed.org', url: `https://2embed.org/embed/1184308` },
  { name: 'AutoEmbed.co', url: `https://autoembed.co/movie/tmdb/1184308` },
  { name: 'Embed.su', url: `https://embed.su/embed/movie/1184308` },
  { name: 'SuperEmbed', url: `https://multiembed.mov/?video_id=1184308&tmdb=1` },
  { name: 'MoviesAPI.to', url: `https://moviesapi.to/movie/1184308` },
  { name: 'MoviesAPI.club', url: `https://moviesapi.club/movie/1184308` },
  { name: 'SmashyStream', url: `https://player.smashy.stream/movie/1184308` },
  { name: 'NontonGo', url: `https://nontongo.win/embed/movie/1184308` },
  { name: 'VidCore', url: `https://vidcore.org/embed/movie/1184308` },
  { name: 'VidSync', url: `https://vidsync.xyz/embed/movie/1184308` },
  { name: 'VidKing', url: `https://www.vidking.net/embed/movie/1184308` },
  { name: '111Movies', url: `https://111movies.net/movie/1184308` },
  { name: 'Airflix', url: `https://airflix1.com/embed/movie/1184308` },
  { name: 'Hexa', url: `https://hexa.su/watch/movie/1184308` },
  { name: 'MappleTV', url: `https://mappletv.uk/watch/movie/1184308` },
  { name: 'Peachify', url: `https://peachify.top/embed/movie/1184308` },
  { name: 'Videasy', url: `https://player.videasy.net/movie/1184308` },
  { name: 'Vidzee', url: `https://player.vidzee.wtf/embed/movie/1184308` },
  { name: 'Rivestream', url: `https://rivestream.org/embed?type=movie&id=1184308` },
  { name: 'Vidlux', url: `https://vidlux.xyz/embed/movie/1184308` },
  { name: 'Vidora', url: `https://vidora.su/movie/1184308` },
  { name: 'Vidrock', url: `https://vidrock.ru/movie/1184308` },
  { name: 'Fmovies', url: `https://www.fmovies.gd/watch/movie/1184308` },
  { name: 'CinemaOS', url: `https://cinemaos.tech/player/1184308` },
  { name: 'Mov2day', url: `https://cdn.mov2day.xyz/embed/movie/1184308` }
];

async function check() {
  for (const p of STREAM_PROVIDERS) {
    try {
      const res = await fetch(p.url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const text = await res.text();
        // check current soft 404 logic
        const lowerHtml = text.toLowerCase();
        const isVidsrcBlank = p.url.includes('vidsrc') && !lowerHtml.includes('<iframe');
        const isSoft404 = lowerHtml.includes('this page could not be found') || 
                          lowerHtml.includes('video not found') || 
                          lowerHtml.includes('file was deleted') ||
                          lowerHtml.includes('404 not found') ||
                          lowerHtml.includes('movie not found') ||
                          isVidsrcBlank;
        
        if (!isSoft404) {
          console.log(`[PASSES FILTER BUT MIGHT BE DEAD] ${p.name}`);
          // Print first 500 chars to identify error text
          console.log(text.replace(/\\n/g, '').replace(/<[^>]+>/g, ' ').substring(0, 300));
          console.log('---');
        }
      }
    } catch(e) {}
  }
}
check();
