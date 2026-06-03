const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const axios = require("axios");
let cachedThumb = null;

async function getLocationThumb(input = './menu.jpg') {
    if (cachedThumb) return cachedThumb;

    try {
        let buffer;
        if (/^https?:\/\//.test(input)) {
            const res = await axios.get(input, {
                responseType: 'arraybuffer',
                timeout: 15000
            });
            buffer = Buffer.from(res.data);
        } else {
            if (!fs.existsSync(input)) return Buffer.alloc(0);
            buffer = fs.readFileSync(input);
        }
        cachedThumb = await sharp(buffer)
            .resize(300, 180, { fit: 'cover' })
            .jpeg({ quality: 70 })
            .toBuffer();

        return cachedThumb;
    } catch (e) {
        console.error("Gagal mengompres gambar menu:", e);
        return Buffer.alloc(0);
    }
}

module.exports = {
  command: ["menu", "help"],

  async run(sock, m, { prefix }) {  
    try {
      const stif = await getLocationThumb('./menu.jpg');
      const pushName = m.pushName || "Kak"; 

      const buttonMessage = {
        location: {
          degreesLatitude: 0,
          degreesLongitude: 0,
          name: 'VØⱤ₮ⱧɎӾ',
          address: 'ⱤɆVł₦Ⱬ₳',
          jpegThumbnail: stif 
        },
        limited_time_offer: {
          text: "bokep",
          url: "https://t.me/ReVinzzamodss",
          copy_code: "bokep",
          expiration_time: Math.floor(Date.now() / 1000) + 86400
        },

        caption: `Halo, ${pushName} 👋 ボットメニューへようこそ.︎`,
        footer: `╭「 *ᐯㄖ尺₮ㄚ乂* 」
│
│◧ *ᴀᴜᴛʜᴏʀ:* ʀᴇᴠɪɴᴢᴀ
│◧ *ʙᴏᴛɴᴀᴍᴇ:* ᴠᴏʀᴛʜʏx
│◧ *ᴠᴇʀꜱɪᴏɴ:* ɴᴇᴡ
│◧ *ᴛʏᴘᴇ:* ᴘʟᴜɢɪɴ
│◧ *ᴍᴜʟᴛɪ ᴘʀᴇғɪx*
╰───────────────`,
        headerType: 6,
        viewOnce: true,

        buttons: [
          {
            buttonId: 'action',
            buttonText: { displayText: 'Click' },
            type: 4,
            nativeFlowInfo: {
              name: 'single_select',
              paramsJson: JSON.stringify({
                title: "ᐯㄖ尺ㄒ卄ㄚ乂",
                sections: [
                  {
                    title: "",
                    highlight_label: "ᴠᴏʀᴛʜyx",
                    rows: [
                      { title: "ɢʀᴜᴘ ᴍᴇɴᴜ", description: "", id: `${prefix}grupmenu` },
                      { title: "ᴍᴀɪɴ menu", description: "", id: `${prefix}mainmenu` },
                      { title: "ᴏᴡɴᴇʀ ᴍᴇɴᴜ", description: "", id: `.ownermenu` }
                    ]
                  }
                ]
              })
            }
          },
          {
            buttonId: `${prefix}tools`,
            buttonText: { displayText: 'Tools' },
            type: 1
          }, 
          {
            buttonId: '.tqto',
            buttonText: { displayText: 'Thanks To ' },
            type: 2
          }
        ],

        contextInfo: {
          mentionedJid: [m.sender],
          stanzaId: m.key.id,
          participant: m.sender,
          quotedMessage: m.message,
          externalAdReply: {
            title: 'ᐯㄖ尺฿ㄚ乂',
            body: 'ʀᴇᴠɪ₦ᴢᴀ',
            thumbnail: stif, 
            sourceUrl: 'https://t.me/ReVinzzaModss',
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      };

      await sock.sendMessage(m.chat, buttonMessage, { quoted: m });
      
      if (fs.existsSync('./menu.mp3')) {
        await sock.sendMessage(m.chat, { audio: fs.readFileSync('./menu.mp3'), mimetype: 'audio/mp4', ptt: true }, { quoted: m });
      }

    } catch (err) {
      console.error(err);
      m.reply("Gagal memuat menu ❌");
    }
  }
};
