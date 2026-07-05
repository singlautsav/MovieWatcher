export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL required' });
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
    });
    
    if (!response.ok || response.url.includes('404') || response.url.includes('error')) {
      return res.status(200).json({ ok: false });
    }

    const html = await response.text();
    const lowerHtml = html.toLowerCase();
    const isBlank = (url.includes('vidsrc') || url.includes('2embed') || url.includes('embed.su')) && !lowerHtml.includes('<iframe');
    let isSoft404 = lowerHtml.includes('this page could not be found') || 
                      lowerHtml.includes('video not found') || 
                      lowerHtml.includes('file was deleted') ||
                      lowerHtml.includes('404 not found') ||
                      lowerHtml.includes('movie not found') ||
                      lowerHtml.includes('redirecting...') ||
                      isBlank;

    // Vidsrc wrapper deep-check
    if (!isSoft404 && url.includes('vidsrc') && lowerHtml.includes('<iframe')) {
        const iframeMatch = html.match(/<iframe[^>]+src="([^"]+)"/i);
        if (iframeMatch && iframeMatch[1]) {
            try {
                const innerRes = await fetch(iframeMatch[1].startsWith('http') ? iframeMatch[1] : `https:${iframeMatch[1]}`, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(2000) });
                const innerHtml = (await innerRes.text()).toLowerCase();
                if (innerHtml.includes('not found') || innerHtml.includes('404')) {
                    isSoft404 = true;
                }
            } catch(e) {}
        }
    }
                      
    res.status(200).json({ ok: !isSoft404 });
  } catch (error) {
    res.status(200).json({ ok: false, error: error.message });
  }
}
