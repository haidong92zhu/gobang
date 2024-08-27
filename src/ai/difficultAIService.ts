import { addChess, isWin } from "../action";
import { PlayerEnum, size, StoreInstance } from "../store";
import { IAIService, IPoint } from "./AIService";

const ChessModelStore = new Map<string[], number>();
// 连五
ChessModelStore.set(["11111"], 10000000);
// 活四
ChessModelStore.set(["011110"], 1000000);
// 活三
ChessModelStore.set(["001110", "011100", "010110", "011010"], 10000);
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

export class DifficultAIService implements IAIService {
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
            const nextPoint = { x: Math.floor(size / 2), y: Math.floor(size / 2) };
            addChess(nextPoint.x, nextPoint.y, this.color);
        }
    }

    playNext() {
        if (StoreInstance.player === this.color) {
            const nextPoint = this.getPoint(StoreInstance.cheeseArray);
            addChess(nextPoint.x, nextPoint.y, this.color);
        }
    }

    getPoint(chessData: number[][]): IPoint {
        const MAX_DEPTH = 0; // 设置搜索深度

        const minimax = (board: number[][], depth: number, isMaximizing: boolean): number => {
            if (depth === 0) {
                return this.cPoint(board, this.color);
            }

            if (isMaximizing) {
                let bestScore = -Infinity;
                for (let i = 0; i < board.length; i++) {
                    for (let j = 0; j < board[i].length; j++) {
                        if (board[i][j] === 0) {
                            if (isWin({ x: i, y: j }, this.color, board)) return Infinity;
                            board[i][j] = this.color; // AI's move
                            const score = minimax(board, depth - 1, false);
                            board[i][j] = 0; // Undo move
                            bestScore = Math.max(score, bestScore);
                        }
                    }
                }
                return bestScore;
            } else {
                let bestScore = Infinity;
                for (let i = 0; i < board.length; i++) {
                    for (let j = 0; j < board[i].length; j++) {
                        if (board[i][j] === 0) {
                            const enemyColor =  this.color === PlayerEnum.black ? PlayerEnum.white : PlayerEnum.black;
                            if (isWin({ x: i, y: j }, enemyColor, board)) return -Infinity;
                            board[i][j] = enemyColor// Player's move
                            const score = minimax(board, depth - 1, true);
                            board[i][j] = 0; // Undo move
                            bestScore = Math.min(score, bestScore);
                        }
                    }
                }
                return bestScore;
            }
        }

        function findBestMove(board: number[][]): { x: number; y: number } {
            let bestScore = -Infinity;
            let move = { x: -1, y: -1 };

            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < board[i].length; j++) {
                    if (board[i][j] === 0) {
                        board[i][j] = 2; // AI's move
                        const score = minimax(board, MAX_DEPTH, false);
                        board[i][j] = 0; // Undo move
                        if (score > bestScore) {
                            bestScore = score;
                            move = { x: i, y: j };
                        }
                    }
                }
            }

            return move;
        }

        return findBestMove(chessData);
    }


    cPoint(cheeseBoard: number[][], color: PlayerEnum) {
        let score = -Infinity;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (cheeseBoard[i][j] !== 0) continue;
                const tempScore = this.calPoint(i, j, cheeseBoard, color);
                if (tempScore > score) {
                    score = tempScore;

                }
            }
        }
        return score;
    }

    private calPoint(x: number, y: number, cheeseBoard: number[][], player: number): number {
        const directions = [
            [1, 0], [0, 1], [1, 1], [1, -1]
        ];
        let totalScore = 0;

        const isValidPosition = (x: number, y: number): boolean => {
            return x >= 0 && x < cheeseBoard.length && y >= 0 && y < cheeseBoard[0].length;
        }

        for (const [dx, dy] of directions) {
            const array: number[] = new Array(11);
            const enemyArray: number[] = new Array(11);
            array[5] = 1; enemyArray[5] = 1;
            array[0] = 2; enemyArray[0] = 2;
            array[10] = 2; enemyArray[10] = 2;
            for (let i = -4; i < 5; i++) {
                if (i === 0) continue;
                const nx = x + i * dx;
                const ny = y + i * dy;
                if (!isValidPosition(nx, ny)) {
                    array[5 + i] = 2;
                    enemyArray[5 + i] = 2;
                    continue;
                }
                if (cheeseBoard[nx][ny] === player) {
                    array[5 + i] = 1;
                    enemyArray[5 + i] = 2;
                } else if (cheeseBoard[nx][ny] === 0) {
                    array[5 + i] = 0;
                    enemyArray[5 + i] = 0;
                } else {
                    array[5 + i] = 2;
                    enemyArray[5 + i] = 1;
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

}