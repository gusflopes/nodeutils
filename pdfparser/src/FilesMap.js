//requiring path and fs modules
const path = require("path");
const fs = require("fs");

function readFiles(nextPath) {
  const directoryPath = nextPath;
//passsing directoryPath and callback function
fs.readdir(directoryPath, function(err, files) {
  //handling error
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  //listing all files using forEach
  files.forEach(function(file) {
    // Do whatever you want to do with the file
    if (!path.extname(file) && file !== ".DS_Store") {
      console.log(`${file} is a Directory`)
      const newDirectoryPath = path.join(directoryPath, file);
      readFiles(newDirectoryPath);
    } else {
    console.log(file, "in", directoryPath);
    }
  });
});

}

//joining path of directory
const directoryPath = path.join(__dirname, "..", "samples");
//passsing directoryPath and callback function
fs.readdir(directoryPath, function(err, files) {
  //handling error
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  //listing all files using forEach
  files.forEach(function(file) {
    // Do whatever you want to do with the file
    if (!path.extname(file) && file !== ".DS_Store") {
      console.log(`${file} is a Directory`)
      const newDirectoryPath = path.join(directoryPath, file);
      readFiles(newDirectoryPath);
    } /* else {
    console.log(file);
    } */
  });
});
