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
  async parser(req, res) {
    const data = await pdfRead(dataBuffer);

    return res.status(200).json({ hello: "world" });
  }
}

pdfRead(dataBuffer);

export default new PdfParser();
