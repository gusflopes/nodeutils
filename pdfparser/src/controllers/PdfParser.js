const fs = require("fs");
const pdf = require("pdf-parse");

let dataBuffer = fs.readFileSync("./samples/SUCUMBENCIAIS.pdf");

async function pdfRead(file) {
  const data = await pdf(file);

  // console.log(data.text);

  const dataJSON = await JSON.stringify(data.text);

  console.log(dataJSON);
  if (data.text.match(/Bloco I/)) {
    console.log("Tem bloco I");
  }

  return dataJSON;
}

class PdfParser {
  async index(req, res) {
    const data = await pdfRead(dataBuffer);

    const response = await data.split("\\n");
    const response2 = await response.join("");

    const inicio_credor = (await response2.indexOf("Credor:x")) + 8;
    const fim_credor = await response2.indexOf("Devedora:x");
    /*
    const credor = await response2.slice(
      inicio_credor,
      response2.length - fim_credor
    ); */
    const credor = await response2.substring(inicio_credor, fim_credor);

    return res.status(200).json({ inicio_credor, fim_credor, credor });
  }
}

pdfRead(dataBuffer);

export default new PdfParser();
