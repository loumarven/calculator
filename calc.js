/* CONSTANTS */
const BACKSPACE = "Backspace";
const ENTER = "Enter";
const MAXNUM = 999999999;
const MAXINPUTLEN = 45;
const MAXDECIMALPLACES = 10;
const MAXANSWERLEN = 13;

/* GLOBALS */
let input = [];
let numStr = "";
let inputDisplay = document.querySelector(".input-display");
let answerDisplay = document.querySelector(".answer-display");
let isComputed = false;

function processOperator(operator) {
  if (isComputed) {
    // visual cue to show previous answer when inputting a new calculation
    answerDisplay.style.fontStyle = "italic";
    answerDisplay.style.color = "#bdc3c7";

    if (input[0] === "Not a number") {
      return;
    }
  }

  isComputed = false;

  if (input.join("").length > MAXINPUTLEN) {
    return;
  }

  if (!numStr && input.length === 0) {
    return;
  }

  if (numStr) {
    if (numStr.match(/\.$/)) {
      numStr = numStr.slice(0, -1); // delete trailing decimal point
    }

    input.push(numStr); // push num once an operator is pressed
  }

  // if pressing * or /, replace with x and + for proper display
  if (operator === "*") {
    operator = String.fromCharCode(0xD7);
  } else if (operator === "/") {
    operator = String.fromCharCode(0xF7);
  }

  if (input[input.length - 1].match(/^[\+\-\xD7\xF7]$/)) {
    input.pop(); // pop last operator if pressing another operator consecutively
  }

  input.push(operator);
  numStr = "";
  inputDisplay.textContent = input.join("");
}

function processNum(num) {
  if (isComputed) {
    // visual cue to show previous answer when inputting a new calculation
    answerDisplay.style.fontStyle = "italic";
    answerDisplay.style.color = "#bdc3c7";
  }

  isComputed = false;

  if (parseInt(numStr) > MAXNUM) {
    return;
  }

  // if floating point, only allow up to 8 decimal places
  if (numStr && numStr.includes(".")) {
    if (numStr.split(".")[1].length >= MAXDECIMALPLACES) {
      return;
    }
  }

  if (input.join("").length > MAXINPUTLEN) {
    return;
  }

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
  inputDisplay.textContent = input.join("") + numStr;
}

function putSign(e) {
  if (isComputed) { // put sign to answer
    if (input[0] === "Not a number") {
      return;
    } else if (!input[0].match(/^\-/)) {
      input[0] = "-" + input[0];
    } else {
      input[0] = input[0].slice(1);
    }
  } else {
    if (!numStr.match(/^\-/)) {
      numStr = "-" + numStr;
    } else {
      numStr = numStr.slice(1);
    }
  }

  inputDisplay.textContent = input.join("") + numStr;
}

function operate(e) {
  if (!numStr && input.length === 0) {
    return;
  }

  if (numStr) {
    if (numStr.match(/\.$/)) {
      numStr = numStr.slice(0, -1); // delete trailing decimal point
    }

    input.push(numStr);
    inputDisplay.textContent = input.join("");
  }

  if (input[input.length - 1].match(/^[\+\-\xD7\xF7]$/)) {
    input.pop(); // pop last operator if no operand to its right
    inputDisplay.textContent = input.join("") + numStr;
  }

  let expr = input.join(" ");
  expr = expr.replace(/\xD7/g, "*"); // replace ASCII multiply symbol with *
  expr = expr.replace(/\xF7/g, "/"); // replace ASCII divide symbol with /
  let answer = eval(expr).toString();

  if (answer.includes("Infinity")) { // handle division by zero
    answer = "Not a number";
  }

  // prevent answer from overflowing on display
  if (answer.toString().length > MAXANSWERLEN) {
    if (answer.includes(".")) {
      let numArr = answer.split(".");
      let decPlace = MAXANSWERLEN - numArr[0].length;
      answer = parseFloat(answer).toFixed(decPlace);
      answer = parseFloat(answer).toString(); // parseFloat again to remove trailing zeros in decimal
    } else { // if int length is greater than MAXANSWERLEN
      answer = parseFloat(answer).toPrecision(MAXANSWERLEN - 4);
      answer = answer.toString();
    }
  }

  answerDisplay.style.fontStyle = "normal";
  answerDisplay.style.color = "#ecf0f1";
  answerDisplay.textContent = answer;

  input = [answer]; // store answer as input should the user want to operate on it

  numStr = "";
  isComputed = true;
}

function deleteOnce() {
  if (inputDisplay.textContent === "" || isComputed) {
    return;
  }

  let displayArr = Array.from(inputDisplay.textContent);
  let popped = displayArr.pop();
  inputDisplay.textContent = displayArr.join("");

  if (!popped) {
    return; // if pressing delete even if display is cleared already
  }

  if (popped.match(/^[\+\-\xD7\xF7]$/)) {
    input.pop();
  } else {
    if (numStr) {
      numStr = numStr.slice(0, -1);
      if (numStr === "-") { // reset numStr if negative sign remains
        numStr = "";
        inputDisplay.textContent = displayArr.join("").slice(0, -1);
      }
    } else {
      let operand = input[input.length - 1];
      operand = operand.slice(0, -1);
      input[input.length - 1] = operand;

      if (operand.length === 0) {
        input.pop();
      }
    }
  }

  if (input.length === 0 && !numStr ||
      inputDisplay.textContent === "-") { // reset display if negative sign remains
    answerDisplay.textContent = "";
  }
}

function clearAll(e) {
  input = [];
  numStr = "";
  inputDisplay.textContent = "";
  answerDisplay.style.fontStyle = "normal";
  answerDisplay.style.color = "#ecf0f1";
  answerDisplay.textContent = "";
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
      deleteOnce();
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

let sign = document.querySelector("#plusmn");
sign.addEventListener("click", putSign);

let equals = document.querySelector("#equals");
equals.addEventListener("click", operate);

let ac = document.querySelector("#ac");
ac.addEventListener("click", clearAll);

let del = document.querySelector("#del");
del.addEventListener("click", (e) => {
  deleteOnce();
})

/* SUPPORT FOR KEYBOARD PRESS */
document.addEventListener("keydown", processKey);
