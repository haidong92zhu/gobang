import { addChess } from "../action";
import { size, StoreInstance } from "../store";
import { IAIService, IPoint } from "./AIService";

const ChessModelStore = new Map<string[], number>();
// 连五
ChessModelStore.set(["11111"], 10000000);
// 活四
ChessModelStore.set(["011110"], 1000000);
// 活三
ChessModelStore.set(["001110","011100", "010110", "011010"], 10000);
// 冲四
ChessModelStore.set(["211110", "011112", "10111", "11011", "11101"], 8000);
// 眠三
ChessModelStore.set(["001112", "010112", "011012", "211100", "211010", "210110"], 1000);
// 活二
ChessModelStore.set(["001100", "011000", "000110"], 800);
// 眠二
ChessModelStore.set(["011200", "001120", "002110", "021100", "001010", "010100"], 50);
// 活一
ChessModelStore.set(["0001000"], 10);
// 眠一
ChessModelStore.set(["000012", "210000", "201000", "000102"], 5);

export class SimpleAIService implements IAIService {
    public chessData: number[][];
    public board: number[][];
    public point: IPoint;
    public started: boolean;
    public color: number;

    constructor() {
        this.chessData = [];
        this.board = [];
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
            return { x: Math.floor(size / 2), y: Math.floor(size / 2) };
        }
        return this.cPoint();
    }

    cPoint() {
        let score = -Infinity;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (this.chessData[i][j] !== 0) continue;
                const temp =  new Array(this.chessData.length);
                for (let k = 0; k < size; k++) {
                    temp[k] = this.chessData[k].slice();
                }
                this.board = temp;
                const tempScore = this.calPoint(i, j, this.color);
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

    private calPoint(x: number, y: number, player: number): number {
        const directions = [
            [1, 0], [0, 1], [1, 1], [1, -1]
        ];
        let totalScore = 0;

        for (const [dx, dy] of directions) {
            const array: number[] = new Array(11);
            const enemyArray : number[] = new Array(11);
            array[5] = 1; enemyArray[5] = 1;
            array[0] = 2;   enemyArray[0] = 2;
            array[10] = 2;  enemyArray[10] = 2;
            for (let i = -4; i < 5; i++) {
                if (i === 0) continue;
                const nx = x + i * dx;
                const ny = y + i * dy;
                if (!this.isValidPosition(nx, ny)) {
                    array[5+i] = 2;
                    enemyArray[5+i] = 2;
                    continue;
                }
                if (this.board[nx][ny] === player) {
                    array[5+i] = 1;
                    enemyArray[5+i] = 2;
                } else if (this.board[nx][ny] === 0) {
                    array[5+i] = 0;
                    enemyArray[5+i] = 0;
                } else {
                    array[5+i] = 2;
                    enemyArray[5+i] = 1;
                }
            }
            totalScore += this.getScore(array);
            totalScore += this.getScore(enemyArray, true);
        }
        
        return totalScore;
    }

    private getScore(array: number[], isEnemy: boolean = false): number {
        let score = 0;
        const scoreScale = isEnemy ? 0.9 : 1;
        const arrayString = array.join('');
        ChessModelStore.forEach((value, key) => {
            key.forEach((k, index) => {
                if (arrayString.includes(k)) {
                    score += value * scoreScale;
                    // 优先形状比较好的点
                    score -= index;
                }
            });
        });
        return score;
    }

    private isValidPosition(x: number, y: number): boolean {
        return x >= 0 && x < this.board.length && y >= 0 && y < this.board[0].length;
    }
}