import { pixiAddCheese, resetPieces } from "../cheeseBoard";
import { updateTitle } from "../main";
import { PlayerEnum, StoreInstance, size } from "../store";

export function addChess(x: number, y: number, color: PlayerEnum) {
    StoreInstance.cheeseArray[x][y] = color;
    pixiAddCheese(x, y, color);
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
    color: PlayerEnum
) {
    const { x, y } = coordinate;
    const currentNum = color;
    const array = StoreInstance.cheeseArray;

    // x,y 所在位置，只要大于5个连接的就赢了
    // x
    let maxNum = 0;
    let nextX = x;
    while (nextX >= 0 && array[nextX][y] === currentNum) {
        nextX--;
        maxNum++;
    }
    nextX = x + 1;
    while (nextX < size && array[nextX][y] === currentNum) {
        nextX++;
        maxNum++;
    }
    if (maxNum >= 5) return 'win';

    // y
    maxNum = 0;
    let nextY = y;
    while (nextY >= 0 && array[x][nextY] === currentNum) {
        nextY--;
        maxNum++;
    }
    nextY = y + 1;
    while (nextY < size && array[x][nextY] === currentNum) {
        nextY++;
        maxNum++;
    }
    if (maxNum >= 5) return 'win';

    // xy
    maxNum = 0;
    nextX = x
    nextY = y;
    while (nextX >= 0 && nextY >= 0 && array[nextX][nextY] === currentNum) {
        nextX--;
        nextY--;
        maxNum++;
    }
    nextX = x + 1;
    nextY = y + 1;
    while (nextX < size && nextY < size && array[nextX][nextY] === currentNum) {
        nextX++;
        nextY++;
        maxNum++;
    }
    if (maxNum >= 5) return 'win';
    // -xy
    maxNum = 0;
    nextX = x
    nextY = y;
    while (nextX < size && nextY >= 0 && array[nextX][nextY] === currentNum) {
        nextX++;
        nextY--;
        maxNum++;
    }
    nextX = x - 1;
    nextY = y + 1;
    while (nextX >= 0 && nextY < size && array[nextX][nextY] === currentNum) {
        nextX--
        nextY++;
        maxNum++;
    }
    if (maxNum >= 5) return 'win';
}
