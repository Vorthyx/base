const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

module.exports = {
  command: ['readvo', 'rvo', 'lihat'],
  isOwner: true,  

  run: async (sock, m) => {
    if (!m.quoted) return m.reply('Balas/Reply foto sekali lihat yang ingin dibuka.');

    let msg = m.quoted;
    let type = msg.mtype;
    const isViewOnce = type?.includes('viewOnce') || msg.viewOnce || msg.message?.viewOnceMessage || msg.message?.viewOnceMessageV2;

    if (!isViewOnce) {
        return m.reply('Pesan yang kamu balas bukan pesan Sekali Lihat (View Once).');
    }
    try {
        m.reply('Sedang melihat media, mohon tunggu...');

        let captionAsli = msg.caption || msg.text || '';
        if (!captionAsli && msg.message) {
            let insideMsg = msg.message.viewOnceMessage?.message || msg.message.viewOnceMessageV2?.message || msg.message;
            let mediaMsg = insideMsg?.imageMessage || insideMsg?.videoMessage;
            if (mediaMsg && mediaMsg.caption) {
                captionAsli = mediaMsg.caption;
            }
        }
        let captionFinal = captionAsli ? `${captionAsli}\n\n> *— ʀᴇᴠɪɴᴢᴀ-ʙᴏᴛᴢ —*` : '> *—ʀᴇᴠɪɴᴢᴀ-ʙᴏᴛᴢ—*';
        let mediaType = type.includes('video') ? 'video' : 'image';
        const stream = await downloadContentFromMessage(msg, mediaType);
        let buffer = Buffer.from([]);
        
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        if (mediaType === 'image') {
            await sock.sendMessage(m.chat, { image: buffer, caption: captionFinal }, { quoted: m });
        } else if (mediaType === 'video') {
            await sock.sendMessage(m.chat, { video: buffer, caption: captionFinal }, { quoted: m });
        }
    } catch (e) {
        console.error(e);
        m.reply('Gagal membuka media sekali lihat.');
    }
  }
};
