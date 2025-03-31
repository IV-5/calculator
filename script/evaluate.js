// Evaluate postfix expression
function evaluatePostfix(postfix, isDegreeMode) {
  const stack = [];

  postfix.forEach((token) => {
    if (token.type === "number" || token.type === "constant") {
      stack.push(token.value);
    } else if (token.type === "operator") {
      if (token.value === "unary-") {
        if (stack.length < 1)
          throw new Error("Missing operand for unary minus (-X)");
        stack.push(-stack.pop());
      } else if (token.value === "!") {
        if (stack.length < 1) throw new Error('Missing operand before "!"');
        stack.push(factorial(stack.pop()));
      } else if (token.value === "%") {
        if (stack.length < 1) throw new Error('Missing operand before "%"');
        stack.push(stack.pop() / 100);
      } else {
        if (stack.length < 2)
          throw new Error(`Missing operand for "${token.value}"`);
        const b = stack.pop();
        const a = stack.pop();
        switch (token.value) {
          case "+":
            stack.push(a + b);
            break;
          case "-":
            stack.push(a - b);
            break;
          case "*":
            stack.push(a * b);
            break;
          case "/":
            if (b === 0) throw new Error("Division by zero");
            stack.push(a / b);
            break;
          case "^":
            stack.push(Math.pow(a, b));
            break;
        }
      }
    } else if (token.type === "function") {
      if (stack.length < 1)
        throw new Error(`Missing argument for ${token.value}(...) function`);
      let arg = stack.pop();
      if (isDegreeMode && ["sin", "cos", "tan"].includes(token.value)) {
        arg = (arg * Math.PI) / 180;
      }
      switch (token.value) {
        case "sin":
          stack.push(Math.sin(arg));
          break;
        case "cos":
          stack.push(Math.cos(arg));
          break;
        case "tan":
          stack.push(Math.tan(arg));
          break;
        case "log":
          if (arg <= 0)
            throw new Error(
              "log(...) function argument must be greater than 0"
            );
          stack.push(Math.log10(arg));
          break;
        case "ln":
          if (arg <= 0)
            throw new Error("ln(...) function argument must be greater than 0");
          stack.push(Math.log(arg));
          break;
        case "√":
          if (arg < 0)
            throw new Error("√(...) function argument must be non-negative");
          stack.push(Math.sqrt(arg));
          break;
        case "atan":
          if (isDegreeMode) {
            stack.push((Math.atan(arg) * 180) / Math.PI);
          } else {
            stack.push(Math.atan(arg));
          }
          break;
        case "acos":
          if (arg < -1 || arg > 1)
            throw new Error(
              "acos(...) function argument must be between -1 and 1"
            );
          if (isDegreeMode) {
            stack.push((Math.acos(arg) * 180) / Math.PI);
          } else {
            stack.push(Math.acos(arg));
          }
          break;
        case "asin":
          if (arg < -1 || arg > 1)
            throw new Error(
              "asin(...) function argument must be between -1 and 1"
            );
          if (isDegreeMode) {
            stack.push((Math.asin(arg) * 180) / Math.PI);
          } else {
            stack.push(Math.asin(arg));
          }
          break;
        case "sinh":
          stack.push(Math.sinh(arg));
          break;
        case "cosh":
          stack.push(Math.cosh(arg));
          break;
        case "tanh":
          stack.push(Math.tanh(arg));
          break;
        case "asinh":
          stack.push(Math.asinh(arg));
          break;
        case "acosh":
          if (arg < 1)
            throw new Error(
              "acosh(...) function argument must be greater than or equal to 1"
            );
          stack.push(Math.acosh(arg));
          break;
        case "atanh":
          if (arg <= -1 || arg >= 1)
            throw new Error(
              "atanh(...) function argument must be between -1 and 1"
            );
          stack.push(Math.atanh(arg));
          break;
        case "abs":
          stack.push(Math.abs(arg));
          break;
        case "exp":
          stack.push(Math.exp(arg));
          break;
        case "cbrt":
          stack.push(Math.cbrt(arg));
          break;
      }
    }
  });

  if (stack.length !== 1) throw new Error("Bad expression");
  return stack[0];
}
