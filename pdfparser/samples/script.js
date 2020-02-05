const fs = require("fs");
const pdf = require("pdf-parse");

let dataBuffer = fs.readFileSync("./SUCUMBENCIAIS.pdf");

async function pdfRead(file) {
  const data = await pdf(file);

  // console.log(data.text);

  const dataJSON = await JSON.stringify(data.text);

  console.log(dataJSON);
  if (data.text.match(/Bloco I/)) {
    console.log("Tem bloco I");
  }
}

pdfRead(dataBuffer);

/*
.then(data => function(data) {
  console.log(data.numpages);
  console.log(data.numrender);
  console.log(data.info);
  console.log(data.metadata);
  console.log(data.version);
  console.log(data.text);
});

console.log("---- Fim ----");

console.log(fs.readdirSync("./"));
*/
