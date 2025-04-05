// Handle calculator inputs:

// Regex for function backspace handling
const functionRegex =
  /(sin|cos|tan|sinh|cosh|tanh|log|ln|√|atan|acos|asin|atanh|asinh|acosh|abs|exp|cbrt)\($/;

/**
 *
 * @param {String} character
 * @returns {void}
 */
function handleInput(character) {
  const value = String(character);
  const lastChar = currentInput.slice(-1);
  const operatorList = ["+", "-", "*", "/", "^", "%", "!"];
  const binaryOperators = ["+", "-", "*", "/", "^"];
  const postfixOperators = ["%", "!"];
  const isOperator = operatorList.includes(value);
  const isDecimal = value === ".";

  if (value === "AC") {
    currentInput = "";
    isResultDisplayed = false;
    resultDisplay.textContent = "";
  } else if (value === "⌫") {
    if (!isResultDisplayed) {
      const match = currentInput.match(functionRegex);
      if (match) {
        const toRemove = match[0];
        currentInput = currentInput.slice(0, -toRemove.length);
      } else {
        currentInput = currentInput.slice(0, -1);
      }
    }
  } else if (value === "=") {
    if (isResultDisplayed || currentInput === "") return;
    const expression = currentInput;
    try {
      const tokens = tokenize(expression);
      const postfix = shuntingYard(tokens);
      const result = evaluatePostfix(postfix, isDegreeMode);

      if (isNaN(result)) throw Error("Not a number");
      if (!isFinite(result)) throw Error("Infinity");

      currentInput = result.toString();
      isResultDisplayed = true;
      resultDisplay.textContent = "";

      const historyEntry = {
        expression,
        result,
        mode: isDegreeMode ? "Deg" : "Rad",
        timestamp: Date.now(),
      };

      // Store expression
      historyArray.unshift(historyEntry);
      syncHistoryUI();
    } catch (error) {
      isResultDisplayed = false;
      resultDisplay.textContent = error.message;
    }
  } else if (value === "toggleMode") {
    isDegreeMode = !isDegreeMode;
    const angleBtn = document.querySelector(".calc-buttons .mode-toggle");
    if (angleBtn) angleBtn.textContent = isDegreeMode ? "DEG" : "RAD";
  } else {
    if (isResultDisplayed) {
      if (/[\d.(]/.test(value)) {
        if(isDecimal) {
           currentInput = "0";
           currentInput += value;
        } else {
           currentInput = value;
        }
      } else if (isOperator && isValidNumber(currentInput)) {
        currentInput += value;
      } else if (isOperator && ["-"].includes(value)) {
        currentInput = value;
      } else {
        return;
      }
      isResultDisplayed = false;
    } else if (isOperator) {
      if (currentInput === "") {
        if (value === "-") {
          currentInput = value;
        }
      } else {
        if (operatorList.includes(lastChar)) {
          if (currentInput.length === 1) {
            if (value === "-") {
              currentInput = value;
            }
          } else {
            if (
              binaryOperators.includes(lastChar) &&
              binaryOperators.includes(value)
            ) {
              currentInput = currentInput.slice(0, -1) + value;
            } else if (postfixOperators.includes(value)) {
              const secChar = currentInput.charAt(currentInput.length - 2);

              if (!postfixOperators.includes(lastChar)) {
                currentInput += value;
              } else {
                if (lastChar !== value && !postfixOperators.includes(secChar)) {
                  currentInput += value;
                } else if (value !== secChar) {
                  currentInput = currentInput.slice(0, -1) + value;
                }
              }
            } else {
              currentInput += value;
            }
          }
        } else {
          currentInput += value;
        }
      }
    } else if (isDecimal) {
      const lastSegment = currentInput.split(/[+*/^!%()-]/).pop();
      if (lastSegment === "" || lastSegment === "-") {
        currentInput += "0";
      }
      if (lastChar === "." || /\d*\.\d*$/.test(lastSegment)) {
        return;
      }
      currentInput += value;
    } else {
      currentInput += value;
    }
  }

  if (value !== "=" && value !== "AC" && !isResultDisplayed) {
    if (currentInput !== "") {
      try {
        const tokens = tokenize(currentInput);
        const postfix = shuntingYard(tokens);
        const result = evaluatePostfix(postfix, isDegreeMode);

        if (isNaN(result)) throw Error("Not a number");
        if (!isFinite(result)) throw Error("Infinity");
        resultDisplay.textContent = result;
      } catch (error) {
        resultDisplay.textContent = "";
      }
    } else {
      resultDisplay.textContent = "";
    }
  }

  updateDisplay();
  inputDisplay.scrollLeft = inputDisplay.scrollWidth - inputDisplay.clientWidth;
  resultDisplay.scrollLeft =
    resultDisplay.scrollWidth - resultDisplay.clientWidth;
}
