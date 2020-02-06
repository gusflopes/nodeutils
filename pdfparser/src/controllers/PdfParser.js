const fs = require("fs");
const pdf = require("pdf-parse");

let dataBuffer = fs.readFileSync("./samples/SUCUMBENCIAIS.pdf");

async function pdfRead(file) {
  const data = await pdf(file);

  // console.log(data.text);

  const dataJSON = await JSON.stringify(data.text);

  // console.log(dataJSON);
  if (data.text.match(/Bloco I/)) {
    console.log("Tem bloco I");
  }

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

async function getCredor(data) {
  const startString = (await data.regexIndexOf(/Credor(.*?): x/gm, 1)) + 9;
  const endString = await data.regexIndexOf(/Devedor(.*?): x/gm, -1);
  const credor = await data.substring(startString, endString);
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
  console.log("valor", valor);
  return valor;
}

async function getCalcDate(data) {
  const startString = (await data.regexIndexOf(/data do cálculo: /gim, 1)) + 17;
  const endString = await data.regexIndexOf(/Finalidade: /gim, -1);
  const dataCalculo = await data.substring(startString, endString);
  console.log("dataCalculo", dataCalculo);
  return dataCalculo;
}

async function getLawsuitNumber(data) {
  const startString = (await data.regexIndexOf(/Processo n(.*): /gim, 1)) + 13;
  const endString = await data.regexIndexOf(/Ação: /gim, -1);
  const valor = await data.substring(startString, endString);
  console.log("valor", valor);
  return valor;
}

class PdfParser {
  async index(req, res) {
    const data = await pdfRead(dataBuffer);

    // Tirar as quebras de linha
    const response = await data.split("\\n");

    // Juntar os arrays usando espaço
    const newString = await response.join(" ");

    // Limpar espaços duplos
    const response2 = await newString.replace(/\s{2,}/g, " ");

    // Tirar espaços em branco entre palavras e "."
    const response3 = await response2.replace(/\s[.]/g, ".");

    // Filtrar o Credor
    const credor = await getCredor(response3);

    // Filtrar Devedor
    const devedor = await getDevedor(response3);

    // Filtrar valor
    const valor = await getValor(response3);

    // Filtrar Data do Cálculo
    const data_calc = await getCalcDate(response3);

    // Filtrar processo
    const processo = await getLawsuitNumber(response3);

    return res.status(200).json({
      processo,
      credor,
      devedor,
      valor,
      data_calc
      /* response3,
      response2,
      response,
      data */
    });
  }
}

pdfRead(dataBuffer);

export default new PdfParser();
