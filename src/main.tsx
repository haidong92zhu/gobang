import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './entry.ts'
import { resetStore, store } from './store/index.ts'
import { Title } from './component/title.tsx'
import './main.less'
import { resetPieces } from './entry'

const reactRoot = createRoot(document.getElementById('root')!);

function reStart() {
  resetStore();
  resetPieces();
  updateTitle();
}

export function updateTitle() {
  reactRoot.render(
    <StrictMode>
      <Title player={store.player} winner={store.winner} reStart={reStart}/>
    </StrictMode>
  )
}

updateTitle();

