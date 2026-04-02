// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './core/App.tsx'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>           //rc-slider conflicts with StrictMode
  //   <BrowserRouter>
  //     <App />
  //   </BrowserRouter>
  // </StrictMode>,
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
