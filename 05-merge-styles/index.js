const fs = require('fs');
const path = require('path');

let folderPath = path.join(__dirname, '/styles/');

let resData = [];

fs.promises.readdir(folderPath, { withFileTypes: true }).then(filenames => {
  const promises = [];
  for (let fileData of filenames) {
    if (!fileData.isDirectory() && path.extname(fileData.name) === '.css') {
      promises.push(readFromFile(path.join(folderPath, fileData.name)));
    }
  }

  Promise.all(promises).then(() => {

    let fileOutPath = path.join(__dirname, '/project-dist', '/bundle.css');
    var stream = new fs.WriteStream(fileOutPath, { encoding: 'utf-8' });
    stream.write(resData.join('\n'));
    stream.end();
  });
});

function readFromFile(file) {
  return new Promise(resolve => {
    fs.readFile(file, function(err, data) {
      if (err) console.log(err);
      resData.push(data);
      resolve();
    });
  });
}