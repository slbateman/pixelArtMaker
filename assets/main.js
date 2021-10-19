// Global Variable Declaration
const gridContainer = document.getElementById("gridContainer");
const grid = document.getElementById("grid");
const resSubmit = document.getElementById("resSubmit");
const colorPalettesList = document.querySelectorAll(".colorSlot");
const toolList = document.querySelectorAll(".tool");
const colorPicker = document.getElementById("colorPickerSlot");
const saveBtn = document.getElementById("saveButton");
const loadBtn = document.getElementById("loadButton");
const modal = document.getElementById("uploadModal");
const span = document.getElementsByClassName("close")[0];
const undoBtn = document.getElementById("undo");
const redoBtn = document.getElementById("redo")
const gridInfo = [];
let undoLevel = 0;
let imgBtn = document.getElementById("imageSubmit");
let widthBox = document.getElementById("width").value;
let heightBox = document.getElementById("height").value;
let allSquares = document.querySelectorAll(".square");
let colorSlotActive = document.getElementById("colorSlot1");
let paintColor = window.getComputedStyle(colorSlotActive).backgroundColor;
let paintTool = document.getElementById("fill");
let paintBool = paintColor;

// Generates random image. Uses the randomNum variable to ensure
// new image is generated after each click
function inspirationGen() {
  const fetchImage = fetch('https://picsum.photos/1000/700');
  console.log(fetchImage);
  fetchImage.then((response) => {
    return response;
  }).then((data) => {
    gridContainer.style.backgroundImage = `url(${data.url})`
  });
}

// Enable user to upload their own image as inspiration
function modalLoad() {
  modal.style.display = "block";
}
function modalClose() {
  modal.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Uploads file and reads it as a Data URL to be loaded
function imageUpload() {
  const imgFiles = document.getElementById("imageFile").files;
  let imgFile = imgFiles[0];
  const reader = new FileReader();
  modalClose();
  reader.addEventListener('load', (event) => {
    gridContainer.style.backgroundImage = `url(${event.target.result})`;
  });
  reader.readAsDataURL(imgFile);
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
  widthBox = document.getElementById("width").value;
  heightBox = document.getElementById("height").value;
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
      square.setAttribute("id", `sq-${i}-${j}`);
      row.appendChild(square);
      // Changes square height and width based on height of window
      // and number of squares desired
      square.style.height = `${98 / heightBox}vh`;
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

// This will update the color based on tool selected color and tool
function setColor(){
  paintColor = window.getComputedStyle(colorSlotActive).backgroundColor;
  paintBool = paintColor;
  if (paintTool.id === "erase" || paintTool.id === "clean") {
    paintBool = "";
  };
}

// Color Palette Selector to assign active color
function colorActive() {
  for (let i = 0; i < colorPalettesList.length; i++)
    colorPalettesList[i].addEventListener("click", () => {
      colorSlotActive.classList.remove("active");
      colorSlotActive = colorPalettesList[i];
      colorSlotActive.classList.add("active");
      setColor();
    });
}

// Assigns color from color picker to active color slot
function colorChange() {
  colorPicker.addEventListener("input", () => {
    colorSlotActive.style.backgroundColor = colorPicker.value;
    setColor();
  });
}

// This function generates the listener for the grid
function squareListener(e) {
  gridContainer.addEventListener("mousedown", (e) => {
    // Removes all future redos if undo and paint occurs
    while (undoLevel < gridInfo.length){
      gridInfo.pop();
    };
    // Saves the grid before every tool stroke (almost full autosave)
    save();
    down = true;
    // Depending on which tool is selected,
    // the listener will activate the proper action
    switch (paintTool.id){
      case "fill":
      case "clean":
        allSquares.forEach((square) => (square.style.backgroundColor = paintBool));
        break;
      case "paint":
      case "erase":
        e.target.style.backgroundColor = paintBool;
        gridContainer.addEventListener("mouseup", () => {
          down = false;
        });
          gridContainer.addEventListener("mouseover", (e) => {
            if (e.target.className === "square" && down) {
              e.target.style.backgroundColor = paintBool;
            }
        });
        break;
      default:
        allSquares.forEach((square) => (square.style.backgroundColor = paintBool));
    };
  });
}

// Tool Selector to assign active tool
function toolActive() {
  for (let i = 0; i < toolList.length; i++)
    toolList[i].addEventListener("click", () => {
      paintTool.classList.remove("active");
      paintTool = toolList[i];
      paintTool.classList.add("active");
      if (paintTool.id === "fill" || paintTool.id === "paint"){
        paintBool = paintColor;
      } else if (paintTool.id === "erase" || paintTool.id === "clean"){
        paintBool = "";
      }
    });
}

function saveGrid() {
  saveBtn.addEventListener("click", () => {
    save();
  });
}

// Saves most recent grid color state to local storage
// and adds grid state to a growing array: gridInfo
function save() {
  const gridArray = [];
  for (let i = 0; i < allSquares.length; i++) {
    const squareColors = allSquares[i];
    gridArray.push(squareColors.style.backgroundColor);
  }
  gridInfo.push({
    grid: gridArray,
    gridImage: gridContainer.style.backgroundImage,
    gridWidth: widthBox,
    gridHeight: heightBox,
  });
  localStorage.setItem("gridSave", JSON.stringify(gridInfo[gridInfo.length-1]));
  undoLevel++;
}

function undoAction() {
  undoBtn.addEventListener("click", () => {
    if (undoLevel > 0){
      undoLevel--;
      localStorage.setItem("gridSave", JSON.stringify(gridInfo[undoLevel]));
      load();
    };
  });
}

function redoAction() {
  redoBtn.addEventListener("click", () => {
    if (undoLevel < gridInfo.length){
      undoLevel++;
      localStorage.setItem("gridSave", JSON.stringify(gridInfo[undoLevel]));
      load();
    };
  });
}

function load() {
  const savedGridInfo = JSON.parse(localStorage.getItem('gridSave'));
    document.getElementById("width").value = savedGridInfo.gridWidth;
    document.getElementById("height").value = savedGridInfo.gridHeight;
    makeGrid();
    gridContainer.style.backgroundImage = savedGridInfo.gridImage;
    for (let i = 0; i < allSquares.length; i++) {
      allSquares[i].style.backgroundColor = savedGridInfo.grid[i];
    }
}
// Retrieves each square background color from local storage
function loadGrid() {
  loadBtn.addEventListener('click', () => {
    load()
  });
}

function init() {
  colorActive();
  toolActive();
  squareListener();
  colorChange();
  gridGenerate();
  saveGrid();
  loadGrid();
  undoAction();
  redoAction();

}

init();
