import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AccountProvider } from './context/AccountProvider.tsx'
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AccountProvider>
        <App />
      </AccountProvider>
    </BrowserRouter>
  </StrictMode>,
)
