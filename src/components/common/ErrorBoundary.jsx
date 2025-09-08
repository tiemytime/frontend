import React from 'react';
import StarfieldBackground from '../background/Starfeildbackground';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error for debugging
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <>
          <StarfieldBackground />
          
          {/* Earth image positioned between starfield layers */}
          <img 
            src="/earth.png" 
            alt="Earth" 
            className="fixed top-0 left-0 w-full h-full object-cover opacity-60"
            style={{ 
              pointerEvents: 'none',
              zIndex: -12
            }}
          />

          <div className="min-h-screen flex items-center justify-center relative z-10">
            <div className="text-center p-8 bg-black/30 backdrop-blur-md border border-white/20 rounded-lg max-w-md">
              <div className="text-6xl mb-4">🕯️</div>
              <h1 className="text-white font-marcellus text-2xl mb-4">Something went wrong</h1>
              <p className="text-gray-300 mb-6 font-marcellus">
                We're sorry for the inconvenience. Please try refreshing the page to continue your spiritual journey.
              </p>
              <button 
                onClick={this.handleRefresh}
                className="border border-yellow-400 text-yellow-400 bg-yellow-400/10 backdrop-blur-sm px-6 py-3 rounded font-marcellus hover:bg-yellow-400/20 transition-all duration-300"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
