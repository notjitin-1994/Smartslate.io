import React, { Suspense, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { useRequestLogger } from './hooks/useRequestLogger';
import './components/animations/animations.css';

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: 'white', backgroundColor: '#1a1a2e', minHeight: '100vh' }}>
          <h1>Something went wrong.</h1>
          <p>Please refresh the page or try again later.</p>
          <button onClick={() => window.location.reload()} style={{ padding: '0.5rem 1rem', marginTop: '1rem', cursor: 'pointer' }}>
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Create a simple loading component
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#0a0a1a',
    color: '#ffffff',
    fontSize: '1.2rem'
  }}>
    Loading Smartslate...
  </div>
);

// Add global error handlers to catch unhandled promise rejections and other errors
const originalErrorHandler = window.onerror;
window.onerror = function(message, source, lineno, colno, error) {
  console.error(`[Global Error] ${message}`, { source, lineno, colno, error });
  if (originalErrorHandler) {
    return originalErrorHandler.apply(this, arguments as any);
  }
  return false; // Prevent default error handling
};

const originalUnhandledRejection = window.onunhandledrejection;
window.onunhandledrejection = function(event) {
  console.error('[Unhandled Promise Rejection]', event.reason);
  if (originalUnhandledRejection) {
    return originalUnhandledRejection.apply(this, event as any);
  }
  event.preventDefault(); // Prevent default unhandled rejection handling
  return false;
};

// Component to wrap App with additional debugging tools
const DebugWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize request logger
  useRequestLogger();
  
  return <>{children}</>;
};

// Create root and render with error boundary and suspense
const root = createRoot(document.getElementById('root')!);

// Log environment info for debugging
console.log('Environment:', {
  NODE_ENV: import.meta.env.MODE,
  VITE_APP_ENV: import.meta.env.VITE_APP_ENV,
  BASE_URL: import.meta.env.BASE_URL,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
  SSR: import.meta.env.SSR
});

try {
  console.log('Starting application render...');
  
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <DebugWrapper>
            <App />
          </DebugWrapper>
        </Suspense>
      </ErrorBoundary>
    </React.StrictMode>
  );
  
  console.log('Application render completed');
} catch (error) {
  console.error('Failed to render application:', error);
  
  // Enhanced error logging
  if (error instanceof Error) {
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: (error as any).cause
    });
  }
  
  // Render a fallback UI if the initial render fails
  root.render(
    <div style={{ 
      padding: '2rem', 
      color: 'white', 
      backgroundColor: '#1a1a2e', 
      minHeight: '100vh',
      fontFamily: 'sans-serif',
      lineHeight: '1.6'
    }}>
      <h1>🚨 Application Error</h1>
      <p>An unexpected error occurred while loading the application.</p>
      <div style={{ 
        backgroundColor: '#2a2a3e', 
        padding: '1rem', 
        borderRadius: '4px', 
        margin: '1rem 0',
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
        overflowX: 'auto'
      }}>
        <div>Error: {error instanceof Error ? error.message : 'Unknown error'}</div>
        {error instanceof Error && error.stack && (
          <div style={{ marginTop: '0.5rem', fontSize: '0.9em', opacity: 0.8 }}>
            {error.stack.split('\n').map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        )}
      </div>
      <div style={{ marginTop: '1.5rem' }}>
        <p>Try these steps:</p>
        <ol style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
          <li>Refresh the page</li>
          <li>Check your internet connection</li>
          <li>Contact support if the issue persists</li>
        </ol>
      </div>
      <button 
        onClick={() => window.location.reload()} 
        style={{ 
          padding: '0.75rem 1.5rem', 
          marginTop: '1.5rem', 
          cursor: 'pointer',
          backgroundColor: '#4a4a8a',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '1rem',
          fontWeight: 'bold',
          transition: 'background-color 0.2s'
        }}
      >
        ↻ Refresh Page
      </button>
    </div>
  );
}