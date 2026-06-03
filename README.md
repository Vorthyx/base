# 🤖 AbgRevinza WhatsApp Bot

<div align="center">

<img src="./menu.jpg" width="200">

### Simple • Fast • Lightweight

Base WhatsApp Bot menggunakan Baileys yang dibuat untuk memudahkan developer dalam membuat dan mengembangkan bot WhatsApp.

</div>

---

## ✨ Features

- Multi Device Support
- Pairing Code Login
- Plugin Handler
- Case Handler System
- Modular Structure
- Fast Response
- Lightweight
- Easy Development
- Easy Maintenance
- Free To Use

---

## 📂 Project Structure

```bash
.
├── plugins/
│
├── system/
│   ├── caseHandler.js
│   └── helper.js
│
├── config.js
├── index.js
├── menu.jpg
├── menu.mp3
└── package.json
```

---

## 📌 Description

### index.js
File utama yang menjalankan koneksi WhatsApp dan seluruh sistem bot.

### config.js
Berisi konfigurasi bot seperti owner, nama bot, prefix, dan pengaturan lainnya.

### plugins/
Tempat menyimpan seluruh fitur atau command bot.

### system/caseHandler.js
Mengatur proses command dan event yang masuk.

### system/helper.js
Berisi function helper dan utilitas yang digunakan oleh sistem.

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/username/repository.git
```

### Open Directory

```bash
cd repository
```

### Install Dependencies

```bash
npm install
```

### Run Bot

```bash
node index.js
```

---

## 🛠 Adding New Features

Buat file baru di folder plugins.

Contoh:

```javascript
module.exports = {
  command: ['ping'],
  run: async ({ m }) => {
    m.reply('Pong!')
  }
}
```

---

## ⚠️ Disclaimer

Project ini dibuat untuk tujuan pembelajaran.

Segala bentuk penyalahgunaan source code bukan tanggung jawab creator.

Gunakan bot dengan bijak dan patuhi Terms of Service WhatsApp.

---

## 📜 Rules

### Allowed

- Recode
- Modify
- Learn
- Add Features
- Private Use

### Not Allowed

- Remove Credits
- Sell Original Source
- Claim As Your Own
- Spread Malware

---

## 🎁 Free Release

Source ini dibagikan secara gratis untuk komunitas.

Jika repo ini membantu, jangan lupa ⭐ repository.

---

<div align="center">

### Made With ❤️ By Revinza

© 2026 Revinza

</div>