import { pixiAddCheese, resetPieces } from "../cheeseBoard";
import { updateTitle } from "../main";
import { PlayerEnum, StoreInstance, size } from "../store";

export function addChess(x: number, y: number, color: PlayerEnum) {
    StoreInstance.cheeseArray[x][y] = color;
    pixiAddCheese(x, y, color, StoreInstance.step);
    if (isWin({ x, y }, StoreInstance.player)) {
        StoreInstance.winner = StoreInstance.player;
        return;
    }
    StoreInstance.togglePlayer();
}

export function reStart(backToTitle: boolean = false) {
    resetPieces();
    StoreInstance.reset(backToTitle);
    updateTitle();
}

export function isWin(
    coordinate: { x: number; y: number },
    color: PlayerEnum,
    board: number[][] = StoreInstance.cheeseArray,
) {
    const { x, y } = coordinate;
    const currentNum = color;

    // x,y 所在位置，只要大于5个连接的就赢了
    // x
    let maxNum = 0;
    let nextX = x;
    while (nextX >= 0 && board[nextX][y] === currentNum) {
        nextX--;
        maxNum++;
    }
    nextX = x + 1;
    while (nextX < size && board[nextX][y] === currentNum) {
        nextX++;
        maxNum++;
    }
    if (maxNum >= 5) return true;

    // y
    maxNum = 0;
    let nextY = y;
    while (nextY >= 0 && board[x][nextY] === currentNum) {
        nextY--;
        maxNum++;
    }
    nextY = y + 1;
    while (nextY < size && board[x][nextY] === currentNum) {
        nextY++;
        maxNum++;
    }
    if (maxNum >= 5) return true;

    // xy
    maxNum = 0;
    nextX = x
    nextY = y;
    while (nextX >= 0 && nextY >= 0 && board[nextX][nextY] === currentNum) {
        nextX--;
        nextY--;
        maxNum++;
    }
    nextX = x + 1;
    nextY = y + 1;
    while (nextX < size && nextY < size && board[nextX][nextY] === currentNum) {
        nextX++;
        nextY++;
        maxNum++;
    }
    if (maxNum >= 5) return true;
    // -xy
    maxNum = 0;
    nextX = x
    nextY = y;
    while (nextX < size && nextY >= 0 && board[nextX][nextY] === currentNum) {
        nextX++;
        nextY--;
        maxNum++;
    }
    nextX = x - 1;
    nextY = y + 1;
    while (nextX >= 0 && nextY < size && board[nextX][nextY] === currentNum) {
        nextX--
        nextY++;
        maxNum++;
    }
    if (maxNum >= 5) return true;
    return false;
}
