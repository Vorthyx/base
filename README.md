<div align="center"> 
<img src="https://files.catbox.moe/8aebsw.jpg" width="80%">
«Modern WhatsApp Bot Base powered by Baileys.»

<p>
<img src="https://img.shields.io/badge/Version-1.0-7c3aed">
<img src="https://img.shields.io/badge/NodeJS-20+-22c55e">
</p></div>Features

- Multi Device
- Pairing Code
- Plugin System
- Dynamic Commands
- Lightweight
- Easy Customization
- Fast Response



## Structure
```bash
├── plugins/
│  ├── main-menu.js
│  └──dll
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

Example Plugin

module.exports = {
  command: ["ngocok"],

  run: async (sock, m) => {
    m.reply("nyoli")
  }
}

---

<div align="center">Basr Bot

Made by Revinza

</div>