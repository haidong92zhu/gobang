import { Application, Graphics, Container } from 'pixi.js';
import { StoreInstance, size, singleSize, PlayerEnum } from '../store';
import { updateTitle } from '../main';
import { addChess } from '../action';

let piecesContainer: Container;

export function drawCheeseBoard() {
    // pixi绘制
    const pixiApp = new Application({
        resizeTo: window,
        backgroundColor: '#e9e5e1',
        antialias: true,
    });
    document.body.appendChild(pixiApp.view as unknown as Node);

    // 绘制棋盘
    const myContainer = new Container();
    piecesContainer = new Container();
    // 相对于根节点偏移
    myContainer.position.set(pixiApp.view.width / 2, pixiApp.view.height / 2);
    piecesContainer.position.set(pixiApp.view.width / 2, pixiApp.view.height / 2);
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
                if (StoreInstance.winner) return;
                if (StoreInstance.cheeseArray[i][j] !== 0) return;
                if (StoreInstance.player === PlayerEnum.white) {
                    addChess(i, j, PlayerEnum.white);
                } else {
                    addChess(i, j, 1);
                }
                updateTitle();
            };
        }
    }
    // 自定义Container最后需要添加到app.stage
    pixiApp.stage.addChild(myContainer);
    pixiApp.stage.addChild(piecesContainer);

}



export function resetPieces() {
    piecesContainer.removeChildren();
}

export function pixiAddCheese(x: number, y: number, color: number) {
    const circle = new Graphics();
    circle.beginFill(color === 1 ? 'black' : 'white');
    circle.drawCircle(0, 0, singleSize * 2 / 5);
    circle.position.set((Math.ceil(-size / 2) + x) * singleSize, (Math.ceil(-size / 2) + y) * singleSize);
    circle.endFill();
    piecesContainer.addChild(circle);
}