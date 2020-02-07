const fs = require("fs");
const pdf = require("pdf-parse");

String.prototype.regexIndexOf = function(regex, startpos) {
  var indexOf = this.substring(startpos || 0).search(regex);
  return indexOf >= 0 ? indexOf + (startpos || 0) : indexOf;
};

String.prototype.regexLastIndexOf = function(regex, startpos) {
  regex = regex.global
    ? regex
    : new RegExp(
        regex.source,
        "g" + (regex.ignoreCase ? "i" : "") + (regex.multiLine ? "m" : "")
      );
  if (typeof startpos == "undefined") {
    startpos = this.length;
  } else if (startpos < 0) {
    startpos = 0;
  }
  var stringToWorkWith = this.substring(0, startpos + 1);
  var lastIndexOf = -1;
  var nextStop = 0;
  while ((result = regex.exec(stringToWorkWith)) != null) {
    lastIndexOf = result.index;
    regex.lastIndex = ++nextStop;
  }
  return lastIndexOf;
};

let file = fs.readFileSync(`./samples/Sicredi/input-1.pdf`);
// let file = fs.readFileSync(`./samples/Sicredi/input.pdf`);

  async function pdfRead(file) {
    const data = await pdf(file);
  
    const dataJSON = await JSON.stringify(data.text);

    // Tirar as quebras de linha
    const linesArray = await dataJSON.split("\\n");

    // Juntar os arrays usando espaço
    const dataString = await linesArray.join(" ");

    // Limpar espaços duplos
    const stringWithoutDoubleSpaces = await dataString.replace(/\s{2,}/g, " ");

    // Tirar espaços em branco entre palavras e "."
    const stringToParse = await stringWithoutDoubleSpaces.replace(/\s[.]/g, ".");


  
    console.log(stringToParse);
  }

  pdfRead(file);
