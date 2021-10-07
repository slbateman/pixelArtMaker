const gridContainer = document.getElementById("gridContainer");
const grid = document.getElementById("grid");
const resSubmit = document.getElementById("resSubmit");

function inspirationRemove() {
  gridContainer.style.backgroundImage = "none";
}

function inspirationGen() {
  inspirationRemove();
  gridContainer.style.backgroundImage = `url("https://picsum.photos/1000/700")`;
}

// Make grid
function gridGenerate() {
  let widthBox = document.getElementById("width").value;
  let heightBox = document.getElementById("height").value;
  for (let i = 0; i < widthBox; i++) {
    const row = rowMake();
    row.setAttribute("id",`row-${i}`);
    grid.appendChild(row);
    for (let j = 0; j < heightBox; j++) {
      const square = squareMake();
      square.setAttribute("id",`row-${i}-${j}`);
      row.appendChild(square);
      square.style.height = `${98 / heightBox}vh`
      square.style.width = `${98 / heightBox}vh`
    }
  }
}

function gridRemove() {
  const rowNum = document.querySelectorAll(".row");
  for (let i = 0; i < rowNum.length; i++) {
      let row = document.getElementById(`row-${i}`)
    grid.removeChild(row);
  }
}

function makeGrid() {
    gridRemove();
    gridGenerate();
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
