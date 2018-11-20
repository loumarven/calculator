/* CONSTANTS */
let DEL = "DEL";

let input = [];

function displayButtonValue(e) {
  let display = document.querySelector(".display");
  let buttonValue = e.target.textContent;

  (buttonValue === DEL) ? input.pop() : input.push(buttonValue);
  display.textContent = input.join("");
}

let buttons = document.querySelectorAll(".buttons > div > div");
buttons.forEach(button => {
  button.addEventListener("click", displayButtonValue);
});
