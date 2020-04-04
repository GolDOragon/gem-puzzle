"use strict";

// implement header
let menu = document.createElement("div");
menu.className = "menu";
menu.insertAdjacentHTML(
  "afterbegin",
  `<button>Start Game</button>
   <button>Stop</button>
   <button>Save</button>
   <button>Results</button>`
);
document.body.append(menu);

let gameFeature = document.createElement("div");
gameFeature.className = "gameFeature";
gameFeature.insertAdjacentHTML(
  "afterbegin",
  `
<input type="radio" name="field-type" id="3x3" value="3" />
<label for="3x3">3x3</label>
<input type="radio" name="field-type" id="4x4" value="4" checked />
<label for="4x4">4x4</label>
<input type="radio" name="field-type" id="5x5" value="5" />
<label for="5x5">5x5</label>
<input type="radio" name="field-type" id="6x6" value="6" />
<label for="6x6">6x6</label>
<input type="radio" name="field-type" id="7x7" value="7" />
<label for="7x7">7x7</label>
<input type="radio" name="field-type" id="8x8" value="8" />
<label for="8x8">8x8</label>

<p>Ходов: <span class="moves">0</span></p>
<p>Время: <span class="time">00:00</span></p>`
);
document.body.append(gameFeature);

// --------------------------------------------------

//
function getField(fieldSize, isRandom) {
  let numArray = [];
  for (let i = 0; i < fieldSize * fieldSize - 1; i++) {
    numArray.push(i + 1);
  }
  numArray.push(" ");

  let field = [];
  if (isRandom) {
    for (let i = 0; i < fieldSize; i++) {
      let row = [];
      for (let j = 0; j < fieldSize; j++) {
        let cell = numArray.splice(Math.random() * numArray.length, 1);
        row.push(cell);
      }
      field.push(row);
    }
  } else {
    for (let i = 0; i < fieldSize; i++) {
      let row = [];
      for (let j = 0; j < fieldSize; j++) {
        let cell = numArray.shift();
        row.push(cell);
      }
      field.push(row);
    }
  }
  return field;
}

function buildGrid(field) {
  for (let row of field) {
    for (let cell of row) {
      let p = document.createElement("p");
      p.classList = "cell";
      p.innerText = cell;

      puzzle.append(p);
      console.log(p);
    }
  }
  document.body.append(puzzle);
}

/**
 *
 * @param {Object.Arry} field -- array of nums
 * @param {number} fieldSize -- side length
 * @param {*} puzzle -- DOM element
 */
function showMovingCells(field, fieldSize, puzzle) {
  for (let i = 0; i < fieldSize; i++) {
    for (let j = 0; j < fieldSize; j++) {
      if (field[i][j] != " ") continue;
      let emptyCell = i * fieldSize + j;
      puzzle.children[emptyCell].classList.toggle("emptyCell");

      if (
        (emptyCell + 1) % fieldSize != 0 &&
        emptyCell + 1 <= fieldSize * fieldSize
      ) {
        puzzle.children[emptyCell + 1].classList.toggle("movingCell");
      }

      if ((emptyCell - 1) % fieldSize != 3 && emptyCell - 1 >= 0) {
        puzzle.children[emptyCell - 1].classList.toggle("movingCell");
      }
      if (emptyCell - fieldSize >= 0) {
        puzzle.children[emptyCell - fieldSize].classList.toggle("movingCell");
      }
      if (emptyCell + fieldSize <= fieldSize * fieldSize) {
        puzzle.children[emptyCell + fieldSize].classList.toggle("movingCell");
      }
    }
  }
}

let fieldType = 4;
let puzzle = document.createElement("div");
puzzle.classList = `puzzle type${fieldType}x${fieldType}`;

let prevState = getField(fieldType, true);
buildGrid(prevState);
showMovingCells(prevState, fieldType, puzzle);

let currentCondition = [];

puzzle.addEventListener("click", (event) => {
  if (event.target.classList.contains("movingCell")) {
    console.log(event.target);
  }
});

// for (let i = 0; i < 4; i++) {
//   let row = [];
//   for (let j = 0; j < 4; j++) {
//     let cell = document.createElement("td");
//     cell.classList.add("cell");

//     let num = prevState.splice(
//       Math.random() * prevState.length,
//       1
//     );

//     // cell.append(i * 4 + (j + 1));
//     cell.append(num);
//     currentCondition.push(num);
//     row.push(cell);
//   }

//   //   if (i == 3) row[row.length - 1].innerText = "";

//   let rowDiv = document.createElement("tr");
//   rowDiv.append(...row);
//   puzzle.append(rowDiv);
// }
//   target = event.target;
// setTimeout(() => puzzle.remove(), 3000);
