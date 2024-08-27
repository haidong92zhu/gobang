
export interface IPoint {
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