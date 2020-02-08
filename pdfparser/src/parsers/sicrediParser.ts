const fs = require("fs");
import pdfReader from './pdfReader';
import pdfCleaner from './pdfCleaner';
import stringParser from './stringParser';
import regexParser from './regexParser';

// let file = fs.readFileSync(`./samples/Sicredi/input.pdf`);
interface Parameters {
  field: String,
  regexMethod: Boolean,
  firstIndex: String,
  secondIndex: RegExp,
}
// Comprovante Transferencia Sicredi
const parameters = [
  {
    field: 'data',
    regexMethod: true,
    firstIndex: null,
    secondIndex: /\d{2}\/\d{2}\/\d{4}/,
  }, {
    field: 'valor',
    regexMethod: false,
    firstIndex: 'Finalidade: ',
    secondIndex: /Valor a Transferir \(R\$\):/gm,
  }, {
    field: 'cpfCnpj',
    regexMethod: false,
    firstIndex: 'Data Transferência: ',
    secondIndex: /CPF\/CNPJ/gm,
  }, {
    field: 'favorecido',
    regexMethod: false,
    firstIndex: 'CPF/CNPJ: ',
    secondIndex:  /Favorecido:/gm,
  }, {
    field: 'observacoes',
    regexMethod: false,
    firstIndex: 'Identificador: ',
    secondIndex: /Motivo Transferência/gm,
}];

async function sicrediTransferenciaParser(input: String, fields: Array<Parameters>) {
  let response = [];
  const resultPromises = Promise.all(await fields.map(async f => {
    if (f.regexMethod) {
      return await regexParser(f.secondIndex, input);
    } else {
      return await stringParser(f.firstIndex, f.secondIndex, input);
    }
  })).then(resultPromises => {return resultPromises});
  console.log('----');
  return resultPromises;
}


let file = fs.readFileSync(`./samples/Sicredi/input-1.pdf`);



// Format PDF
async function generalParser(file) {
  const pdfText = await pdfReader(file).then(data => {return data})
  
  const pdfCleansed = await pdfCleaner(pdfText);
  
  // Identifica qual parser precisa chamar e chama
  // No case é Sicredi/Comprovante de Transferência
  const pdfParsed = await sicrediTransferenciaParser(pdfCleansed, parameters);
  
  console.log('pdfParsed', pdfParsed);
  const resultObj = {};
  let index = 0;
  for (const obj of parameters) {
      const objValues = Object.values(obj);
      resultObj[obj.field] = pdfParsed[index];
      index++;
  }
console.log(resultObj);
  /*
  let response = {}
  

  const newData = [];
  const result = {}
    pdfParsed.map((value,index) => {
      result[parameters[index].field] = value;
      newData.push(result);
      console.log('index', index, 'value:', value)
    })

  console.log('response', response);
  console.log('newData', newData);
  */
  return pdfParsed;

}


generalParser(file);


/*** Dados a Extrair
 * output = {
 *  data: `Hora Transferência: ${data}Data Transferência`
 *  valor: `Finalidade: ${valor}Valor a Transferir (R$):`
 *  cpfCnpj: `Data Transferência: ${cpfCnpj}CPF/CNPJ`
 *  favorecido: `CPF/CNPJ: ${favorecido}Favorecido:`
 *  observacoes: `Identificador: ${string}Motivo Transferência`
 * }
 */


/* Campos para Validação
## Comprovante de Transferência
- Autenticação Eletrônica:
- Tarifa (R$):
- Identificador:
- Motivo Transferência:
- Finalidade: 
- Valor a Transferir (R$):
- Hora Transferência:
- Data Transferência:
- CPF/CNPJ: 
- Favorecido:
- Conta Destino: 
- Tipo de Conta Destino:
- Cooperativa/Agência: 
- Instituição:
- Número de Controle:
- Conta Origem:
- Cooperativa Origem:
- Solicitante:
- Impresso em
- Conta Corrente:
- Cooperativa Associado:
- TED Outra Titularidade
- * A transação acima foi realizada via aplicativo Sicredi conforme as condições especificadas neste comprovante. * Os dados digitados são de responsabilidade do usuário. Sicredi Fone 3003 4770 (Capitais e Regiões Metropolitanas) 0800 724 4770 (Demais Regiões) SAC 0800 724 7220 Ouvidoria 0800 646 2519

*/
