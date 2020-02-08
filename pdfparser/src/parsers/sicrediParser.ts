const fs = require("fs");
import pdfReader from './pdfReader';
import pdfCleaner from './pdfCleaner';
import stringParser from './stringParser';
import regexParser from './regexParser';

/**
 * TODO
 * [ ] Transferência Sicredi Agendado: salvar arquivo e ajustar os parameters;
 * [ ] 
 */

interface Parameters {
  field: String,
  regexMethod: Boolean,
  firstIndex: String,
  secondIndex: RegExp,
}
const parameterSicrediTedOutratitularidadeConfirmado = [
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
const parameterSicrediTransferenciaSicrediConfirmado = [{
  field: 'data',
  regexMethod: true,
  firstIndex: null,
  secondIndex: /\d{2}\/\d{2}\/\d{4}/,
}, {
  field: 'valor',
  regexMethod: false,
  firstIndex: 'Motivo da Transferência: ',
  secondIndex: /Valor Transferido \(R\$\):/gm,
}, {
  field: 'favorecido',
  regexMethod: false,
  firstIndex: 'Origem dos Recursos: ',
  secondIndex:  /Favorecido:/gm,
}, {
  // Transferência entre contas do mesmo banco não tem cpfCnpj, usando ag e conta
  field: 'agencia',
  regexMethod: false,
  firstIndex: 'Conta Destino: ',
  secondIndex:  /Cooperativa Destino:/gm,
}, {
  field: 'conta',
  regexMethod: false,
  firstIndex: 'Favorecido: ',
  secondIndex: /Conta Destino:/gm,
}, {
  field: 'observacoes',
  regexMethod: false,
  firstIndex: 'Autenticação Eletrônica: ',
  secondIndex: /Motivo da Transferência/gm,
}];
const parametersSicrediBoleto = [{
  field: 'data',
  regexMethod: true,
  firstIndex: null,
  secondIndex: /\d{2}\/\d{2}\/\d{4}/,
}, {
  field: 'valor',
  regexMethod: false,
  firstIndex: 'Descrição do Pagamento: ',
  secondIndex: /Valor Pago \(R\$\):/gm,
}, {
  field: 'favorecido',
  regexMethod: false,
  firstIndex: 'Nome Fantasia do Beneficiário: ',
  secondIndex:  /Razão Social do Beneficiário:/gm,
}, {
  field: 'cpfCnpj',
  regexMethod: false,
  firstIndex: 'Nome do Pagador: ',
  secondIndex:  /CPF\/CNPJ do Beneficiário:/gm,
}, {
  field: 'observacoes',
  regexMethod: false,
  firstIndex: 'Autenticação Eletrônica: ',
  secondIndex: /Descrição do Pagamento:/gm,
}];
const parameterSicrediTedOutratitularidadeAgendado = [
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
    firstIndex: 'Data de Criação: ',
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
const parameterSicrediTransferenciaSicrediAgendado = [{
  field: 'data',
  regexMethod: true,
  firstIndex: null,
  secondIndex: /\d{2}\/\d{2}\/\d{4}/,
}, {
  field: 'valor',
  regexMethod: false,
  firstIndex: 'Motivo da Transferência: ',
  secondIndex: /Valor Transferido \(R\$\):/gm,
}, {
  field: 'favorecido',
  regexMethod: false,
  firstIndex: 'Origem dos Recursos: ',
  secondIndex:  /Favorecido:/gm,
}, {
  // Transferência entre contas do mesmo banco não tem cpfCnpj, usando ag e conta
  field: 'agencia',
  regexMethod: false,
  firstIndex: 'Conta Destino: ',
  secondIndex:  /Cooperativa Destino:/gm,
}, {
  field: 'conta',
  regexMethod: false,
  firstIndex: 'Favorecido: ',
  secondIndex: /Conta Destino:/gm,
}, {
  field: 'observacoes',
  regexMethod: false,
  firstIndex: 'Autenticação Eletrônica: ',
  secondIndex: /Motivo da Transferência/gm,
}];

  /*******************************
   * PARSERS
   *******************************/
  // let parser = parameterSicrediTedOutratitularidadeConfirmado;
  // let parser = parameterSicrediTransferenciaSicrediConfirmado;
  // let parser = parameterSicrediTedOutratitularidadeAgendado;
  // let parser = parameterSicrediTransferenciaSicrediAgendado; 
  let parser = parametersSicrediBoleto;

  /*******************************
   * FILES
   *******************************/
  // ###### ATENÇÃO AQUI #########
  // Salvar arquivos na segunda-feira !!!!!!!!!!!!!!!!!!!!!!!
  // let file = fs.readFileSync(`./samples/Sicredi/sicredi-ted-outratitularidade-confirmado-1.pdf`);
  // let file = fs.readFileSync(`./samples/Sicredi/sicredi-ted-outratitularidade-confirmado-2.pdf)

  // let file = fs.readFileSync(`./samples/Sicredi/sicredi-ted-outratitularidade-agendado-1.pdf`);
  // let file = fs.readFileSync(`./samples/Sicredi/sicredi-ted-outratitularidade-agendado-2.pdf`);

  // let file = fs.readFileSync(`./samples/Sicredi/sicredi-transferencia-sicredi-confirmado-1.pdf`);
  // let file = fs.readFileSync(`./samples/Sicredi/sicredi-transferencia-sicredi-confirmado-2.pdf`);

  // let file = fs.readFileSync(`./samples/Sicredi/sicredi-transferencia-sicredi-agendado-1.pdf`);
  // let file = fs.readFileSync(`./samples/Sicredi/sicredi-transferencia-sicredi-agendado-2.pdf`);

  let file = fs.readFileSync(`./samples/Sicredi/sicredi-boletos-1.pdf`);
  // let file = fs.readFileSync(`./samples/Sicredi/sicredi-boletos-2.pdf`);


// let file = fs.readFileSync(`./samples/Sicredi/input.pdf`);

async function sicrediTransferenciaParser(input: String, fields: Array<Parameters>) {
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




// Format PDF
async function generalParser(file) {
  // Extrair o texto do PDF
  const pdfText = await pdfReader(file).then(data => {return data})
  
  // Sanitização dos dados extraídos
  const pdfCleansed = await pdfCleaner(pdfText);
  
  // Comentar aqui para estudar estrutura
  // return console.log(pdfCleansed);

  // Desenvolver
  // Identificar qual tipo de documento e qual parser precisa ser chamado
  const parameters = parser

  // Neste caso, estou passando Sicredi/Comprovante de Transferência Agendado como default
  const pdfParsed = await sicrediTransferenciaParser(pdfCleansed, parameters);
  
  console.log('pdfParsed is an Array: ', pdfParsed);
  const resultObj = {};
  let index = 0;
  for (const obj of parameters) {
      // const objValues = Object.values(obj);
      resultObj[obj.field] = pdfParsed[index];
      index++;
  }
  console.log('resultObj is an Object:')
  // console.log(resultObj);
  
  return resultObj;

}

// Chamada assíncrona da função para simular o comportamento real
// O método vai ser chamado por uma função asíncrona e, quando resolver, salvar algo no banco 
async function asyncCall() {
  console.log(await generalParser(file));
}
asyncCall();

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
