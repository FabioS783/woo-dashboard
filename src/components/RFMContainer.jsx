import React, { useState, useEffect } from 'react';
import RFMAnalysis from './RFMAnalysis';
import DateRangePicker from './DateRangePicker';
import WooCommerceService from '../services/WooCommerceService';

const RFMContainer = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const loadRFMData = async (range) => {
    try {
      setLoading(true);
      setError(null);
      const rfmData = await WooCommerceService.getRFMAnalysis(range);
      setData(rfmData);
    } catch (err) {
      setError(err.message || 'Errore durante il caricamento dei dati RFM');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRFMData('last3months');
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento analisi RFM...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-red-700 mb-2">Errore</h3>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => loadRFMData('last3months')} 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Riprova
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Analisi RFM Clienti
        </h2>
        <DateRangePicker 
          onRangeChange={loadRFMData}
          defaultRange="last3months"
        />
      </div>

      {data && <RFMAnalysis data={data} />}
    </div>
  );
};

export default RFMContainer;