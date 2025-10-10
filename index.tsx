import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';

const rootElement = document.getElementById('root');

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <AuthProvider>
                <LanguageProvider>
                    <App />
                </LanguageProvider>
            </AuthProvider>
        </React.StrictMode>,
    );
} else {
    console.error("Could not find the root element to mount the application.");
}
