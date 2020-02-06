const fs = require("fs");
const pdf = require("pdf-parse");

async function pdfRead(file) {
  const data = await pdf(file);

  const dataJSON = await JSON.stringify(data.text);

  /*
  if (data.text.match(/Bloco I/)) {
    console.log("Tem bloco I");
  }
  */

  return dataJSON;
}

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

async function verifyExequente(data) {
  if (data.match(/Exequente: /)) {
    console.log("Tem Exequente");
    const response = data.substring(11, data.length);
    return response;
  }
  return null;
}

async function getCredor(data) {
  const startString = (await data.regexIndexOf(/Credor(.*?): x/gm, 1)) + 9;
  const endString = await data.regexIndexOf(/Devedor(.*?): x/gm, -1);
  const credor = await data.substring(startString, endString);
  const exequente = await verifyExequente(credor);
  if (exequente) {
    return exequente;
  }
  return credor;
}

async function getDevedor(data) {
  const startString = (await data.regexIndexOf(/Devedor(.*?): x/gm, 1)) + 11;
  const endString = await data.regexIndexOf(/Origem:/gm, -1);
  const devedor = await data.substring(startString, endString);
  return devedor;
}

async function getValor(data) {
  const startString = (await data.regexIndexOf(/valor da dívida: /gim, 1)) + 17;
  const endString = await data.regexIndexOf(/data do cálculo: /gim, -1);
  const valor = await data.substring(startString, endString);
  return valor;
}

async function getDataCalculo(data) {
  const startString = (await data.regexIndexOf(/data do cálculo: /gim, 1)) + 17;
  const endString = await data.regexIndexOf(/Finalidade: /gim, -1);
  const dataCalculo = await data.substring(startString, endString);
  return dataCalculo;
}

async function getProcesso(data) {
  const startString = (await data.regexIndexOf(/Processo n(.*): /gim, 1)) + 13;
  const endString = await data.regexIndexOf(/Ação: /gim, -1);
  const valor = await data.substring(startString, endString);
  return valor;
}

async function extractData(data) {
  // Tirar as quebras de linha
  const linesArray = await data.split("\\n");

  // Juntar os arrays usando espaço
  const dataString = await linesArray.join(" ");

  // Limpar espaços duplos
  const stringWithoutDoubleSpaces = await dataString.replace(/\s{2,}/g, " ");

  // Tirar espaços em branco entre palavras e "."
  const stringToParse = await stringWithoutDoubleSpaces.replace(/\s[.]/g, ".");

  // Filtrar o Credor
  const credor = await getCredor(stringToParse);

  // Filtrar Devedor
  const devedor = await getDevedor(stringToParse);

  // Filtrar valor
  const valor = await getValor(stringToParse);

  // Filtrar Data do Cálculo
  const data_calc = await getDataCalculo(stringToParse);

  // Filtrar processo
  const processo = await getProcesso(stringToParse);

  const response = { processo, credor, devedor, valor, data_calc };
  return response;
}

// Reading a static file  for now
let files = ["VILELA E LOPES CONTRATADOS", "SUCUMBENCIAIS", "CLIENTE"];
let dataBuffer = fs.readFileSync(`./samples/ignore_file/SUCUMBENCIAIS.pdf`);

class PdfController {
  async index(req, res) {
    const response = await files.map(async file => {
      const dataBuffer = await fs.readFileSync(
        `./samples/ignore_file/${file}.pdf`
      );
      const data = await pdfRead(dataBuffer);
      const response = await extractData(data);
      return response;
    });
    Promise.all(response).then(data => {
      return res.json(data);
    });
  }

  async show(req, res) {
    const data = await pdfRead(dataBuffer);

    const response = await extractData(data);

    return res.status(200).json(response);
  }
}

pdfRead(dataBuffer);

export default new PdfController();
