const fs = require("fs")
const path = require("path")

module.exports = {
    command: ["ls", "listfile"],
    isOwner: true,

    async run(sock, m, { text }) {
        try {
            const target = text || "."
            const dir = path.resolve(process.cwd(), target)
            if (!fs.existsSync(dir)) {
                return m.reply("folder tidak ada ❌")
            }
            const files = fs.readdirSync(dir)
            if (!files.length) {
                return m.reply("folder kosong ")
            }
            let result = " >:\n\n"
            const folders = []
            const normalFiles = []
            for (const file of files) {
                const fullPath = path.join(dir, file)
                try {
                    const stat = fs.statSync(fullPath)

                    if (stat.isDirectory()) {
                        folders.push(`${file}`)
                    } else {
                        normalFiles.push(`~${file}`)
                    }
                } catch {}
            }
            result += folders.join("\n")
            if (normalFiles.length) {
                result += "\n" + normalFiles.join("\n")
            }
            m.reply(result)
        } catch (err) {
            console.error(err)
            m.reply("error ❌")
        }
    }
}