
export const size = 15;
export const singleSize = 30;
// 状态存储
const array = new Array(size);
for (let i = 0; i < size; i++) {
    array[i] = new Array(size).fill(0);
}
export const store = {
    player: 'black',
    currentArray: array,
}