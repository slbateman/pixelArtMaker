// Global Variable Decloration
const gridContainer = document.getElementById("gridContainer");
const grid = document.getElementById("grid");
const resSubmit = document.getElementById("resSubmit");
const fillButton = document.getElementById("fill");
let allSquares = document.querySelectorAll(".square");
const colorPalettesList = document.querySelectorAll(".colorSlot");
const toolList = document.querySelectorAll(".tool");
let randomNum = 1;
let colorSlotActive = document.getElementById("colorSlot1");
let paintColor = window.getComputedStyle(colorSlotActive).backgroundColor;
let paintTool = document.getElementById("fill");

// Generates random image. Uses the above variable to ensure
// new image is generated after each click
function inspirationGen() {
  gridContainer.style.backgroundImage =
    "url(https://picsum.photos/1000/700?random=" + randomNum;
  randomNum++;
}

// Make rows
function rowMake() {
  const row = document.createElement("div");
  row.classList.add("row");

  return row;
}

// Make squares
function squareMake() {
  const square = document.createElement("div");
  square.classList.add("square");

  return square;
}

// Generates grid based on user input
function gridGenerate() {
  // Pulls data from input fields
  let widthBox = document.getElementById("width").value;
  let heightBox = document.getElementById("height").value;
  // Generates rows
  for (let i = 0; i < widthBox; i++) {
    const row = rowMake();
    // Assigns ID to row to enable removal later
    row.setAttribute("id", `row-${i}`);
    grid.appendChild(row);
    // Generates squares
    for (let j = 0; j < heightBox; j++) {
      const square = squareMake();
      // Assigns ID to square to enable color change later
      square.setAttribute("id", `row-${i}-${j}`);
      row.appendChild(square);
      // Changes square height and width based on height of window
      // and number of squares desired
      square.style.height = `${98  / heightBox}vh`;
      square.style.width = `${98 / heightBox}vh`;
    }
  }
  allSquares = document.querySelectorAll(".square");
}

// Removes any existing grid
function gridRemove() {
  const rowNum = document.querySelectorAll(".row");
  for (let i = 0; i < rowNum.length; i++) {
    let row = document.getElementById(`row-${i}`);
    grid.removeChild(row);
  }
}

// This function will wipe the grid before regenerating it
// in case there is a grid already in place
function makeGrid() {
  gridRemove();
  gridGenerate();
}

// Fill all squares with color
function fillSquares() {
  fillButton.addEventListener("click", () => {
    allSquares.forEach((square) => (square.style.backgroundColor = paintColor));
  });
}

function toolYourSquares() {
  
}

// Color Palette Selector to assign active color
function colorActive() {
  for (let i = 0; i < colorPalettesList.length; i++)
    colorPalettesList[i].addEventListener("click", () => {
      colorSlotActive.classList.remove("active");
      colorSlotActive = colorPalettesList[i];
      colorSlotActive.classList.add("active");
    });
}

// Tool Selector to assign active tool
function toolActive() {
  for (let i = 0; i < toolList.length; i++)
    toolList[i].addEventListener("click", () => {
      paintTool.classList.remove("active");
      paintTool = toolList[i];
      paintTool.classList.add("active");
    });
}

function init() {
  fillSquares();
  colorActive();
  toolActive();
}

init();
