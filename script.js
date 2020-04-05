"use strict";

// implement header
let menu = document.createElement("form");
menu.className = "menu";
menu.insertAdjacentHTML(
  "afterbegin",
  `<button type="button" id="startButton">Размешать и начать</button>
   <button type="button" id="stopButton">Стоп</button>
   <button type="button" id="saveButton">Сохранить</button>
   <button type="button" id="resultsButton">Результаты</button>`
);
document.body.append(menu);

let gameFeature = document.createElement("div");
gameFeature.className = "game-feature";
gameFeature.insertAdjacentHTML(
  "afterbegin",
  `
  <div class="radio-buttons">
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
</div>
<div class="game-statistic">
<p>Ходов: <span class="moves">0</span></p>
<p>Время: <span class="time">00:00</span></p></div>`
);
document.body.append(gameFeature);

// --------------------------------------------------

// create field
function getFieldSize(radioName) {
  let radioButtons = document.getElementsByName(radioName);
  let fieldSize;
  for (let i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked) fieldSize = radioButtons[i].value;
  }

  return Number(fieldSize);
}

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
        row.push(cell[0]);
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

function updateGrid(field, fieldSize, parentElement) {
  function removeGrid(parentElement) {
    parentElement.querySelectorAll("p").forEach((el) => {
      el.remove();
    });
  }
  function buildGrid(field, parentElement) {
    for (let row of field) {
      for (let cell of row) {
        let p = document.createElement("p");
        p.classList = "cell";
        p.innerText = cell;

        parentElement.append(p);
      }
    }
    document.body.append(parentElement);
  }
  /**
   *
   * @param {Object.Arry} field -- array of nums
   * @param {number} fieldSize -- side length
   * @param {*} parentElement -- DOM element
   */
  function showMovingCells(field, fieldSize, parentElement) {
    for (let i = 0; i < fieldSize; i++) {
      for (let j = 0; j < fieldSize; j++) {
        if (field[i][j] != " ") continue;
        let emptyCell = i * fieldSize + j;
        parentElement.children[emptyCell].classList.toggle("emptyCell");

        if (
          (emptyCell + 1) % fieldSize != 0 &&
          emptyCell + 1 < fieldSize * fieldSize
        ) {
          parentElement.children[emptyCell + 1].classList.toggle("movingCell");
        }

        if (
          (emptyCell - 1) % fieldSize != fieldSize - 1 &&
          emptyCell - 1 >= 0
        ) {
          parentElement.children[emptyCell - 1].classList.toggle("movingCell");
        }
        if (emptyCell - fieldSize >= 0) {
          parentElement.children[emptyCell - fieldSize].classList.toggle(
            "movingCell"
          );
        }
        if (emptyCell + fieldSize < fieldSize * fieldSize) {
          parentElement.children[emptyCell + fieldSize].classList.toggle(
            "movingCell"
          );
        }
      }
    }
  }

  removeGrid(parentElement);
  buildGrid(field, parentElement);
  showMovingCells(field, fieldSize, parentElement);
}

function moveCells(field, cellNumber) {
  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field.length; j++) {
      if (field[i][j] == " ") field[i][j] = Number(cellNumber);
      else if (field[i][j] == cellNumber) field[i][j] = " ";
    }
  }
  return field;
}

function upMovesCounter() {
  let counter = document.getElementsByClassName("moves")[0];
  counter.textContent = +counter.textContent + 1;
}

function cleanMovesCounter() {
  let counter = document.getElementsByClassName("moves")[0];
  counter.textContent = 0;
}

function getGameTime() {
  let duration = Math.round((new Date() - startGameTime) / 1000);
  let minutes = Math.floor(duration / 60);
  let seconds = duration - minutes * 60;
  let result = "";

  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;
  result = minutes + ":" + seconds;

  return result;
}

function clickOnCell(event) {
  if (!startGameTime) startGameTime = new Date();

  let movingCell = event.target;
  if (movingCell.classList.contains("movingCell")) {
    upMovesCounter();

    currentState = moveCells(currentState, movingCell.textContent);
    updateGrid(currentState, fieldSize, puzzle);
    if (checkEndgame(puzzle, fieldSize)) {
      let time = getGameTime();
      let steps = document.getElementsByClassName("moves")[0].textContent;

      setTimeout(
        () => alert(`Ура! Вы решили головоломку за ${time} и ${steps} ходов`),
        500
      );
    }
  }
}

function startGame() {
  fieldSize = getFieldSize("field-type");
  puzzle.classList = `puzzle type${fieldSize}x${fieldSize}`;
  currentState = getField(fieldSize, true);

  cleanMovesCounter();
  updateGrid(currentState, fieldSize, puzzle);
}

function checkEndgame(parentElement, fieldSize) {
  for (let i = 0; i < fieldSize * fieldSize - 1; i++) {
    if (parentElement.children[i].textContent != i + 1) return false;
  }
  return true;
}

let fieldSize = getFieldSize("field-type");
let currentState = getField(fieldSize, false);
let startGameTime;

let puzzle = document.createElement("div");
puzzle.classList = `puzzle type${fieldSize}x${fieldSize}`;
updateGrid(currentState, fieldSize, puzzle);

document.getElementById("startButton").addEventListener("click", startGame);
puzzle.addEventListener("click", clickOnCell);
// puzzle.onclick = updateTime();
