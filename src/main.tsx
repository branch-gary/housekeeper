import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/global.scss'

console.log('main.tsx: Starting initialization')

const rootElement = document.getElementById('root')
console.log('main.tsx: Found root element:', rootElement)

if (!rootElement) {
  throw new Error('Failed to find root element')
}

const root = ReactDOM.createRoot(rootElement)
console.log('main.tsx: Created React root')

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

console.log('main.tsx: Rendered App component')
