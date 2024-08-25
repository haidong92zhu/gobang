import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './entry.ts'
import { resetStore, store } from './store/index.ts'
import { Title } from './component/title.tsx'
import './main.less'
import { resetPieces } from './entry'
import { Start } from './component/start.tsx'

const reactRoot = createRoot(document.getElementById('root')!);

function reStart(reset = false) {
  resetStore();
  resetPieces();
  updateTitle(reset);
}

export function updateTitle(reset = false) {
  reactRoot.render(
    <StrictMode>
      <Start reset={reset} />
      <Title player={store.player} winner={store.winner} reStart={reStart} />
    </StrictMode>
  )
}

updateTitle();

