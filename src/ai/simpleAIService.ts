import { addChess } from "../action";
import { size, StoreInstance } from "../store";
interface IPoint {
    x: number;
    y: number;
}
export interface IAIService {
    chessData: number[][];
    point: IPoint;
    started: boolean;
    color: number;
    setColor: (color: number) => void;
    start: () => void;
    playNext: () => void;
}

export class SimpleAIService implements IAIService {
    public chessData: number[][];
    public point: IPoint;
    public started: boolean;
    public color: number;
    constructor() {
        this.chessData = [];
        this.point = {
            x: 0,
            y: 0,
        };
        this.started = false;
        this.color = 1;
    }

    setColor(color: number) {
        this.color = color;
    }

    start() {
        if (StoreInstance.player === this.color) {
            const nextPoint = this.getPoint(StoreInstance.cheeseArray, true);
            addChess(nextPoint.x, nextPoint.y, this.color);
        }
    }

    playNext() {
        if (StoreInstance.player === this.color) {
            const nextPoint = this.getPoint(StoreInstance.cheeseArray, false);
            addChess(nextPoint.x, nextPoint.y, this.color);
        }
    }

    getPoint(chessData: number[][], started: boolean) {
        this.chessData = chessData;
        this.started = started;
        if (started) {
            return { x: Math.round(size / 2), y: Math.round(size / 2) };
        }
        return this.calPoint();
    }

    calPoint() {
        let score = -Infinity;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (this.chessData[i][j] !== 0) continue;
                const temp = this.chessData.slice();
                for (let k = 0; k < size; k++) {
                    temp[i] = temp[k].slice();
                }
                temp[i][j] = this.color;
                const tempScore = this.getScore(temp, i, j);
                if (tempScore > score) {
                    score = tempScore;
                    this.point = {
                        x: i,
                        y: j,
                    };
                }
            }
        }
        return this.point;
    }

    getScore(chessData: number[][], x: number, y: number) {
        let score = 0;
        for (let i = 0; i < 4; i++) {
            score += this.getScoreByDirection(chessData, x, y, i);
        }
        return score;
    }

    getScoreByDirection(chessData: number[][], x: number, y: number, direction: number) {
        let score = 0;
        let count = 0;
        let emptyCount = 0;
        for (let i = 0; i < 5; i++) {
            const newX = x + i * this.getDirectionX(direction);
            const newY = y + i * this.getDirectionY(direction);
            if (newX < 0 || newX >= size || newY < 0 || newY >= size) {
                break;
            }
            if (chessData[newX][newY] === 0) {
                emptyCount++;
            } else if (chessData[newX][newY] === this.color) {
                count++;
            } else {
                break;
            }
        }
        if (count === 4) {
            score += 10000;
        } else if (count === 3) {
            if (emptyCount === 1) {
                score += 1000;
            } else if (emptyCount === 2) {
                score += 100;
            }
        } else if (count === 2) {
            if (emptyCount === 2) {
                score += 10;
            }
        } else if (count === 1) {
            if (emptyCount === 3) {
                score += 1;
            }
        }
        return score;
    }
    getDirectionX(direction: number) {
        if (direction === 0) {
            return 0;
        } else if (direction === 1) {
            return 1;
        } else if (direction === 2) {
            return 1;
        } else {
            return 1;
        }
    }

    getDirectionY(direction: number) {
        if (direction === 0) {
            return 1;
        } else if (direction === 1) {
            return 0;
        } else if (direction === 2) {
            return 1;
        } else {
            return -1;
        }
    }
}