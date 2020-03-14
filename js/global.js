const game = document.getElementById('game');
const rows = 10;
const cols = 10;
const mines = 10;

let wrapper = document.createElement('div');
wrapper.classList.add('mine-wrapper');
wrapper.style.width = cols * 30 + 'px';
for (let r = 0; r < rows; r++) {
    let row = document.createElement('div');
    row.classList.add('mine-row');
    for (let c = 0; c < cols; c++) {
        let col = document.createElement('div');
        col.classList.add('mine-cell')
        col.appendChild(document.createTextNode('1'));
        row.appendChild(col);
    }
    wrapper.appendChild(row);
}

game.appendChild(wrapper);