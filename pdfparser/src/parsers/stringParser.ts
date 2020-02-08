
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

async function stringParser(firstIndex:String, secondIndex: RegExp, data:String) {
  const startString = (await data.regexIndexOf(firstIndex, 1)) + firstIndex.length;
  // console.log('startString', startString);
  const endString = await data.regexIndexOf(secondIndex, 0);
  // console.log('endString', endString);
  const output = await data.substring(startString, endString);
  // console.log('output', output);
  return output;
}

export default stringParser;