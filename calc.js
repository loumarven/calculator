/* GLOBALS */
let input = [];
let numStr = "";
let display = document.querySelector(".display");

function processOperator(e) {
  let operator = e.target.textContent;

  if (!numStr && input.length === 0) {
    return;
  }

  if (numStr) {
    input.push(numStr); // push num once an operator is pressed
  }

  if (input[input.length - 1].match(/[\+\-\xD7\xF7]/)) {
    input.pop(); // pop last operator if pressing another operator consecutively
  }

  input.push(operator);
  numStr = "";
  display.textContent = input.join("");
}

function processNum(e) {
  let num = e.target.textContent;

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

  if (input[input.length - 1].match(/[\+\-\xD7\xF7]/)) {
    input.pop(); // pop last operator if no operand to its right
  }

  let expr = input.join(" ");
  expr = expr.replace(/\xD7/g, "*"); // replace ASCII multiply symbol with *
  expr = expr.replace(/\xF7/g, "/"); // replace ASCII divide symbol with /
  let answer = eval(expr).toString();

  display.textContent = answer;
  input = [answer]; // store answer as input should the user want to operate on it

  numStr = "";
}

function clearAll(e) {
  input = [];
  numStr = "";
  display.textContent = "0";
}

/* EVENT LISTENERS */
let nums = document.querySelectorAll(".num");
nums.forEach(num => {
  num.addEventListener("click", processNum);
});

let operators = document.querySelectorAll(".operator");
operators.forEach(operator => {
  operator.addEventListener("click", processOperator);
});

let equals = document.querySelector("#equals");
equals.addEventListener("click", operate);

let ac = document.querySelector("#ac");
ac.addEventListener("click", clearAll);
