.editplugin play.js | const axios = require('axios');
const yts = require('youtube-yts'); 
const https = require('https');

const domainApi = "https://kyuu2nd.dev"; 

const agent = new https.Agent({  
    rejectUnauthorized: false
});

module.exports = {
    command: ['play'], 
    isGroup: false,            
    isOwner: false,            

    run: async (sock, m, { text, prefix, command, isUrl }) => {
        const Reply = (txt) => sock.sendMessage(m.chat, { text: txt }, { quoted: m });
        if (!text) return Reply(`Contoh: ${prefix + command} judul lagu atau link youtube`);
        
        try {
            await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
            
            let queryUrl = text;
            const checkUrl = typeof isUrl === 'function' ? isUrl(text) : /^https?:\/\//.test(text);
            
            if (!checkUrl) {
                const search = await yts(text);
                if (!search.all || search.all.length === 0) {
                    await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                    return Reply('Lagu tidak ditemukan di YouTube, coba judul lain.');
                }
                queryUrl = search.all[0].url; 
            }

            const apiUrl = `${domainApi}/api/download/sptzx-ytdl?url=${encodeURIComponent(queryUrl)}&type=audio`;
            
            const res = await axios.get(apiUrl, { 
                timeout: 60000, 
                httpsAgent: agent 
            }).catch(err => err.response || null); 

            if (!res || !res.data) {
                await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                return Reply('Gagal terhubung ke server API. Silakan coba beberapa saat lagi.');
            }

            const json = res.data;

            if (!json.status && !json.success) {
                await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                return Reply(`API Terkunci: ${json.error || 'Gagal memproses link.'}`);
            }

            const data = json.result || json.results || json.data || json;
            const downloadUrl = data.download || data.download_url || data.link || data.url || data.audioUrl;
            const title = data.title || data.name || data.title_audio || "Audio Player";

            if (!downloadUrl) {
                await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                return Reply('link unduhan file tidak ditemukan.');
            }

            await sock.sendMessage(m.chat, {
                audio: { url: downloadUrl },
                mimetype: 'audio/mp4', 
                fileName: `${title}.mp3`,
                contextInfo: {
                    externalAdReply: {
                        title: title,
                        body: 'Audio',
                        mediaType: 1,
                        thumbnailUrl: data.thumbnail || data.cover || data.image || '',
                        sourceUrl: queryUrl
                    }
                }
            }, { quoted: m });

            await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

        } catch (e) {
            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            Reply(`Terjadi kesalahan internal pada bot.`);
        }
    }
};