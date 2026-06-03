const fs = require("fs")
const path = require("path")

module.exports = {
  command: ["getplugin", "ambilplugin", "getpluing", "ambilpluing"],
  async run(sock, m, { text }) {
    const ownerNumber = global.owner || []
const senderNumber = m.sender.split("@")[0]
const isOwner = ownerNumber.includes(senderNumber)
if (!isOwner) {
  return m.reply("❌ command ini khusus owner")
}
    if (!text) return m.reply("contoh:\ngetplugin name.js")
    try {
      let filename = text.trim()
      if (!filename.endsWith(".js")) {
        filename += ".js"
      }
      const filePath = path.join(__dirname, filename)
      if (!fs.existsSync(filePath)) {
        return m.reply("plugin tidak ditemukan ❌")
      }
      const fileContent = fs.readFileSync(filePath, "utf8")
      if (fileContent.length > 5000) {
        return sock.sendMessage(m.chat, {
          document: Buffer.from(fileContent, "utf8"),
          fileName: filename,
          mimetype: "text/javascript"
        }, { quoted: m })
      } else {
        return m.reply("```js\n" + fileContent + "\n```")
      }
    } catch (err) {
      console.error(err)
      m.reply("gagal ambil plugin ❌")
    }
  }
}