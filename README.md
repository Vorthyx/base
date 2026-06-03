<div align="center">ABGREVINZA

Lightweight WhatsApp Bot Framework

A modern WhatsApp bot base built for speed, scalability, and simplicity.

<img src="https://img.shields.io/badge/Node.js-20+-success?style=flat-square">
<img src="https://img.shields.io/badge/Baileys-Latest-blue?style=flat-square">
<img src="https://img.shields.io/badge/License-MIT-purple?style=flat-square"></div>---

Overview

ABGREVINZA is a lightweight WhatsApp bot framework powered by Baileys.

Designed with a modular architecture, allowing developers to build and maintain plugins efficiently without unnecessary complexity.

---

Highlights

- Multi Device Support
- Pairing Code Authentication
- Plugin Based System
- Dynamic Command Handler
- Lightweight & Fast
- Easy Customization
- Clean Project Structure

---

Project Structure

.
├── plugins/
│   ├── menu.js
│   ├── owner.js
│   └── ...
│
├── system/
│   ├── caseHandler.js
│   ├── helper.js
│   └── functions.js
│
├── config.js
├── index.js
├── package.json
└── README.md

---

Installation

git clone https://github.com/username/ABGREVINZA
cd ABGREVINZA
npm install
node .

---

Configuration

global.owner = "628xxxxxxxxxx"
global.botname = "ABGREVINZA"
global.prefix = "."

---

Plugin Example

module.exports = {
  command: ["ping"],

  run: async (sock, m) => {
    m.reply("Pong!")
  }
}

---

License

This project is available for learning, development, and personal customization.

---

<div align="center">ABGREVINZA BOT

Built for Developers

</div>