import { IAIService, SimpleAIService } from "../ai/simpleAIService";

export const size = 15;
export const singleSize = 30;
export enum PlayerEnum {
    black = 1,
    white = -1,
    none = 0,
}

class Store {
    public static _instance: Store = new Store();
    public isPlaying: boolean;
    public player: PlayerEnum;
    public cheeseArray: number[][];
    public winner: PlayerEnum;
    public AIServiec: IAIService;

    constructor() {
        this.isPlaying = false;
        this.player = PlayerEnum.black;
        this.cheeseArray = getEmptyArray(size);
        this.winner = PlayerEnum.none;
        this.AIServiec = new SimpleAIService();
    }

    static instance() {
        return this._instance;
    }

    public startGame(machine: boolean, machineColor: PlayerEnum) {
        if (machine) {
            this.AIServiec.setColor(machineColor);
            this.AIServiec.start();
        } else {
            this.AIServiec.setColor(PlayerEnum.none);
        }
        this.isPlaying = true;
    }

    public togglePlayer() {
        if (!this.winner) {
            this.player = this.player === PlayerEnum.black ? PlayerEnum.white : PlayerEnum.black;
            this.AIServiec.playNext();
        }
    }

    public reset(backToTitle: boolean = false) {
        this.player = PlayerEnum.black;
        this.cheeseArray = getEmptyArray(size);
        this.winner = PlayerEnum.none;
        if (backToTitle) {
            this.isPlaying = false;
        } else {
            this.AIServiec.start();
        }
    }
}

function getEmptyArray(size: number) {
    const array = new Array(size);
    for (let i = 0; i < size; i++) {
        array[i] = new Array(size).fill(0);
    }
    return array;
}

export const StoreInstance = Store.instance();
