import React, { useState, useEffect } from 'react';
import loadingService from '../services/LoadingService';

const LoadingScreen = () => {
  const [state, setState] = useState({
    progress: 0,
    message: 'Inizializzazione...'
  });

  useEffect(() => {
    const unsubscribe = loadingService.subscribe(setState);
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="w-64 text-center">
        <div className="text-xl font-semibold text-gray-700 mb-4">
          Caricamento in corso...
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${state.progress}%` }}
          />
        </div>
        
        <div className="text-sm text-gray-500 mb-2">
          {state.progress}%
        </div>

        <div className="text-sm text-gray-500">
          {state.message}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;