const fs = require("fs");
const crypto = require("crypto");
const { exec } = require("child_process");
const { downloadContentFromMessage, getContentType } = require("@whiskeysockets/baileys");

module.exports = {
    command: ["s", "sticker", "stiker", "tosticker"],
    tags: ["sticker"],
    help: ["sticker"],
    
    run: async (sock, m, { prefix, command }) => {
 
        const isQuoted = !!m.quoted;
        const msgContext = isQuoted ? m.msg?.contextInfo?.quotedMessage : m.message;
        
        if (!msgContext) return m.reply(`❌ Kirim/Reply gambar atau video dengan caption *${prefix + command}*`);

 
        const type = getContentType(msgContext);
        const isImage = type === "imageMessage";
        const isVideo = type === "videoMessage";

        if (!isImage && !isVideo) {
            return m.reply(`❌ Media yang Anda reply bukan gambar atau video.`);
        }

        try {
            if (!fs.existsSync("./temp")) fs.mkdirSync("./temp");
 
            const mediaObject = msgContext[type];
 
            const stream = await downloadContentFromMessage(mediaObject, isImage ? "image" : "video");
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            if (!buffer || buffer.length === 0) return m.reply("❌ Media gagal didekripsi/diunduh.");

            const id = crypto.randomBytes(4).toString("hex");
            const inputPath = `./temp/${id}${isVideo ? ".mp4" : ".jpg"}`;
            const outputPath = `./temp/${id}.webp`;

            fs.writeFileSync(inputPath, buffer);

            const ffmpegArgs = isVideo 
                ? `-vcodec libwebp -filter_complex "[0:v]scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,fps=15" -loop 0 -preset default -an -vsync 0 -t 10`
                : `-vcodec libwebp -vf "scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" -preset default -an -vsync 0`;

            exec(`ffmpeg -i ${inputPath} ${ffmpegArgs} ${outputPath}`, async (err) => {
                if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
                
                if (err) {
                    console.error("FFmpeg Error:", err);
                    return m.reply("❌ Gagal mengonversi media ke WebP.");
                }
                
                if (!fs.existsSync(outputPath)) return m.reply("❌ File hasil konversi stiker tidak ditemukan.");
                
                let webp = fs.readFileSync(outputPath);
                
                await sock.sendMessage(m.chat, { sticker: webp }, { quoted: m });
                
                if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
            });

        } catch (e) {
            console.error("Error Download:", e);
            m.reply("❌ Gagal memproses enkripsi media WhatsApp.");
        }
    }
};
