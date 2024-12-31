import React, { useState, useEffect } from 'react';
import WooCommerceService from '../services/WooCommerceService';

const ApiTest = () => {
  const [testResults, setTestResults] = useState({
    status: 'idle',
    message: '',
    data: null
  });

  const runTest = async () => {
    try {
      setTestResults({ status: 'loading', message: 'Test in corso...', data: null });

      const service = new WooCommerceService(
        'https://www.deasalus.shop',
        'ck_767b6f80debfde3da20cfc8208adedf84b9040ff',
        'cs_2ce30756eeb9e0ca6fecee637d0dddbbf7d5355d'
      );

      // Test chiamata products
      const products = await service.fetchData('products');
      console.log('Products response:', products);

      // Test chiamata orders
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const dateStr = encodeURIComponent(service.formatDate(thirtyDaysAgo));
      const orders = await service.fetchData(`orders?after=${dateStr}`);
      console.log('Orders response:', orders);

      setTestResults({
        status: 'success',
        message: 'Test completato con successo!',
        data: { products, orders }
      });
    } catch (error) {
      setTestResults({
        status: 'error',
        message: `Errore durante il test: ${error.message}`,
        data: null
      });
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Test API WooCommerce</h1>
        
        <button
          onClick={runTest}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={testResults.status === 'loading'}
        >
          Esegui Test
        </button>

        {testResults.status !== 'idle' && (
          <div className={`mt-4 p-4 rounded ${
            testResults.status === 'loading' ? 'bg-yellow-50 text-yellow-700' :
            testResults.status === 'success' ? 'bg-green-50 text-green-700' :
            'bg-red-50 text-red-700'
          }`}>
            <p className="font-medium">{testResults.message}</p>
            {testResults.data && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold mb-2">Risultati:</h2>
                <pre className="bg-gray-800 text-white p-4 rounded overflow-auto">
                  {JSON.stringify(testResults.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiTest;