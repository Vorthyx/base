const {
    proto,
    generateWAMessageFromContent,
    generateWAMessageContent
} = require("@whiskeysockets/baileys");
const fs = require('fs'); 
const chalk = require('chalk'); 

module.exports = async (
    sock,
    m,
    {
        command,
        args,
        text,
        prefix,
        isOwner,
        isPremium
    }
) => {

    const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';

    switch(command) {
        case 'public': {
            if (!isOwner) return m.reply("*[ AKSES OWNER ]* Fitur ini dikunci khusus Owner!");
            sock.public = true;
            m.reply(`*Success: Changed Mode to Public*\n(Semua orang bisa menggunakan bot)`);
        }
        break;

        case 'self': 
        case 'private': {
            if (!isOwner) return m.reply("*[ AKSES OWNER ]* Fitur ini dikunci khusus Owner!");
            sock.public = false;
            m.reply(`*Success: Changed Mode to Self*\n(Hanya Owner yang bisa menggunakan bot)`);
        }
        break;

    }

    return false;
};
 