const fs = require('fs');
const path = require('path');


let folderPath = path.join(__dirname, '/secret-folder/');


fs.promises.readdir(folderPath, { withFileTypes: true }).then(filenames => {
  for (let fileData of filenames) {
    if (!fileData.isDirectory()) {
      let filePath = path.join(folderPath, fileData.name);
      fs.stat(filePath, (err, stats) => {
        let fileExt = path.extname(fileData.name);
        console.log(`${fileData.name.replace(fileExt,'')}-${fileExt.replace('.','')}-${(stats.size/1024).toFixed(3)}kb`);
      });
    }
  }
}).catch(err => {
  console.log(err);
});