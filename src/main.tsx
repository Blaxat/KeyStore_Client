import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AccountProvider } from './context/AccountProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AccountProvider>
        <App/>
    </AccountProvider>
  </StrictMode>,
)
