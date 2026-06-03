const fs = require("fs");
const path = require("path");
const sharp = require("sharp"); 
const { proto, generateWAMessageFromContent } = require("@whiskeysockets/baileys");

module.exports = {
  command: ["createfile", "cf", "writefile"],
  isOwner: true,
  async run(sock, m, { text }) {
    const reply = async (txt) => {
      try {
        let buffer = fs.readFileSync(global.thumb || "./menu.jpg");
        const thumb = await sharp(buffer)
          .resize(300, 180)
          .jpeg({ quality: 70 })
          .toBuffer();
        const messageContent = proto.Message.fromObject({
          viewOnceMessage: {
            message: {
              buttonsMessage: {
                contentText: String(txt),
                footerText: global.botname || "Revinza",
                headerType: 6,
                locationMessage: {
                  degreesLatitude: 0,
                  degreesLongitude: 0,
                  name: global.botname || "Revinza",
                  address: global.botname || "Revinza",
                  jpegThumbnail: thumb
                },
                buttons: [
                  {
                    buttonId: ".menu",
                    buttonText: {
                      displayText: "MENU"
                    },
                    type: 1
                  }
                ]
              }
            }
          }
        });
        const msg = await generateWAMessageFromContent(
          m.chat,
          messageContent,
          {
            quoted: m,
            userJid: sock.user.id
          }
        );
        return await sock.relayMessage(
          m.chat,
          msg.message,
          {
            messageId: msg.key.id
          }
        );
      } catch (e) {
        console.log(e);
        return sock.sendMessage(
          m.chat,
          { text: String(txt) },
          { quoted: m }
        );
      }
    };
    try {
      if (!text) {
        return reply("Format salah ❌\nPenggunaan:\n.createfile folder/file.js | isi kode");
      }
      let [filePath, ...codeArr] = text.split("|");
      if (!filePath || !codeArr.length) {
        return reply(
          "Format salah ❌\nContoh:\n.createfile plugins/file.js | console.log('ok')"
        );
      }
      filePath = filePath.trim();
      const code = codeArr.join("|").trim();
      if (filePath.includes("..")) {
        return reply("Path tidak valid atau dilarang ❌");
      }
      const fullPath = path.join(process.cwd(), filePath);
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.writeFileSync(fullPath, code, "utf8");
      return reply(
        `File berhasil dibuat ✔\n\n📄 Path: ${filePath}\n📍 Full Path: ${fullPath}`
      );
    } catch (err) {
      console.log(err);
      return reply("Terjadi kesalahan saat membuat file ❌");
    }
  }
};
