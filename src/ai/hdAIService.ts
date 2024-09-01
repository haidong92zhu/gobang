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
ChessModelStore.set(["0001000"], 5);
// 眠一
ChessModelStore.set(["000012", "210000", "201000", "000102"], 10);

export class HDAIService implements IAIService {
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

            if (StoreInstance.anotherAI) {
                setTimeout(() => {
                    const nextPoint = { x: Math.floor(size / 2), y: Math.floor(size / 2) };
                    addChess(nextPoint.x, nextPoint.y, this.color);
                }, 1000);
            } else {
                const nextPoint = { x: Math.floor(size / 2), y: Math.floor(size / 2) };
                addChess(nextPoint.x, nextPoint.y, this.color);
            }
        }
    }

    playNext() {
        if (StoreInstance.player === this.color) {
            if (StoreInstance.anotherAI) {
                setTimeout(() => {
                    const nextPoint = this.getPoint(StoreInstance.cheeseArray);
                    addChess(nextPoint.x, nextPoint.y, this.color);
                }, 1000);
            } else {
                const nextPoint = this.getPoint(StoreInstance.cheeseArray);
                addChess(nextPoint.x, nextPoint.y, this.color);
            }
        }
    }

    getPoint(chessData: number[][]): IPoint {
        const MAX_DEPTH = 2; // 设置搜索深度
        const enemyColor = this.color === PlayerEnum.black ? PlayerEnum.white : PlayerEnum.black;

        const minimax = (board: number[][], depth: number, isMaximizing: boolean, prePoint?: IPoint, alpha: number = -Infinity, beta: number = Infinity): { score: number, point: IPoint } => {
            if (depth === 0 || (prePoint && isWin(prePoint, isMaximizing ? enemyColor : this.color, board))) {
                return { score: this.evaluateAll(board, this.color), point: prePoint || { x: Math.floor(size / 2), y: Math.floor(size / 2) } };
            }
            let move = { x: -1, y: -1 };

            if (isMaximizing) {
                let bestScore = -Infinity;
                for (let i = 0; i < board.length; i++) {
                    for (let j = 0; j < board[i].length; j++) {
                        if (board[i][j] === 0) {
                            board[i][j] = this.color; // AI's move
                            const score = minimax(board, depth - 1, false, { x: i, y: j }, alpha, beta);
                            board[i][j] = 0; // Undo move
                            if (score.score > bestScore) {
                                bestScore = score.score;
                                move = { x: i, y: j };
                            }
                            alpha = Math.max(alpha, bestScore);
                            if (beta <= alpha) {
                                return { score: bestScore, point: move }; // Beta cut-off
                            }
                        }
                    }
                }
                return { score: bestScore, point: move };
            } else {
                let bestScore = Infinity;
                for (let i = 0; i < board.length; i++) {
                    for (let j = 0; j < board[i].length; j++) {
                        if (board[i][j] === 0) {
                            board[i][j] = enemyColor; // Player's move
                            const score = minimax(board, depth - 1, true, { x: i, y: j }, alpha, beta);
                            board[i][j] = 0; // Undo move
                            if (score.score < bestScore) {
                                bestScore = score.score;
                                move = { x: i, y: j };
                            }
                            beta = Math.min(beta, bestScore);
                            if (beta <= alpha) {
                                return { score: bestScore, point: move }; // Alpha cut-off
                            }
                        }
                    }
                }
                return { score: bestScore, point: move };
            }
        }

        return minimax(chessData, MAX_DEPTH, true).point;
    }

    evaluateAll(cheeseBoard: number[][], color: PlayerEnum): number {
        let score = 0;

        // Evaluate horizontal lines
        for (let row = 0; row < cheeseBoard.length; row++) {
            score += this.evaluateLine(cheeseBoard[row], color);
        }

        // Evaluate vertical lines
        for (let col = 0; col < cheeseBoard[0].length; col++) {
            const column = cheeseBoard.map(row => row[col]);
            score += this.evaluateLine(column, color);
        }

        // Evaluate diagonals
        score += this.evaluateDiagonals(cheeseBoard, color);

        return score;
    }

    private evaluateDiagonals(board: number[][], color: PlayerEnum): number {
        let score = 0;

        // Evaluate  diagonals
        for (let i = 0; i <= board.length - 5; i++) {
            const diagonal1 = board.map((row, index) => row[index + i]);
            const diagonal2 = board.map((row, index) => row[board.length - 1 - index - i]);

            const diagonal3 = board.map((row, index) => row[board.length - 1 - index + i] ?? -1);
            const diagonal4 = board.map((row, index) => row[index - i] ?? -1);
            score += this.evaluateLine(diagonal1, color);
            score += this.evaluateLine(diagonal2, color);
            score += this.evaluateLine(diagonal3, color);
            score += this.evaluateLine(diagonal4, color);
        }
        return score;
    }
    
    private evaluateLine(array: number[], color: PlayerEnum): number {
        let score = 0;
        const selfArray = array.map(_ => {
            if (!_) return 0;
            if (_ < 0) return 2;
            return _ === color ? 1 : 2
        });
        const enemyArray = array.map(_ => {
            if (!_) return 0;
            if (_ < 0) return 2;
            return _ === color ? 2 : 1
        });
        score += this.getLineScore(selfArray);
        score -= this.getLineScore(enemyArray, true);

        return score;
    }

    private getLineScore(array: number[], isEnemy: boolean = false): number {
        let score = 0;
        const scoreScale = isEnemy ? 0.9 : 1;
        const arrayString = array.join('');
        ChessModelStore.forEach((value, key) => {
            key.forEach((k, index) => {
                if (arrayString.includes(k)) {
                    score += value * scoreScale;
                    // 优先形状比较好的点
                    score -= index;
                    if (arrayString.indexOf(k) !== arrayString.lastIndexOf(k)) {
                        // 有多个相同的，则计算两次
                        score += value * scoreScale;
                        // 优先形状比较好的点
                        score -= index;
                    }
                }

            });
        });
        return score;
    }
}