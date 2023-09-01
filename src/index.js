import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import Header from './components/Header'
import SafeProvider from '@safe-global/safe-apps-react-sdk'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <SafeProvider>
      {/* <Header /> */}
      <App />
    </SafeProvider>
  </React.StrictMode>,
)
