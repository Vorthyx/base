const util = require('util');

module.exports = {
  command: ['eval', 'x'],
  isOwner: true,

  run: async (sock, m) => {

    const body = m.body || "";
    const text = body.trim().split(/\s+/).slice(1).join(" ");

    if (!text) return m.reply('Masukkan kode JavaScript.');

    try {
      const asyncEval = `(async () => { ${text} })()`;
      let evaled = await eval(asyncEval);

      if (typeof evaled !== 'string') {
        evaled = util.inspect(evaled, { depth: 2 });
      }

      return m.reply(evaled);
    } catch (e) {
      return m.reply(String(e));
    }
  }
};
