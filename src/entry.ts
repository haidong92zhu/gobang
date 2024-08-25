
import { Application, Graphics, Container } from 'pixi.js';
import { store, size, singleSize } from './store';
import { isWin } from './referee';
// pixi绘制
const pixiApp = new Application({
    resizeTo: window,
    backgroundColor: 'grey',
    antialias: true,
});
document.body.appendChild(pixiApp.view as unknown as Node);

// 绘制棋盘
const myContainer = new Container();
// 相对于根节点偏移
myContainer.position.set(pixiApp.view.width / 2, pixiApp.view.height / 2);
// 竖线
for (let i = Math.ceil(- size / 2); i < size / 2; i++) {
    const line = new Graphics();
    line.lineStyle(1, 0x000000);
    line.moveTo(0, -(size - 1) / 2 * singleSize);
    line.lineTo(0, (size - 1) / 2 * singleSize);
    line.endFill();
    myContainer.addChild(line);
    line.position.set(i * singleSize, 0);
}
// 横线
for (let i = Math.ceil(- size / 2); i < size / 2; i++) {
    const line = new Graphics();
    line.lineStyle(1, 0x000000);
    line.moveTo(-(size - 1) / 2 * singleSize, 0);
    line.lineTo((size - 1) / 2 * singleSize, 0);
    line.endFill();
    myContainer.addChild(line);
    line.position.set(0, i * singleSize);
}

// 绘制棋子
for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
        const rectangle = new Graphics();
        rectangle.beginFill('yellow');
        rectangle.alpha = 0.2;
        rectangle.drawRect(0, 0, singleSize, singleSize);
        rectangle.position.set((-size / 2 + i) * singleSize, (-size / 2 + j) * singleSize);
        rectangle.endFill();
        myContainer.addChild(rectangle);
        // 可交互
        rectangle.eventMode = 'static';
        rectangle.onclick = () => {
            if (store.winner) return;
            if (store.currentArray[i][j] !== 0) return;
            if (store.player === 'white') {
                const circle = new Graphics();
                circle.beginFill('white');
                circle.drawCircle(0, 0, singleSize * 2 / 5);
                circle.position.set((Math.ceil(-size / 2) + i) * singleSize, (Math.ceil(-size / 2)+ j) * singleSize);
                circle.endFill();
                myContainer.addChild(circle);
                store.currentArray[i][j] = -1;
                if (isWin({x: i, y: j}, store.player)) {
                    console.log(store.player, ' win the game!');
                    store.winner = store.player;
                }
                store.player = 'black';
            } else {
                const circle = new Graphics();
                circle.beginFill('black');
                circle.drawCircle(0, 0, singleSize * 2 / 5);
                circle.position.set((Math.ceil(-size / 2) + i) * singleSize, (Math.ceil(-size / 2)+ j) * singleSize);
                circle.endFill();
                myContainer.addChild(circle);
                store.currentArray[i][j] = 1;
                if (isWin({x: i, y: j}, store.player)) {
                    console.log(store.player, ' win the game!');
                    store.winner = store.player;
                }
                store.player = 'white';
            }
        };
        // rectangle.onmouseenter = () => {
        //     console.log('mouseenter');
        // };
        // rectangle.onmouseout = () => {
        //     console.log('mouseout');
        // }
    }
}

// 自定义Container最后需要添加到app.stage
pixiApp.stage.addChild(myContainer);