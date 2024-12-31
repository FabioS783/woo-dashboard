import React from 'react';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="App">
      <ErrorBoundary>
        <Dashboard />
      </ErrorBoundary>
    </div>
  );
}

// Componente per catturare errori non gestiti
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Errore non gestito:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="bg-red-50 p-6 rounded-lg max-w-lg">
            <h2 className="text-xl font-bold text-red-700 mb-4">
              Ops! Qualcosa è andato storto
            </h2>
            <p className="text-red-600 mb-4">
              {this.state.error?.message || 'Si è verificato un errore imprevisto'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Ricarica la pagina
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default App;