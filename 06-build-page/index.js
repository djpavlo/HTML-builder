const fs = require('fs');
const path = require('path');

let folderProjectPath = path.join(__dirname, '/project-dist/');
let templatefilePath = path.join(__dirname, '/template.html');
let componentsPath = path.join(__dirname, '/components/');
let template = '';

fs.rm(folderProjectPath, { recursive: true }, () => { //remove folder
  fs.mkdir(folderProjectPath, { recursive: true }, () => { //create folder
    fs.readFile(templatefilePath, 'utf-8', (err, data) => { //read template file
      if (err) {
        console.log(err);
      } else {
        template = data;
        fs.promises.readdir(componentsPath, { withFileTypes: true }).then(files => {
          const promises = [];

          files.forEach(file => { //read components
            if (!file.isDirectory() && path.extname(file.name) === '.html') {
              promises.push(readFromFile(file));
            }
          });

          promises.push(combineStyles());
          let folderToPath = path.join(folderProjectPath, '/assets/');
          let folderFromPath = path.join(__dirname, '/assets/');
          promises.push(assetsCopy(folderToPath, folderFromPath));

          Promise.all(promises).then(() => { //write template file
            fs.writeFile(path.join(folderProjectPath, 'index.html'), template, 'utf-8', (err) => {
              if (err) {
                console.log(err);
              } else {
                console.log('Build success');
              }
            });
          });
        });
      }
    });

  });
});

function assetsCopy(folderToPath, folderFromPath) { //copy assets

  fs.mkdir(folderToPath, { recursive: true }, () => {
    fs.promises.readdir(folderFromPath, { withFileTypes: true }).then(filenames => {
      for (let fileData of filenames) {
        if (!fileData.isDirectory()) {
          let fileFromPath = path.join(folderFromPath, fileData.name);
          let fileToPath = path.join(folderToPath, fileData.name);
          fs.copyFile(fileFromPath, fileToPath, (err) => {
            if (err) throw err;
          });
        } else {
          assetsCopy(path.join(folderToPath, fileData.name), path.join(folderFromPath, fileData.name));
        }
      }
    }).catch(err => {
      console.log(err);
    });
  });
}

function combineStyles() { //combine styles to one file
  let folderPath = path.join(__dirname, '/styles/');

  let resData = [];

  fs.promises.readdir(folderPath, { withFileTypes: true }).then(filenames => { //read styles
    const promises = [];
    for (let fileData of filenames) {
      if (!fileData.isDirectory() && path.extname(fileData.name) === '.css') {
        promises.push(readStyleFromFile(path.join(folderPath, fileData.name)));
      }
    }

    Promise.all(promises).then(() => { //combine styles
      let fileOutPath = path.join(folderProjectPath, '/style.css');
      var stream = new fs.WriteStream(fileOutPath, { encoding: 'utf-8' });
      stream.write(resData.join('\n'));
      stream.end();
    });
  });

  function readStyleFromFile(file) { //read style file
    return new Promise(resolve => {
      fs.readFile(file, function(err, data) {
        if (err) console.log(err);
        resData.push(data);
        resolve();
      });
    });
  }
}


function readFromFile(file) { //read html file
  return new Promise(resolve => {
    let filePath = path.join(componentsPath, file.name);
    fs.readFile(filePath, 'utf-8', function(err, data) {
      if (err) {
        console.log(err);
      } else {

        let fileName = file.name.split('.')[0];
        template = template.replace(`{{${fileName}}}`, data);
        resolve();
      }
    });
  });
}