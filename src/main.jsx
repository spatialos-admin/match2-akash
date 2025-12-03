import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="orientation-wrapper">
      <div className="orientation-guard">
        <div className="orientation-guard__card">
          <p className="eyebrow">Match 2</p>
          <h1>Best played in portrait.</h1>
          <p>Please rotate your device to continue.</p>
        </div>
      </div>
      <App />
    </div>
  </StrictMode>,
)
