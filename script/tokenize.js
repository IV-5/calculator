/* Tokenization algorithm */

// Tokenize input:
/**
 *
 * @param {String} input
 * @returns {Array} [Object]
 */
function tokenize(input) {
  const tokens = [];
  let index = 0;
  let prevToken = null;
  const postfixOperators = ["!", "%"];

  while (index < input.length) {
    const char = input[index];
    if (/\s/.test(char)) {
      index++;
      continue;
    }
    if (/[\d.]/.test(char)) {
      if (
        prevToken &&
        (["number", "constant", "rightParen"].includes(prevToken.type) ||
          (prevToken.type === "operator" &&
            ["%", "!"].includes(prevToken.value)))
      ) {
        tokens.push({ type: "operator", value: "*" });
      }
      let num = "";
      while (index < input.length && /[\d.]/.test(input[index])) {
        num += input[index];
        index++;
      }
      tokens.push({ type: "number", value: parseFloat(num) });
    } else if (/[+\-*/^%!]/.test(char)) {
      if (
        char === "-" &&
        (!prevToken ||
          ["operator", "leftParen", "function"].includes(prevToken?.type))
      ) {
        tokens.push({ type: "operator", value: "unary-" });
      } else if (
        char === "%" &&
        (!prevToken ||
          (!["number", "constant", "rightParen"].includes(prevToken?.type) &&
            !(
              prevToken.type === "operator" &&
              postfixOperators.includes(prevToken.value)
            )))
      ) {
        throw new Error('Missing operand before "%"');
      } else {
        tokens.push({ type: "operator", value: char });
      }
      index++;
    } else if (char === "!") {
      // New specific handling for factorial
      if (
        !prevToken ||
        !["number", "constant", "rightParen"].includes(prevToken?.type)
      ) {
        throw new Error('Missing operand before "!"');
      }
      tokens.push({ type: "operator", value: "!" });
      index++;
    } else if (/[()]/.test(char)) {
      if (
        char === "(" &&
        prevToken &&
        ["number", "constant", "rightParen"].includes(prevToken.type)
      ) {
        tokens.push({ type: "operator", value: "*" });
      }
      tokens.push({ type: char === "(" ? "leftParen" : "rightParen" });
      index++;
    } else {
      let word = "";
      while (index < input.length && /[a-zπe√]/.test(input[index])) {
        word += input[index];
        index++;
      }
      if (
        [
          "sin",
          "cos",
          "tan",
          "log",
          "ln",
          "√",
          "atan",
          "acos",
          "asin",
          "tanh",
          "sinh",
          "cosh",
          "asinh",
          "acosh",
          "atanh",
          "abs",
          "exp",
          "cbrt",
        ].includes(word)
      ) {
        if (
          prevToken &&
          ["number", "constant", "rightParen"].includes(prevToken.type)
        ) {
          tokens.push({ type: "operator", value: "*" });
        }
        tokens.push({ type: "function", value: word });
      } else if (word === "π") {
        if (
          prevToken &&
          ["number", "constant", "rightParen"].includes(prevToken.type)
        ) {
          tokens.push({ type: "operator", value: "*" });
        }
        tokens.push({ type: "constant", value: Math.PI });
      } else if (word === "e") {
        if (
          prevToken &&
          ["number", "constant", "rightParen"].includes(prevToken.type)
        ) {
          tokens.push({ type: "operator", value: "*" });
        }
        tokens.push({ type: "constant", value: Math.E });
      } else {
        throw new Error(`Unknown token: ${word}`);
      }
    }
    prevToken = tokens[tokens.length - 1];
  }
  return tokens;
}
