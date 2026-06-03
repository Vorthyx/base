<div align="center">

# ABGREVINZA BOT

Lightweight WhatsApp Bot Base built with Baileys.

<p>
  <img src="https://img.shields.io/badge/NodeJS-20+-green?style=flat-square">
  <img src="https://img.shields.io/badge/Baileys-Latest-blue?style=flat-square">
  <img src="https://img.shields.io/badge/Version-v1.0-purple?style=flat-square">
</p>

</div>

---

## Overview

A simple and scalable WhatsApp bot base designed for developers who want a clean foundation for creating their own bots.

### Features

- Multi Device Support
- Pairing Code Login
- Plugin System
- Case Handler
- Fast Startup
- Lightweight
- Easy To Customize
- Developer Friendly

---

## Structure

```bash
.
├── plugins/
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

## Installation

```bash
git clone https://github.com/username/repository
cd repository
npm install
node index.js
```

---

## Configuration

Edit `config.js`

```js
global.owner = "628xxxxxxxxxx"
global.botname = "AbgRevinza"
global.prefix = "."
```

---

## Creating Commands

Create a new file inside:

```bash
plugins/
```

Example:

```js
module.exports = {
  command: ['bot'],
  run: async (sock, m, { msg }) => {
    await m.reply('Bot Active')
  }
}
```

---

## Disclaimer

This project is intended for educational purposes only.

The author is not responsible for any misuse of this source code.

---

## Credits

- Baileys
- Node.js
- Revinza

---

<div align="center">

Made with ☕ by Revinza

</div>