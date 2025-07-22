import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

/**
 * A robust Error Boundary to catch and handle runtime errors in child components, 
 * preventing a full app crash.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    // In production, this would be sent to error tracking service
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="container mx-auto px-6 py-24 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Something went wrong.</h1>
          <p className="text-text-secondary">We're sorry for the inconvenience. Please try refreshing the page.</p>
          {this.state.error && (
            <pre className="text-left text-red-400 mt-4 bg-brand-card-bg p-4 rounded-lg overflow-auto">
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
