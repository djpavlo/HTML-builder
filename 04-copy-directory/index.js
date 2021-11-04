const fs = require('fs');
const path = require('path');


let folderFromPath = path.join(__dirname, '/files/');
let folderToPath = path.join(__dirname, '/files-copy/');



fs.rmdir(folderToPath, { recursive: true }, () => {
  fs.mkdir(folderToPath, { recursive: true }, () => {
    fs.promises.readdir(folderFromPath, { withFileTypes: true }).then(filenames => {
      for (let fileData of filenames) {
        if (!fileData.isDirectory()) {
          let fileFromPath = path.join(folderFromPath, fileData.name);
          let fileToPath = path.join(folderToPath, fileData.name);
          fs.copyFile(fileFromPath, fileToPath, (err) => {
            if (err) throw err;
          });
        }
      }
    }).catch(err => {
      console.log(err);
    });
  });
});