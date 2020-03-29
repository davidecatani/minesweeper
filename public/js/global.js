import {
    game,
    settings,
    closedCellClass,
    gameOverClass,
    gameWonClass,
    flagClass,
    minesCounterID,
    digitalBoxClass,
    secondsCounterID
} from './constants.js';

let level = 'beginner';
let rows = 0;
let cols = 0;
let mines = 0;
let movesNumber = 0;
let freeCells = 0;
let flagNumber = 0;
let seconds = 0;
let timer;
let totalCells = cols * rows;
let minesArray = [];
let cellsArray = [];
levelSelect();
generateSettings();
class Game {
    constructor() {
    }
    static init() {
        fillMinesArray();
        let wrapper = document.createElement('div');
        wrapper.classList.add('mine-wrapper');
        wrapper.appendChild(generateControls());
        let innerWrapper = document.createElement('div');
        innerWrapper.classList.add('mine-inner-wrapper');
        innerWrapper.style.width = cols * 30 + 6 + 'px';
        let n = 0;
        for (let r = 0; r < rows; r++) {
            let row = document.createElement('div');
            row.classList.add('mine-row');
            for (let c = 0; c < cols; c++) {
                let col = document.createElement('div');
                col.classList.add('mine-cell', 'closed-cell');
                col.setAttribute('data-number', n);
                clickHandler(col, n);
                row.appendChild(col);
                n++;
            }
            innerWrapper.appendChild(row);
        }
        wrapper.appendChild(innerWrapper)
        game.appendChild(wrapper);
    }
}
Game.init();
function generateControls() {
    let innerWrapperControls = document.createElement('div');
    innerWrapperControls.classList.add('mine-inner-wrapper', 'controls-wrapper');

    let minesCounter = document.createElement('div');
    minesCounter.classList.add(digitalBoxClass);
    minesCounter.setAttribute('id', minesCounterID);
    minesCounter.appendChild(document.createTextNode(mines));
    innerWrapperControls.appendChild(minesCounter);

    let newGameButton = document.createElement('div');
    newGameButton.setAttribute('id', 'new-game-btn');
    startNewGame(newGameButton);
    innerWrapperControls.appendChild(newGameButton);

    let timeCounter = document.createElement('div');
    timeCounter.classList.add(digitalBoxClass);
    timeCounter.setAttribute('id', secondsCounterID);
    timeCounter.appendChild(document.createTextNode(seconds));
    innerWrapperControls.appendChild(timeCounter);

    return innerWrapperControls;
}
function startNewGame(newGameButton) {
    newGameButton.addEventListener('click', () => {
        game.innerHTML = '';
        game.classList.remove(gameWonClass);
        game.classList.remove(gameOverClass);
        movesNumber = 0;
        freeCells = 0;
        flagNumber = 0;
        seconds = 0;
        clearInterval(timer);
        Game.init();
    });
}
function setCellClass(cell, arrayItem) {
    let cellClass = arrayItem.isMine ? 'is-mine' : `hint-${arrayItem.hint}`;
    cell.classList.add(cellClass);
}
function fillMinesArray() {
    minesArray.length = 0;
    for (let m = 0; m < mines; m++) {
        minesArray = [...minesArray, { isMine: true }];
    }
    for (let i = 0; i < (totalCells - mines); i++) {
        minesArray = [...minesArray, { isMine: false }];
    }
    shuffleArray();
}
function shuffleArray() {
    minesArray.forEach((item, i) => {
        const j = Math.floor(Math.random() * (i + 1));
        [minesArray[i], minesArray[j]] = [minesArray[j], minesArray[i]];
    })
}
function placeHints() {
    minesArray = minesArray.map((item, index) => {
        const isFirstOfRow = !Boolean(index % cols);
        const isLastOfRow = !Boolean((index + 1) % cols);
        let hintCounter = 0;

        let topLeft = minesArray[index - (cols + 1)];
        let top = minesArray[index - cols];
        let topRight = minesArray[index - (cols - 1)];

        let left = minesArray[index - 1];
        let right = minesArray[index + 1];

        let bottomLeft = minesArray[index + (cols - 1)];
        let bottom = minesArray[index + cols];
        let bottomRight = minesArray[index + (cols + 1)];

        if (Boolean(right) && !isLastOfRow && right.isMine) {
            hintCounter++;
            item.hintRight = true;
        }
        if (Boolean(left) && !isFirstOfRow && left.isMine) {
            hintCounter++;
            item.hintLeft = true;
        }
        if (Boolean(bottom) && bottom.isMine) {
            hintCounter++;
            item.hintBottom = true;
        }
        if (Boolean(top) && top.isMine) {
            hintCounter++;
            item.hintTop = true;
        }

        if (Boolean(topLeft) && !isFirstOfRow && topLeft.isMine) {
            hintCounter++;
            item.hintTopLeft = true;
        }
        if (Boolean(bottomLeft) && !isFirstOfRow && bottomLeft.isMine) {
            hintCounter++;
            item.hintBottomLeft = true;
        }
        if (Boolean(topRight) && !isLastOfRow && topRight.isMine) {
            hintCounter++;
            item.hintTopRight = true;
        }
        if (Boolean(bottomRight) && !isLastOfRow && bottomRight.isMine) {
            hintCounter++;
            item.hintBottomRight = true;
        }

        item.hint = hintCounter;
        return item;
    });
}
function clickHandler(cell, currentCell) {
    cell.addEventListener('click', () => {
        if (isCellClosed(cell) && isNotEndGame() && !isWon() && !cell.classList.contains(flagClass)) {
            cellsArray = document.querySelectorAll('.mine-cell');
            if (isFirstMove()) {
                startTimer();
                fillGrid(cell);
            }
            cell.classList.remove(closedCellClass);
            freeCells++;
            if (hasMine(currentCell)) {
                cell.classList.add('error');
                game.classList.add(gameOverClass);
                showAllMines();
                clearInterval(timer);
                return;
            }
            if (hasNotHint(currentCell)) {
                openNearCells(currentCell);
            }
            movesNumber++;
            if (isWon()) {
                game.classList.add(gameWonClass);
                clearInterval(timer)
            }
        }
    });
    cell.addEventListener('mousedown', () => {
        if (isCellClosed(cell) && isNotEndGame() && !isWon() && !cell.classList.contains(flagClass)) {
            game.classList.add('cell-active');
        }
    });
    cell.addEventListener('mouseup', () => {
        game.classList.remove('cell-active');
    });
    cell.addEventListener('contextmenu', function (event) {
        event.preventDefault();
        if (isCellClosed(cell) && isNotEndGame() && !isWon()) {
            cell.classList.toggle(flagClass);
            toggleFlagNumber(cell);
        }
        return false;
    }, false);
}
function fillGrid(cell) {
    const currentCell = Number(cell.getAttribute('data-number'));
    const safeKey = getRandomSafeKey();
    if (minesArray[currentCell].isMine) {
        [minesArray[currentCell], minesArray[safeKey]] = [minesArray[safeKey], minesArray[currentCell]];
    }
    placeHints();
    cellsArray.forEach((item, index) => {
        let value = Boolean(minesArray[index].isMine) ? '' : Boolean(minesArray[index].hint) ? minesArray[index].hint : '';
        item.setAttribute('data-mine', minesArray[index].isMine);
        setCellClass(item, minesArray[index]);
        item.appendChild(document.createTextNode(value));
    });
}

