/* CONSTANTS */
const BACKSPACE = "Backspace";
const ENTER = "Enter";

/* GLOBALS */
let input = [];
let numStr = "";
let display = document.querySelector(".display");
let isComputed = false;

function processOperator(operator) {
  isComputed = false;

  if (!numStr && input.length === 0) {
    return;
  }

  if (numStr) {
    input.push(numStr); // push num once an operator is pressed
  }

  if (input[input.length - 1].match(/^[\+\-\xD7\xF7\*\/]$/)) {
    input.pop(); // pop last operator if pressing another operator consecutively
  }

  // if pressing * or /, replace with x and + for proper display
  if (operator === "*") {
    operator = String.fromCharCode(0xD7);
  } else if (operator === "/") {
    operator = String.fromCharCode(0xF7);
  }

  input.push(operator);
  numStr = "";
  display.textContent = input.join("");
}

function processNum(num) {
  isComputed = false;

  if (input.length === 1) {
      input = []; // delete result from previous computation
  }

  if (num === ".") {
    if (!numStr) {
      num = "0." // prepend zero if num is less than 1
    } else if (numStr.includes(".")) {
      return; // do not allow multiple decimal points
    }
  } else if (num.match(/[0-9]/)) {
    if (numStr === "0") {
      numStr = ""; // do not display leading zero for whole numbers
    }
  }

  numStr += num;
  display.textContent = input.join("") + numStr;
}

function operate(e) {
  if (!numStr && input.length === 0) {
    return;
  }

  if (numStr) {
    input.push(numStr);
  }

  if (input[input.length - 1].match(/^[\+\-\xD7\xF7]$/)) {
    input.pop(); // pop last operator if no operand to its right
  }

  let expr = input.join(" ");
  expr = expr.replace(/\xD7/g, "*"); // replace ASCII multiply symbol with *
  expr = expr.replace(/\xF7/g, "/"); // replace ASCII divide symbol with /
  let answer = eval(expr).toString();

  display.textContent = answer;
  input = [answer]; // store answer as input should the user want to operate on it

  numStr = "";
  isComputed = true;
}

function deletePrevious() {
  if (display.textContent === "0" || isComputed) {
    return;
  }

  let displayArr = Array.from(display.textContent);
  let popped = displayArr.pop();
  display.textContent = displayArr.join("");

  if (popped.match(/[\+\-\xD7\xF7]/)) {
    input.pop();
  } else {
    if (numStr) {
      let numArr = Array.from(numStr);
      numArr.pop();
      numStr = numArr.join("");
    } else {
      let operand = Array.from(input[input.length - 1]);
      operand.pop();
      input[input.length - 1] = operand.join("");

      if (operand.length === 0) {
        input.pop();
      }
    }

    if (input.length === 0 && numStr.length === 0) {
      display.textContent = "0"
    }
  }
}

function clearAll(e) {
  input = [];
  numStr = "";
  display.textContent = "0";
}

function processKey(e) {
  switch (e.key) {
    case "0":
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
    case "0":
    case ".":
      processNum(e.key);
      break;

    case "+":
    case "-":
    case "*":
    case "/":
      e.preventDefault(); // prevent divide button (/) from starting browser's find functionality
      processOperator(e.key);
      break;

    case "=":
    case ENTER:
      operate();
      break;

    case BACKSPACE:
      e.preventDefault(); // prevent browser from going back to previous page
      deletePrevious();
      break;

    default:
      break;
  }
}

/* EVENT LISTENERS FOR MOUSE CLICK */
let nums = document.querySelectorAll(".num");
nums.forEach(num => {
  num.addEventListener("click", (e) => {
    processNum(e.target.textContent);
  });
});

let operators = document.querySelectorAll(".operator");
operators.forEach(operator => {
  operator.addEventListener("click", (e) => {
    processOperator(e.target.textContent);
  });
});

let equals = document.querySelector("#equals");
equals.addEventListener("click", operate);

let ac = document.querySelector("#ac");
ac.addEventListener("click", clearAll);

/* EVENT LISTENER FOR KEY PRESS */
document.addEventListener("keydown", processKey);
