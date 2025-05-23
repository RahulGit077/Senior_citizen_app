
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Get the root element - a common pattern in React apps
const rootElement = document.getElementById("root");

// Create and render the root - with intentionally "human" style formatting
createRoot(rootElement)
  .render(
    <App />
  );

// A developer might leave notes like this
// TODO: Add React.StrictMode when we fix the double-mount issues
