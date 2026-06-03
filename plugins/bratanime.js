const axios = require("axios")
const {
    Sticker,
    StickerTypes
} = require("wa-sticker-formatter")

module.exports = {
    command: ["bratanime", "bratani"],
    async run(sock, m, { text }) {
        try {
            if (!text) {
                return m.reply(
                    "❌ kasih teks jir\ncontoh: .bratanime hello anime"
                )
            }
            m.reply("⏳ bikin stiker anime...")
            const url =
                `https://api.nexray.eu.cc/maker/bratanime?text=${encodeURIComponent(text)}`
            const res = await axios.get(url, {
                responseType: "arraybuffer"
            })
            const buffer = Buffer.from(res.data)
            const sticker = new Sticker(buffer, {
                pack: "RevinzaBotz",     
                author: "Revinza",   
                type: StickerTypes.FULL,
                categories: ["anime", "brat"],
                quality: 80
            })
            const output = await sticker.toBuffer()
            await sock.sendMessage(
                m.chat,
                {
                    sticker: output
                },
                { quoted: m }
            )
        } catch (err) {
            console.log(err)
            m.reply("❌ gagal generate bratanime")
        }
    }
}