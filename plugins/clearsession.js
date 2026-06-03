const fs = require('fs');
const path = require('path');

module.exports = {
    command: ['clearsession', 'cs', 'clearsesi'],
    isOwner: true,
    async run(sock, m) {
        try {
            await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
            const sessionDir = path.join(process.cwd(), 'session');
            
            if (!fs.existsSync(sessionDir)) {
                return m.reply("Folder session tidak ditemukan ❌");
            }
            const files = fs.readdirSync(sessionDir);
            let deletedCount = 0;
            for (const file of files) {
                if (file === 'creds.json') continue;
                if (
                    file.startsWith('pre-key-') ||
                    file.startsWith('sender-key-') ||
                    file.startsWith('session-') ||
                    file.startsWith('app-state-')
                ) {
                    fs.unlinkSync(path.join(sessionDir, file));
                    deletedCount++;
                }
            }
            await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
            m.reply(`✨ *Pembersihan Selesai!*\nBerhasil menghapus *${deletedCount}* file sampah sesi yang bikin delay.\n\n_Bot sekarang menjadi lebih ringan!_`);
        } catch (err) {
            console.error(err);
            m.reply("Terjadi kesalahan saat membersihkan sesi ❌");
        }
    }
};
