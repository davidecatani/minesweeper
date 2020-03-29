export const game = document.getElementById('game');
export const settings = {
    beginner: {
        rows: 9,
        cols: 9,
        mines: 10
    },
    intermediate: {
        rows: 16,
        cols: 16,
        mines: 40
    },
    expert: {
        rows: 16,
        cols: 30,
        mines: 99
    }
}
export const closedCellClass = 'closed-cell';
export const gameOverClass = 'game-over';
export const gameWonClass = 'game-won';
export const flagClass = 'has-flag';
export const minesCounterID = 'mines-counter';
export const digitalBoxClass = 'digital-box';
export const secondsCounterID = 'seconds-counter';