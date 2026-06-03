const fs = require('fs');
const chalk = require('chalk');

global.owner = ['6283167006954'];  
global.premium = ['6283167006954'];
global.packname = 'ʀᴇᴠɪɴᴢᴀ-ʙᴏᴛ';
global.author = 'RevinzaModsd';
global.prefix = '.'; 


let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file)
  console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
  delete require.cache[file]
  require(file)
});

