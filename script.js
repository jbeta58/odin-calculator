// ============================
// 1. Basic math functions
// ============================

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) return "Don't divide by 0";
  return a / b;
}

function percent(value, base = null) {
  value = Number(value);

  if (base !== null) {
    return (base * value) / 100;
  }

  return value / 100;
}

// ============================
// 2. Operate function
// ============================

function operate(operator, a, b) {
  a = Number(a);
  b = Number(b);

  switch (operator) {
    case "+":
      return add(a, b);
    case "-":
      return subtract(a, b);
    case "*":
      return multiply(a, b);
    case "/":
      return divide(a, b);
    default:
      return b;
  }
}

// ============================
// 3. State variables
// ============================

let firstOperand = "";
let secondOperand = "";
let currentOperator = null;
let shouldResetDisplay = false;

const display = document.querySelector(".display");
const buttons = document.querySelectorAll(".btn");

// ============================
// 4. Display helper
// ============================

function updateDisplay(value) {
  display.textContent = formatNumber(value);
}

function clearAll() {
  firstOperand = "";
  secondOperand = "";
  currentOperator = null;
  shouldResetDisplay = false;
  updateDisplay("0");
}

// ============================
// 5. Number handling
// ============================

function appendNumber(number) {
  if (display.textContent === "0" || shouldResetDisplay) {
    updateDisplay(number);
    shouldResetDisplay = false;
  } else {
    updateDisplay(display.textContent + number);
  }
}

function formatNumber(value) {
  if (value === "Don't divide by 0") return value;

  if (value === "" || value === null) return "0";

  // limpiar comas antes de cualquier cosa
  value = value.toString().replace(/,/g, "");

  // si solo es un punto, no formatear todavía
  if (value === ".") return "0.";

  const parts = value.split(".");

  // evitar convertir algo inválido
  if (isNaN(parts[0])) return value;

  parts[0] = parseInt(parts[0], 10).toLocaleString("en-US");

  return parts.join(".");
}

// ============================
// 6. Operator handling
// ============================

function chooseOperator(operator) {
  if (currentOperator !== null) {
    if (shouldResetDisplay) {
      // user pressed operator twice → just replace operator
      currentOperator = operator;
      return;
    }
    evaluate();
  }

  firstOperand = display.textContent.replace(/,/g, "");
  currentOperator = operator;
  shouldResetDisplay = true;
}

// ============================
// 7. Evaluation
// ============================

function evaluate() {
  if (currentOperator === null || shouldResetDisplay) return;

  secondOperand = display.textContent.replace(/,/g, "");

  let result = operate(currentOperator, firstOperand, secondOperand);

  if (typeof result === "number") {
    result = Math.round(result * 100000) / 100000; // round long decimals
  }

  updateDisplay(result);

  firstOperand = result;
  currentOperator = null;
  shouldResetDisplay = true;
}

// ============================
// 8. Decimal handling
// ============================

function appendDecimal() {
  if (shouldResetDisplay) {
    updateDisplay("0.");
    shouldResetDisplay = false;
    return;
  }

  if (!display.textContent.includes(".")) {
    updateDisplay(display.textContent + ".");
  }
}

// ============================
// 9. Backspace
// ============================

function backspace() {
  if (shouldResetDisplay) return;

  let current = display.textContent.slice(0, -1);
  updateDisplay(current || "0");
}

// ============================
// 9. Handle Percent
// ============================

function handlePercent() {
  if (display.textContent === "Don't divide by 0") return;

  let currentValue = Number(display.textContent.replace(/,/g, ""));

  // Si no hay operador → porcentaje simple
  if (currentOperator === null) {
    let result = currentValue / 100;
    updateDisplay(result);
    firstOperand = result;
    return;
  }

  let base = Number(firstOperand);
  let result;

  if (currentOperator === "+" || currentOperator === "-") {
    // porcentaje relativo
    result = (base * currentValue) / 100;
  } else {
    // multiplicación o división → porcentaje simple
    result = currentValue / 100;
  }

  updateDisplay(result);
}

// ============================
// 10. Button event listener
// ============================

buttons.forEach(button => {
  button.addEventListener("click", () => {

    if (button.dataset.value) {
      if (button.classList.contains("number")) {
        if (button.dataset.value === ".") {
          appendDecimal();
        } else {
          appendNumber(button.dataset.value);
        }
      } else {
        chooseOperator(button.dataset.value);
      }
    }

    if (button.dataset.action === "equals") {
        evaluate();
    }

    if (button.dataset.action === "clear") {
        clearAll();
    }

    if (button.dataset.action === "delete") {
        backspace();
    }

    if (button.dataset.action === "percent") {
        handlePercent();
    }
  });
});

document.addEventListener("keydown", (e) => {

  if (e.key >= 0 && e.key <= 9) {
    appendNumber(e.key);
  }

  if (e.key === ".") {
    appendDecimal();
  }

  if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") {
    chooseOperator(e.key);
  }

  if (e.key === "Enter" || e.key === "=") {
    evaluate();
  }

  if (e.key === "Backspace") {
    backspace();
  }

  if (e.key === "Escape") {
    clearAll();
  }

  if (e.key === "%") {
    handlePercent();
  }

});