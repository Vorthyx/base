const fs = require('fs');

module.exports = {
  command: ["restart", "r", " restartbot",],
  isOwner: true,

  async run(sock, m) {
    try {
      await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
      await sock.sendMessage(m.chat, { 
        text: "🔄 *Restarting...*\nMohon tunggu beberapa saat sampai bot kembali online." 
      }, { quoted: m });
      const restartInfo = {
        chatId: m.chat,
        msg: m
      };
      fs.writeFileSync('./restarting.json', JSON.stringify(restartInfo, null, 2));
      setTimeout(() => {
        process.exit(0);
      }, 1500);

    } catch (err) {
      console.error(err);
      sock.sendMessage(m.chat, { text: "Gagal memicu restart ❌" }, { quoted: m });
    }
  }
};