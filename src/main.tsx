import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './entry.ts'
import { store } from './store/index.ts'
import { Title } from './component/title.tsx'
import './main.less'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Title player={store.player} winner={store.winner}/>
  </StrictMode>,
)
