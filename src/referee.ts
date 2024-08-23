import { store, size } from "./store";

export function isWin(
    coordinate: { x: number; y: number },
    currentPlayer: string
) {
    const { x, y } = coordinate;
    const currentNum = currentPlayer === "black" ? 1 : -1;
    const array = store.currentArray;

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
    while ( nextX < size && nextY >= 0 && array[nextX][nextY] === currentNum) {
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
