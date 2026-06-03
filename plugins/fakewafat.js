const axios = require("axios");
const FormData = require("form-data");
const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

module.exports = {
    command: ["fakewafat"],
    run: async (sock, m, { text }) => {
        try {
            const jid = m.chat;
            let args = text ? text.split("|") : [];
            let url = "";
            let nama = "";
            let lahir = "";
            let wafat = "";
            const isImage = m.quoted && (
                m.quoted.mtype === "imageMessage" || 
                m.quoted.mtype?.includes("viewOnce") || 
                m.quoted.message?.imageMessage
            );
            if (isImage) {
                m.reply("Sedang memproses gambar, mohon tunggu...");
                const stream = await downloadContentFromMessage(m.quoted, "image");
                let mediaBuffer = Buffer.from([]);
                for await (const chunk of stream) {
                    mediaBuffer = Buffer.concat([mediaBuffer, chunk]);
                }
                const form = new FormData();
                form.append("file", mediaBuffer, "image.jpg");

                const upload = await axios.post(
                    "https://tmpfiles.org/api/v1/upload",
                    form,
                    { headers: form.getHeaders() }
                );
                url = upload.data.data.url.replace("tmpfiles.org/", "tmpfiles.org/dl/");
                nama = args[0]?.trim();
                lahir = args[1]?.trim();
                wafat = args[2]?.trim();
            } else {
                url = args[0]?.trim();
                nama = args[1]?.trim();
                lahir = args[2]?.trim();
                wafat = args[3]?.trim();
            }
            if (!url || !nama || !lahir || !wafat) {
                return m.reply(
                    `*❌ FORMAT SALAH*\n\n` +
                    `➔ *Cara Manual (Pakai URL Foto):*\n` +
                    `.fakewafat url_foto|nama|lahir|wafat\n\n` +
                    `➔ *Cara Praktis (Reply Foto/ViewOnce):*\n` +
                    `.fakewafat nama|lahir|wafat`
                );
            }
            await sock.sendMessage(jid, { react: { text: "⏳", key: m.key } });
            const apiUrl =
                `https://api.ikyyxd.my.id/canvas/fakewafat` +
                `?url=${encodeURIComponent(url)}` +
                `&nama=${encodeURIComponent(nama)}` +
                `&lahir=${encodeURIComponent(lahir)}` +
                `&wafat=${encodeURIComponent(wafat)}`;
            const res = await axios.get(apiUrl, { responseType: "arraybuffer" });
            const buffer = Buffer.from(res.data);
            await sock.sendMessage(jid, {
                image: buffer,
                caption:
                    `『 FAKE WAFAT 』\n\n` +
                    `◈ *Nama:* ${nama}\n` +
                    `◈ *Lahir:* ${lahir}\n` +
                    `◈ *Wafat:* ${wafat}`
            }, { quoted: m });
            await sock.sendMessage(jid, { react: { text: "✅", key: m.key } });
        } catch (e) {
            console.error(e);
            m.reply(`Terjadi kesalahan: ${String(e)}`);
        }
    }
};
