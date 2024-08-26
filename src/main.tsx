import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Title } from './component/title.tsx'
import './main.css'
import { Start } from './component/start.tsx'
import { reStart } from './action/index.ts'
import { StoreInstance } from './store/index.ts'
import { drawCheeseBoard } from './cheeseBoard';

// 绘制棋盘
const reactRoot = createRoot(document.getElementById('root')!);

export function updateTitle() {
  reactRoot.render(
    <StrictMode>
      <Start/>
      <Title player={StoreInstance.player} winner={StoreInstance.winner} reStart={reStart}/>
    </StrictMode>
  )
}

updateTitle();
drawCheeseBoard();

