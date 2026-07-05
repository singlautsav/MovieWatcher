import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { URL } from 'url'

const vercelApiSimulation = () => ({
  name: 'vercel-api-simulation',
  configureServer(server) {
    server.middlewares.use('/api/probe', async (req, res) => {
      const urlStr = new URL(req.url, `http://${req.headers.host}`).searchParams.get('url');
      if (!urlStr) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'URL required' }));
      }
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);
        
        const fetchRes = await fetch(urlStr, { 
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (!fetchRes.ok || fetchRes.url.includes('404') || fetchRes.url.includes('error')) {
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ ok: false }));
        }

        const html = await fetchRes.text();
        const lowerHtml = html.toLowerCase();
        const isBlank = (urlStr.includes('vidsrc') || urlStr.includes('2embed') || urlStr.includes('embed.su')) && !lowerHtml.includes('<iframe');
        let isSoft404 = lowerHtml.includes('this page could not be found') || 
                          lowerHtml.includes('video not found') || 
                          lowerHtml.includes('file was deleted') ||
                          lowerHtml.includes('404 not found') ||
                          lowerHtml.includes('movie not found') ||
                          lowerHtml.includes('redirecting...') ||
                          isBlank;
                          
        // Vidsrc wrapper deep-check
        if (!isSoft404 && urlStr.includes('vidsrc') && lowerHtml.includes('<iframe')) {
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
                          
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: !isSoft404 }));
      } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: false }));
      }
    });
  }
});

export default defineConfig({
  plugins: [react(), vercelApiSimulation()],
})
