async function regexParser(regex: RegExp, data: String) {
  const output = await data.match(regex)[0];
  return output;
}

export default regexParser;