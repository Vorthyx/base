const { generateWAMessageContent, generateWAMessageFromContent, proto, getContentType } = require("@whiskeysockets/baileys");
const util = require('util');

module.exports = {
  command: ['debug', 'inspect', 'json'],
  isOwner: true,
  run: async (sock, m) => {
    if (!m.quoted) return m.reply('Reply/kuot pesan yang ingin kamu debug.');
    try {
      let rawQuotedMessage = m.message[m.mtype]?.contextInfo?.quotedMessage || m.msg?.contextInfo?.quotedMessage;
      let targetDebug = rawQuotedMessage ? rawQuotedMessage : m.quoted;
      let output = util.inspect(targetDebug, { depth: 10, showHidden: false });
      return m.reply("```json\n" + output + "\n```");
    } catch (e) {
      console.error('[DEBUG ERROR]', e);
      return m.reply(String(e));
    }
  }
};
