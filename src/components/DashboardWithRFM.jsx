import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Package, CreditCard, Users } from 'lucide-react';
import WooCommerceService from '../services/WooCommerceService';
import ConfigService from '../services/ConfigService';
import StatCard from './StatCard';
import DateRangePicker from './DateRangePicker';
import AnalysisSection from './AnalysisSection';
import RFMAnalysis from './RFMAnalysis';
import LoadingScreen from './LoadingScreen';

const Dashboard = () => {
  const [salesData, setSalesData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    totalProductsSold: 0,
    revenueData: [],
    topProducts: [],
    customerMetrics: {
      new: 0,
      repeat: 0,
      total: 0
    },
    advancedMetrics: {
      repeatPurchaseRate: 0,
      averageItemsPerOrder: 0,
      topCategories: []
    }
  });
  const [rfmData, setRfmData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAllData = async (range) => {
    try {
      setLoading(true);
      setError(null);

      // Carica i dati delle vendite
      const data = await WooCommerceService.getDashboardData(range);
      setSalesData(data);

      // Carica i dati RFM (ultimi 3 mesi per avere una visione più completa)
      const rfm = await WooCommerceService.getRFMAnalysis('last3months');
      setRfmData(rfm);
    } catch (err) {
      setError(err.message || 'Errore nel caricamento dei dati');
      console.error('Errore:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData('last5days');
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-red-700 mb-2">Errore</h3>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => loadAllData('last5days')} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {ConfigService.getAppTitle()}
          </h1>
          <DateRangePicker onRangeChange={loadAllData} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Vendite Totali"
            value={salesData.totalRevenue}
            icon={TrendingUp}
            isCurrency={true}
          />
          <StatCard
            title="Numero Ordini"
            value={salesData.totalOrders}
            icon={Package}
            isCurrency={false}
          />
          <StatCard
            title="Valore Medio Ordine"
            value={salesData.averageOrderValue}
            icon={CreditCard}
            isCurrency={true}
          />
          <StatCard
            title="Prodotti Venduti"
            value={salesData.totalProductsSold}
            icon={Users}
            isCurrency={false}
          />
        </div>

        <div className="mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Andamento Vendite</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#4B5563"
                  />
                  <YAxis 
                    stroke="#4B5563"
                    tickFormatter={(value) => `€${value.toLocaleString('it-IT')}`}
                  />
                  <Tooltip 
                    formatter={(value) => [
                      `€${value.toLocaleString('it-IT', { 
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2 
                      })}`,
                      'Vendite'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Analisi RFM</h2>
            {rfmData && <RFMAnalysis data={rfmData} />}
          </div>
        </div>

        <div className="mb-8">
          <AnalysisSection 
            data={salesData} 
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Prodotti Più Venduti</h2>
          <div className="space-y-4">
            {salesData.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <span className="font-medium text-gray-900">{product.name}</span>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-gray-500">
                      {product.quantity} {product.quantity === 1 ? 'unità' : 'unità'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-semibold text-gray-900">
                    €{product.revenue.toLocaleString('it-IT', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                  <div className="text-sm text-gray-500">
                    €{(product.revenue / product.quantity).toLocaleString('it-IT', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })} / unità
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;