function toggleFlagNumber(cell) {
    cell.classList.contains(flagClass) ? flagNumber++ : flagNumber--;
    document.getElementById(minesCounterID).innerText = mines - flagNumber;
}
function getRandomSafeKey() {
    let safeCellsArray = [];
    minesArray.forEach((item, index) => {
        if (!item.isMine) {
            safeCellsArray = [...safeCellsArray, index];
        }
    });
    const j = Math.floor(Math.random() * safeCellsArray.length);
    return safeCellsArray[j];
}
function isFirstMove() {
    return !Boolean(movesNumber);
}
function isCellClosed(cell) {
    return cell.classList.contains(closedCellClass);
}
function hasNotHint(currentCell) {
    return !Boolean(minesArray[currentCell].hint);
}
function openNearCells(currentCell) {
    const isFirstOfRow = !Boolean(currentCell % cols);
    const isLastOfRow = !Boolean((currentCell + 1) % cols);
    let radiusArray = [];
    let right = currentCell + 1;
    let left = currentCell - 1;
    let top = currentCell - cols;
    let bottom = currentCell + cols;
    let topLeft = currentCell - (cols + 1);
    let topRight = currentCell - (cols - 1);
    let bottomLeft = currentCell + (cols - 1);
    let bottomRight = currentCell + (cols + 1);

    if (isNotNegative(right) && !isLastOfRow) {
        radiusArray = [...radiusArray, right];
    }
    if (isNotNegative(left) && !isFirstOfRow) {
        radiusArray = [...radiusArray, left];
    }
    if (isNotNegative(bottom)) {
        radiusArray = [...radiusArray, bottom];
    }
    if (isNotNegative(top)) {
        radiusArray = [...radiusArray, top];
    }

    if (isNotNegative(topLeft) && !isFirstOfRow) {
        radiusArray = [...radiusArray, topLeft];
    }
    if (isNotNegative(bottomLeft) && !isFirstOfRow) {
        radiusArray = [...radiusArray, bottomLeft];
    }
    if (isNotNegative(topRight) && !isLastOfRow) {
        radiusArray = [...radiusArray, topRight];
    }
    if (isNotNegative(bottomRight) && !isLastOfRow) {
        radiusArray = [...radiusArray, bottomRight];
    }

    radiusArray.forEach((cell) => {
        if (
            Boolean(cellsArray[cell])
            && cellsArray[cell].classList.contains(closedCellClass)
            && !cellsArray[cell].classList.contains(flagClass)
        ) {
            cellsArray[cell].classList.remove(closedCellClass);
            freeCells++;
            if (hasNotHint(cell)) {
                openNearCells(cell);
            }
        }
    });
}
function isNotNegative(number) {
    return number >= 0;
}
function hasMine(currentCell) {
    return minesArray[currentCell].isMine;
}
function isNotEndGame() {
    return !game.classList.contains(gameOverClass);
}
function isWon() {
    return (totalCells - mines) === freeCells;
}
function showAllMines() {
    cellsArray.forEach((currentCell, index) => {
        if (hasMine(index)) {
            currentCell.classList.remove(closedCellClass);
        }
    })
}
function startTimer() {
    const timerElement = document.getElementById(secondsCounterID);
    timer = setInterval(() => {
        seconds++;
        timerElement.innerHTML = seconds;
    }, 1000);
}
function levelSelect() {
    const links = document.getElementById('levels-select').querySelectorAll('a');
    links.forEach((link) => {
        link.addEventListener('click', () => {
            level = link.getAttribute('data-level');
            game.innerHTML = '';
            game.classList.remove(gameWonClass);
            game.classList.remove(gameOverClass);
            movesNumber = 0;
            freeCells = 0;
            flagNumber = 0;
            seconds = 0;
            clearInterval(timer);
            generateSettings(level);
            Game.init();
        })
    });
}
function generateSettings() {
    rows = settings[level].rows;
    cols = settings[level].cols;
    mines = settings[level].mines;
    totalCells = cols * rows;
}