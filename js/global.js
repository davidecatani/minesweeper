const game = document.getElementById('game');
const settings = {
    beginner: {
        rows: 9,
        cols: 9,
        mines: 10
    },
    medium: {
        rows: 20,
        cols: 20,
        mines: 20
    },
    hard: {
        rows: 30,
        cols: 30,
        mines: 30
    }
}
let level = 'beginner';
let rows = settings[level].rows;
let cols = settings[level].cols;
let mines = settings[level].mines;
let movesNumber = 0;
const totalCells = cols * rows;
let minesArray = fillMinesArray(mines, totalCells, cols);
generateGrid();

function generateGrid() {
    let wrapper = document.createElement('div');
    wrapper.classList.add('mine-wrapper');
    wrapper.style.width = cols * 30 + 'px';
    n = 0;
    for (let r = 0; r < rows; r++) {
        let row = document.createElement('div');
        row.classList.add('mine-row');
        for (let c = 0; c < cols; c++) {
            let col = document.createElement('div');
            col.classList.add('mine-cell');
            col.setAttribute('data-number', n);
            clickHandler(col);
            row.appendChild(col);
            n++;
        }
        wrapper.appendChild(row);
    }

    game.appendChild(wrapper);
}
function setCellClass(cell, arrayItem) {
    let cellClass = arrayItem.isMine ? 'is-mine' : `hint-${arrayItem.hint}`;
    cell.classList.add(cellClass);
}
function fillMinesArray(mines, totalCells, cols) {
    let minesArray = [];
    for (m = 0; m < mines; m++) {
        minesArray.push({ isMine: true });
    }
    for (i = 0; i < (totalCells - mines); i++) {
        minesArray.push({ isMine: false });
    }
    let shuffledArray = shuffleArray(minesArray)
    return shuffledArray;
}
function shuffleArray(array) {
    array.forEach((item, i) => {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    })
    return array;
}
function placeHints(shuffledArray, cols) {
    return shuffledArray.map((item, index) => {
        const isFirstOfRow = !Boolean(index % cols);
        const isLastOfRow = !Boolean((index + 1) % cols);
        let hintCounter = 0;
        let right = shuffledArray[index + 1];
        let left = shuffledArray[index - 1];
        let top = shuffledArray[index - cols];
        let bottom = shuffledArray[index + cols];
        let topLeft = shuffledArray[index - (cols + 1)];
        let topRight = shuffledArray[index - (cols - 1)];
        let bottomLeft = shuffledArray[index + (cols - 1)];
        let bottomRight = shuffledArray[index + (cols + 1)];

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
    })
}
function clickHandler(cell) {
    cell.addEventListener('click', () => {
        if (isFirstMove()) {
            fillGrid(cell);
        }
        movesNumber++;
    });
}
function fillGrid(cell) {
    const cellNumber = Number(cell.getAttribute('data-number'));
    const safeKey = getRandomSafeKey();
    if (minesArray[cellNumber].isMine) {
        [minesArray[cellNumber], minesArray[safeKey]] = [minesArray[safeKey], minesArray[cellNumber]];
    }
    placeHints(minesArray, cols);
    const cellsArray = document.querySelectorAll('.mine-cell');
    cellsArray.forEach((item, index) => {
        let value = Boolean(minesArray[index].isMine) ? '' : Boolean(minesArray[index].hint) ? minesArray[index].hint : '';
        item.setAttribute('data-mine', minesArray[index].isMine);
        setCellClass(item, minesArray[index]);
        item.appendChild(document.createTextNode(value));
    });
}

function getRandomSafeKey() {
    let safeCellsArray = [];
    minesArray.forEach((item, index) => {
        if(!item.isMine){
            safeCellsArray.push(index);
        }
    });
    const j = Math.floor(Math.random() * safeCellsArray.length);
    return safeCellsArray[j];
}
function isFirstMove() {
    return !Boolean(movesNumber);
}