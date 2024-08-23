import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './entry.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  </StrictMode>,
)
