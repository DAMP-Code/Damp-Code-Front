import "./style.css"
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { RegistrationProvider } from "./app-components/utilities/RegistrationContext"
import { AuthProvider } from "./app-components/utilities/AuthContext"
import { installMockApi } from "./mock/installMockApi"

if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK !== "false") {
  installMockApi()
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <RegistrationProvider>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </RegistrationProvider>
)