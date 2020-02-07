import ineparParser from '../parsers/ineparParser';
const fs = require('fs');

// Reading a static file  for now
let files = ["VILELA E LOPES CONTRATADOS", "SUCUMBENCIAIS", "CLIENTE"];
let dataBuffer = fs.readFileSync(`./samples/Inepar/SUCUMBENCIAIS.pdf`);

class PdfController {
  async index(req, res) {
    const response = await files.map(async file => {
      const dataBuffer = await fs.readFileSync(
        `./samples/Inepar/${file}.pdf`
      );
      
      const data = await ineparParser.pdfRead(dataBuffer);
      const response = await ineparParser.extractData(data);
      return response;
    });
    Promise.all(response).then(data => {
      return res.json(data);
    });
  }

  async show(req, res) {
    const data = await ineparParser.pdfRead(dataBuffer);

    const response = await ineparParser.extractData(data);

    return res.status(200).json(response);
  }
}

export default new PdfController();
