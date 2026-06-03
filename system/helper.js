const fs = require("fs")
const sharp = require("sharp")

const {
    jidNormalizedUser,
    proto,
    getContentType,
    generateWAMessageFromContent
} = require("@whiskeysockets/baileys")
function serialize(sock, m) {
    if (!m) return m;
    let M = proto.WebMessageInfo;
    
    if (m.key) {
        m.id = m.key.id;
        m.isBot = m.id.startsWith('BAE5') && m.id.length === 16;
        m.chat = m.key.remoteJid;
        m.fromMe = m.key.fromMe;
        m.isGroup = m.chat.endsWith('@g.us');
        m.sender = jidNormalizedUser(m.fromMe ? sock.user.id : m.isGroup ? m.key.participant : m.chat);
    }
    
    if (m.message) {
        m.mtype = getContentType(m.message);
        
        // Pengaman jika mtype tidak valid atau tidak dikenali Baileys
        if (!m.mtype) {
            m.body = '';
            return m;
        }

        // Ambil payload pesan secara aman
        m.msg = (m.mtype === 'viewOnceMessage' || m.mtype === 'viewOnceMessageV2') 
            ? (m.message[m.mtype]?.message?.[getContentType(m.message[m.mtype]?.message || {})]) 
            : m.message[m.mtype];

        // Jika m.msg ternyata undefined setelah di-parse, buat objek kosong agar tidak crash di bawah
        if (!m.msg) m.msg = {};
        
        // Ekstrak ID dari interactiveResponseMessage (Native Flow Buttons)
        let responseId = '';
        if (m.mtype === 'interactiveResponseMessage') {
            try {
                let parseParams = JSON.parse(m.msg?.nativeFlowResponseMessage?.paramsJson || '{}');
                responseId = parseParams.id || '';
            } catch (e) {
                responseId = '';
            }
        }

        // ---- [ DOCKING M.BODY DENGAN MTYPE TAMBAHAN ] ----
        m.body = m.mtype === "conversation" ? m.message.conversation :
                 m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage?.text :
                 
                 // Pesan media dengan caption
                 m.mtype === "imageMessage" ? m.message.imageMessage?.caption :
                 m.mtype === "videoMessage" ? m.message.videoMessage?.caption :
                 m.mtype === "documentMessage" ? m.message.documentMessage?.caption || "" :
                 m.mtype === "audioMessage" ? m.message.audioMessage?.caption || "" :
                 m.mtype === "stickerMessage" ? m.message.stickerMessage?.caption || "" :
                 
                 // Pesan interaktif (tombol, list, dll.)
                 m.mtype === "buttonsResponseMessage" ? m.message.buttonsResponseMessage?.selectedButtonId :
                 m.mtype === "listResponseMessage" ? m.message.listResponseMessage?.singleSelectReply?.selectedRowId :
                 m.mtype === "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage?.selectedId :
                 m.mtype === "interactiveResponseMessage" ? responseId :
                 
                 // Pesan khusus & Metadata
                 m.mtype === "messageContextInfo" ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply?.selectedRowId || m.text) :
                 m.mtype === "reactionMessage" ? m.message.reactionMessage?.text :
                 m.mtype === "contactMessage" ? m.message.contactMessage?.displayName :
                 m.mtype === "contactsArrayMessage" ? m.message.contactsArrayMessage?.contacts?.map(c => c.displayName).join(", ") :
                 m.mtype === "locationMessage" ? `${m.message.locationMessage?.degreesLatitude}, ${m.message.locationMessage?.degreesLongitude}` :
                 m.mtype === "liveLocationMessage" ? `${m.message.liveLocationMessage?.degreesLatitude}, ${m.message.liveLocationMessage?.degreesLongitude}` :
                 m.mtype === "pollCreationMessage" ? m.message.pollCreationMessage?.name :
                 m.mtype === "pollUpdateMessage" ? m.message.pollUpdateMessage?.name :
                 m.mtype === "groupInviteMessage" ? m.message.groupInviteMessage?.groupJid :
                 
                 // Pesan satu kali lihat (View Once)
                 m.mtype === "viewOnceMessage" ? (m.message.viewOnceMessage?.message?.imageMessage?.caption || m.message.viewOnceMessage?.message?.videoMessage?.caption || "[Pesan sekali lihat]") :
                 m.mtype === "viewOnceMessageV2" ? (m.message.viewOnceMessageV2?.message?.imageMessage?.caption || m.message.viewOnceMessageV2?.message?.videoMessage?.caption || "[Pesan sekali lihat]") :
                 m.mtype === "viewOnceMessageV2Extension" ? (m.message.viewOnceMessageV2Extension?.message?.imageMessage?.caption || m.message.viewOnceMessageV2Extension?.message?.videoMessage?.caption || "[Pesan sekali lihat]") :
                 
                 // Pesan sementara (ephemeralMessage)
                 m.mtype === "ephemeralMessage" ? (m.message.ephemeralMessage?.message?.conversation || m.message.ephemeralMessage?.message?.extendedTextMessage?.text || "[Pesan sementara]") :
                 
                 // Protokol & Interaktif Lainnya
                 m.mtype === "interactiveMessage" ? "[Pesan interaktif]" :
                 m.mtype === "protocolMessage" ? "[Pesan telah dihapus]" :
                 
                 // Fallback bawaan
                 (m.msg?.caption || m.msg?.text || m.text || '');
        
        // Mengamankan m.body agar selalu bertipe string
        if (typeof m.body !== 'string') m.body = '';

        m.quoted = m.msg?.contextInfo ? m.msg.contextInfo.quotedMessage : null;
        if (m.quoted) {
            let type = getContentType(m.quoted);
            if (type) {
                m.quoted = m.quoted[type];
                if (['productMessage'].includes(type)) {
                    type = getContentType(m.quoted);
                    m.quoted = m.quoted ? m.quoted[type] : null;
                }
                if (m.quoted) {
                    if (typeof m.quoted === 'string') m.quoted = { text: m.quoted };
                    m.quoted.mtype = type;
                    m.quoted.id = m.msg.contextInfo.stanzaId;
                    m.quoted.sender = jidNormalizedUser(m.msg.contextInfo.participant);
                    m.quoted.fromMe = m.quoted.sender === jidNormalizedUser(sock.user.id);
                    m.quoted.text = m.quoted.text || m.quoted.caption || m.quoted.conversation || '';
                }
            }
        }
    }
    
    m.reply = async (text, options = {}) => {
        return sock.sendMessage(
            m.chat, 
            { text: String(text), ...options }, 
            { quoted: m }
        );
    }
    return m;
}

module.exports = { serialize };
