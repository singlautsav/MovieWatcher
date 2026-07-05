export const getIndianChannels = async () => {
    try {
        const response = await fetch('https://iptv-org.github.io/iptv/countries/in.m3u');
        const text = await response.text();
        
        const lines = text.split('\n');
        const channels = [];
        let currentChannel = null;

        for (let line of lines) {
            line = line.trim();
            if (line.startsWith('#EXTINF:')) {
                currentChannel = {};
                const tvgIdMatch = line.match(/tvg-id="([^"]*)"/);
                const tvgLogoMatch = line.match(/tvg-logo="([^"]*)"/);
                const groupTitleMatch = line.match(/group-title="([^"]*)"/);
                
                currentChannel.id = tvgIdMatch ? tvgIdMatch[1] : Math.random().toString();
                currentChannel.logo = tvgLogoMatch ? tvgLogoMatch[1] : '';
                currentChannel.category = groupTitleMatch ? groupTitleMatch[1] : 'Uncategorized';
                
                const parts = line.split(',');
                currentChannel.name = parts[parts.length - 1];
            } else if (line.startsWith('http') && currentChannel) {
                currentChannel.url = line;
                channels.push(currentChannel);
                currentChannel = null;
            }
        }
        return channels;
    } catch(err) {
        console.error("IPTV Fetch Error", err);
        return [];
    }
}
