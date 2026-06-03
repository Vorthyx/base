const fs = require("fs")
const path = require("path")

module.exports = {
    command: ["editplugin", "editpluing"],

    async run(sock, m, { text }) {
        if (!text) {
            return m.reply("format:\neditplugin nama.js | kode baru")
        }
        try {
            let [filename, ...codeArr] = text.split("|")
            if (!filename || !codeArr.length) {
                return m.reply("format salah!\ncontoh:\neditplugin ping.js | module.exports = {}")
            }
            filename = filename.trim()
            const newCode = codeArr.join("|").trim()
            if (!filename.endsWith(".js")) {
                filename += ".js"
            }
            const filePath = path.join(__dirname, filename)
            if (!fs.existsSync(filePath)) {
                return m.reply("plugin tidak ditemukan ❌")
            }
            fs.writeFileSync(filePath, newCode)
            m.reply(`Plugin berhasil diupdate ✅\nFile: ${filename}`)
        } catch (err) {
            console.error(err)
            m.reply("gagal edit plugin ❌")
        }
    }
}