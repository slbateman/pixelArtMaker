
const insprationGen = document.getElementById("insprationGen");
const gridContainer = document.getElementById("gridContainer");
const grid = document.getElementById("grid");
const widthBox = document.getElementById("width");
const heightBox = document.getElementById("height");
const resSubmit = document.getElementById("resSubmit");

function uploadInspiration() {
  gridContainer.style.backgroundImage = `url("https://picsum.photos/1000/700")`;
}

// Make grid
function gridGenerate(width, height) {
  for (let i = 0; i < width; i++) {
    const row = rowMake();
    grid.appendChild(row);
    for (let j = 0; j < height; j++) {
      const square = squareMake();
      row.appendChild(square);
    }
  }
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


