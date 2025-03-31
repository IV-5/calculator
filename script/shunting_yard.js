// Operator properties
const operators = {
  "+": { precedence: 1, associativity: "left" },
  "-": { precedence: 1, associativity: "left" },
  "*": { precedence: 2, associativity: "left" },
  "/": { precedence: 2, associativity: "left" },
  "^": { precedence: 3, associativity: "right" },
  "!": { precedence: 6, associativity: "left" },
  "unary-": { precedence: 5, associativity: "right" },
  "%": { precedence: 6, associativity: "left" },
};

// Shunting-yard algorithm
function shuntingYard(tokens) {
  const output = [];
  const operatorStack = [];

  tokens.forEach((token) => {
    if (token.type === "number" || token.type === "constant") {
      output.push(token);
    } else if (token.type === "function") {
      operatorStack.push(token);
    } else if (token.type === "operator") {
      while (operatorStack.length > 0) {
        const topOp = operatorStack[operatorStack.length - 1];
        if (
          topOp.type === "operator" &&
          ((operators[token.value].associativity === "left" &&
            operators[token.value].precedence <=
              operators[topOp.value].precedence) ||
            (operators[token.value].associativity === "right" &&
              operators[token.value].precedence <
                operators[topOp.value].precedence))
        ) {
          output.push(operatorStack.pop());
        } else {
          break;
        }
      }
      operatorStack.push(token);
    } else if (token.type === "leftParen") {
      operatorStack.push(token);
    } else if (token.type === "rightParen") {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1].type !== "leftParen"
      ) {
        output.push(operatorStack.pop());
      }
      if (operatorStack.length === 0)
        throw new Error(`Mismatched parentheses "("`);
      operatorStack.pop();
      if (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1].type === "function"
      ) {
        output.push(operatorStack.pop());
      }
    }
  });

  while (operatorStack.length > 0) {
    const op = operatorStack.pop();
    if (op.type === "leftParen") throw new Error(`Mismatched parentheses ")"`);
    output.push(op);
  }
  return output;
}
