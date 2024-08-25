import { SimpleAIService } from "../ai/simpleAIService";
import { addChess } from "../entry";

export const size = 15;
export const singleSize = 30;
const aIService = new SimpleAIService();
aIService.setColor(1);
// 状态存储
const array = new Array(size);
for (let i = 0; i < size; i++) {
    array[i] = new Array(size).fill(0);
}
export let store = {
    player: 'black',
    currentArray: array,
    winner: '',
}

export const start = (machine: boolean, machineColor: number) => {
    store.player = 'black';
    store.currentArray = array;
    store.winner = '';
    if (machine) {
        aIService.setColor(machineColor);
        if (machineColor === 1) {
            const pt = aIService.getPoint(store.currentArray, true);
            addChess(pt.x, pt.y, aIService.color);
        }
    } else {
        aIService.setColor(0);
    }
}

export const togglePlayer = () => {
    store.player = store.player === 'white' ? 'black' : 'white';
    if ((store.player === 'black' ? 1 : -1) === aIService.color) {
        const pt = aIService.getPoint(store.currentArray, false);
        addChess(pt.x, pt.y, aIService.color);
    }
}

export const resetStore = () => {
    const array = new Array(size);
    for (let i = 0; i < size; i++) {
        array[i] = new Array(size).fill(0);
    }
    store = {
        player: 'black',
        currentArray: array,
        winner: '',
    }
}