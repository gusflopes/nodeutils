async function pdfCleaner(dataJSON: String) {
    // Tirar as quebras de linha
    const linesArray = await dataJSON.split("\\n");

    // Juntar os arrays usando espaço
    const dataString = await linesArray.join(" ");
  
    // Limpar espaços duplos
    const stringWithoutDoubleSpaces = await dataString.replace(/\s{2,}/g, " ");
  
    // Tirar espaços em branco entre palavras e "."
    const stringToParse = await stringWithoutDoubleSpaces.replace(/\s[.]/g, ".");
  
    return stringToParse; 
}

export default pdfCleaner;