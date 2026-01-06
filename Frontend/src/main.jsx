import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { SuggestionProvider } from './Context/SuggestionContext.jsx'
import { LocationProvider } from './Context/LocationContext.jsx'
import { KeySuggestionProvider } from './Context/KeyBoardContext.jsx'
import "./index.css"
import { AuthProvider } from './Context/AuthContext.jsx'
// import { ClerkProvider } from "@clerk/clerk-react";

  // const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  // if (!PUBLISHABLE_KEY) {
  //   throw new Error('Add your Clerk Publishable Key to the .env file')
  // }

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <ClerkProvider publishableKey={PUBLISHABLE_KEY}> */}
    <AuthProvider>
    <BrowserRouter>
    <SuggestionProvider>
      <LocationProvider>
        <KeySuggestionProvider>
    <App />
    </KeySuggestionProvider>
    </LocationProvider>
    </SuggestionProvider>
    </BrowserRouter>
    </AuthProvider>
    {/* </ClerkProvider> */}
  </StrictMode>,
)
