import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'
import {BrowserRouter} from "react-router-dom";
import {StoreContextProvider} from "./context/StoreContext.jsx";
import {LoadingProvider} from "./context/LoadingContext.jsx";
import {AppContextProvider} from "./context/AppContext.jsx";
import ErrorBoundary from "./components/ErrorHandling/ErrorBoundary.jsx";

createRoot(document.getElementById('root')).render(
    <ErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
        <BrowserRouter>
            <LoadingProvider>
                <StoreContextProvider>
                    <AppContextProvider>
                        <App />
                    </AppContextProvider>
                </StoreContextProvider>
            </LoadingProvider>
        </BrowserRouter>
    </ErrorBoundary>
)
