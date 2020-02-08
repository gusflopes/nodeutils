const pdf = require('pdf-parse');
const fs = require('fs');

async function pdfReader(file: String) {
  const data = await pdf(file);
  const dataJSON = await JSON.stringify(data.text);
  return dataJSON;
}

export default pdfReader;