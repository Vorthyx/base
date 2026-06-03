const fs = require('fs')
const axios = require('axios')
const sharp = require('sharp')
const { proto, generateWAMessageFromContent } = require('@whiskeysockets/baileys')

module.exports = {
 command: ['bot'], 
 run: async (sock, m, { msg }) => {
 async function getLocationThumb(input = './menu.jpg') {
 let buffer
 if (/^https?:\/\//.test(input)) {
 const res = await axios.get(input, {
 responseType: 'arraybuffer',
 timeout: 30000
 })
 buffer = Buffer.from(res.data)
 } else {
 buffer = fs.readFileSync(input)
 }
 return await sharp(buffer)
 .resize(300, 180, {
 fit: 'cover'
 })
 .jpeg({
 quality: 70
 })
 .toBuffer()
 }
 try {
 const thumb = await getLocationThumb(global.thumb || './menu.jpg')
 const buttons = [
 {
 buttonId: '.menu',
 buttonText: {
 displayText: 'ᴍᴇɴᴜ'
 },
 type: 1
 }
 ]
 const messageContent = proto.Message.fromObject({
 viewOnceMessage: {
 message: {
 buttonsMessage: {
 contentText: 'R',
 footerText: 'V',
 headerType: 6,
 locationMessage: {
    degreesLatitude: 0,   
    degreesLongitude: 0, 
    name: 'Revinza',
    address: 'Revinza',
    jpegThumbnail: thumb
},
 buttons
 }
 }
 }
 })
 const waMessage = await generateWAMessageFromContent(
 m.chat,
 messageContent,
 {
 userJid: sock.user.id,
 quoted: m
 }
 )
 await sock.relayMessage(
 m.chat,
 waMessage.message,
 {
 messageId: waMessage.key.id
 }
 )
 } catch (error) {
 console.error(error)
 m.reply('Terjadi kesalahan saat mengirim info bot.')
 }
 }
}