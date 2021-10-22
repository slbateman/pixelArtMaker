// Global Variable Declaration
const gridContainer = document.getElementById("gridContainer");
gridContainer.style.cursor = "crosshair";
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
const redoBtn = document.getElementById("redo");
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
  // A variable for storing the API object
  const fetchImage = fetch("https://picsum.photos/500/300");
  // Returns API object for use (object is already a JSON object)
  fetchImage
    .then((response) => {
      return response;
    })
    // Pulls the url associated with the object to be stored
    // as the background image for the entire grid
    .then((data) => {
      allSquares.forEach(
        (square) => (square.style.backgroundColor = "")
      );
      gridContainer.style.backgroundImage = `url(${data.url})`;
    });
}

// Enable user to upload their own image to grid background
function modalLoad() {
  modal.style.display = "block";
}
function modalClose() {
  modal.style.display = "none";
}
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Uploads file and reads it as a Data URL to be loaded
function imageUpload() {
  // Creates an array of all files from the file input form
  // however, only one file is able to be selected in the form
  const imgFiles = document.getElementById("imageFile").files;
  // Stores the first file from the array (there should only ever be one file)
  let imgFile = imgFiles[0];
  // Creates a new Object that enables it to be read
  const reader = new FileReader();
  modalClose();
  reader.addEventListener("load", (event) => {
    // Reads the image file
    gridContainer.style.backgroundImage = `url(${event.target.result})`;
  });
  reader.readAsDataURL(imgFile);
}

// Make columns
function colMake() {
  const col = document.createElement("div");
  col.classList.add("col");
  return col;
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
  // Generates columns
  for (let i = 0; i < widthBox; i++) {
    const col = colMake();
    // Assigns ID to col to enable removal later
    col.setAttribute("id", `col-${i}`);
    grid.appendChild(col);
    // Generates squares
    for (let j = 0; j < heightBox; j++) {
      const square = squareMake();
      // Assigns ID to square to enable color change later
      square.setAttribute("id", `sq-${i}-${j}`);
      col.appendChild(square);
      // Changes square height and width based on height of window
      // and number of squares desired
      square.style.height = `${98 / heightBox}vh`;
      square.style.width = `${98 / heightBox}vh`;
    }
  }
  // Replaces any squares stored in allSquares with new batch
  allSquares = document.querySelectorAll(".square");
}

// Removes any existing grid
function gridRemove() {
  const colNum = document.querySelectorAll(".col");
  for (let i = 0; i < colNum.length; i++) {
    let col = document.getElementById(`col-${i}`);
    grid.removeChild(col);
  }
}

// This function will wipe the grid before regenerating it
// in case there is a grid already in place
function makeGrid() {
  resSubmit.addEventListener("click", (e) => {
    e.preventDefault();
    gridRemove();
    gridGenerate();
  });
}

// This will update the color based on tool selected color and tool
function setColor() {
  paintColor = window.getComputedStyle(colorSlotActive).backgroundColor;
  paintBool = paintColor;
  if (paintTool.id === "erase" || paintTool.id === "clean") {
    paintBool = "";
  }
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
  grid.addEventListener("mousedown", (e) => {
    // Painting occurred with right click so I added if 
    // statement to figure out which mouse down was happening
    if (e.which === 1) {
      // Removes all future redos if undo then paint occurs
      while (undoLevel < gridInfo.length) {
        gridInfo.pop();
      }
      // Saves the grid before every tool stroke (almost full autosave)
      save();
      down = true;
      // Depending on which tool is selected,
      // the listener will activate the proper action
      switch (paintTool.id) {
        case "fill":
          allSquares.forEach(
            (square) => (square.style.backgroundColor = paintBool)
          );
          break;
        case "clean":
          allSquares.forEach(
            (square) => (square.style.backgroundColor = paintBool)
          );
          gridContainer.style.backgroundImage = "";
          break;
        case "paint":
        case "erase":
          e.target.style.backgroundColor = paintBool;
          grid.addEventListener("mouseup", () => {
            down = false;
          });
          grid.addEventListener("mouseover", (e) => {
            if (e.target.className === "square" && down) {
              e.target.style.backgroundColor = paintBool;
            }
          });
          grid.style.backgroundColor = "";
          break;
        default:
          allSquares.forEach(
            (square) => (square.style.backgroundColor = paintBool)
          );
      }
    }
  });
}

// Tool Selector to assign active tool and
// sets the paint boolean to paint color or none
function toolActive() {
  for (let i = 0; i < toolList.length; i++)
    toolList[i].addEventListener("click", () => {
      paintTool.classList.remove("active");
      paintTool = toolList[i];
      paintTool.classList.add("active");
      if (paintTool.id === "fill" || paintTool.id === "paint") {
        paintBool = paintColor;
      } else if (paintTool.id === "erase" || paintTool.id === "clean") {
        paintBool = "";
      } else {
        paintBool = "";
      }
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
  localStorage.setItem(
    "gridSave",
    JSON.stringify(gridInfo[gridInfo.length - 1])
  );
  undoLevel++;
}

// Downloads an image of the current state of the art being made
function saveArtImage() {
  save();
  const saveArt = document.createElement("div");
  saveArt.classList.add("saveArt");
  document.body.appendChild(saveArt);
  // 3rd party function for converting div to canvas
  html2canvas(gridContainer).then(function (canvas) {
    saveArt.appendChild(canvas);
    canvas.setAttribute("id", "canvas");
    const link = document.createElement("a");
    link.download = "download.png";
    link.href = canvas.toDataURL();
    link.click();
    link.delete;
  });
  // Div will not be visible but this will also remove 
  // the div after download
  document.body.removeChild(saveArt);
}

// Load the saved grid from local storage
function load() {
  const savedGridInfo = JSON.parse(localStorage.getItem("gridSave"));
  // Gather the height and width from the saved grid
  document.getElementById("width").value = savedGridInfo.gridWidth;
  document.getElementById("height").value = savedGridInfo.gridHeight;
  // Regenerate the grid from the saved width/height
  gridRemove()
  gridGenerate()
  
  // Load any saved image URL to the Background Image
  gridContainer.style.backgroundImage = savedGridInfo.gridImage;
  // Load the saved square color by looping through the saved array
  for (let i = 0; i < allSquares.length; i++) {
    allSquares[i].style.backgroundColor = savedGridInfo.grid[i];
  }
}

// Retrieves the saved grid from local storage when the load button is clicked
function loadGrid() {
  loadBtn.addEventListener("click", () => {
    load();
  });
}

// Cycles through the gridInfo array and loads based on current level
// and moves backward in time
function undoAction() {
  undoBtn.addEventListener("click", () => {
    if (undoLevel > 0) {
      undoLevel--;
      localStorage.setItem("gridSave", JSON.stringify(gridInfo[undoLevel]));
      load();
    }
  });
}

// Cycles through the gridInfo array and loads based on current level
// and moves forward in time
function redoAction() {
  redoBtn.addEventListener("click", () => {
    if (undoLevel < gridInfo.length) {
      undoLevel++;
      localStorage.setItem("gridSave", JSON.stringify(gridInfo[undoLevel]));
      load();
    }
  });
}

// A function that stores all functions that need
// to be run upon loading the page
function init() {
  colorActive();
  toolActive();
  squareListener();
  colorChange();
  gridGenerate();
  makeGrid();
  loadGrid();
  undoAction();
  redoAction();
}

init();
