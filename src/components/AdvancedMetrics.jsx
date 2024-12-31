import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MetricCard = ({ title, value, previousValue, formatter, suffix = '' }) => {
  const percentage = previousValue ? ((value - previousValue) / previousValue) * 100 : 0;
  const formattedValue = formatter ? formatter(value) : value;
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-2">
        <div className="text-2xl font-bold">
          {formattedValue}{suffix}
        </div>
        {previousValue && (
          <div className="flex items-center mt-2">
            {percentage > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm ${percentage > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {Math.abs(percentage).toFixed(1)}% vs periodo precedente
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const AdvancedMetrics = ({ data, previousData }) => {
  const formatCurrency = (value) => 
    `€${value.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatPercentage = (value) => 
    `${value.toFixed(1)}%`;

  // Calcolo metriche avanzate
  const metrics = {
    // CLV (Customer Lifetime Value)
    clv: data.totalRevenue / data.uniqueCustomers,
    
    // AOV (Average Order Value) per cliente
    aovPerCustomer: data.totalRevenue / data.uniqueCustomers,
    
    // Tasso di riacquisto
    repeatPurchaseRate: (data.repeatingCustomers / data.uniqueCustomers) * 100,
    
    // Tasso di abbandono carrello
    cartAbandonment: ((data.abandonedCarts / (data.abandonedCarts + data.totalOrders)) * 100),
    
    // Margine medio
    averageMargin: ((data.totalRevenue - data.totalCosts) / data.totalRevenue) * 100,
    
    // Vendite per categoria
    topCategoryShare: (data.topCategoryRevenue / data.totalRevenue) * 100,
    
    // Tempo medio tra gli ordini (in giorni)
    averageDaysBetweenOrders: data.averageDaysBetweenOrders,
    
    // Prodotti per ordine
    productsPerOrder: data.totalProductsSold / data.totalOrders
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="Customer Lifetime Value"
          value={metrics.clv}
          previousValue={previousData?.clv}
          formatter={formatCurrency}
        />
        
        <MetricCard
          title="Tasso di Riacquisto"
          value={metrics.repeatPurchaseRate}
          previousValue={previousData?.repeatPurchaseRate}
          formatter={formatPercentage}
          suffix="%"
        />
        
        <MetricCard
          title="Carrelli Abbandonati"
          value={metrics.cartAbandonment}
          previousValue={previousData?.cartAbandonment}
          formatter={formatPercentage}
          suffix="%"
        />
        
        <MetricCard
          title="Margine Medio"
          value={metrics.averageMargin}
          previousValue={previousData?.averageMargin}
          formatter={formatPercentage}
          suffix="%"
        />
        
        <MetricCard
          title="Quota Top Categoria"
          value={metrics.topCategoryShare}
          previousValue={previousData?.topCategoryShare}
          formatter={formatPercentage}
          suffix="%"
        />
        
        <MetricCard
          title="Prodotti per Ordine"
          value={metrics.productsPerOrder}
          previousValue={previousData?.productsPerOrder}
          formatter={(v) => v.toFixed(2)}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Analisi Avanzata</h2>
        <div className="space-y-4 text-gray-600">
          {metrics.repeatPurchaseRate > 30 && (
            <p>
              👍 Ottimo tasso di riacquisto ({metrics.repeatPurchaseRate.toFixed(1)}%), 
              i clienti stanno tornando!
            </p>
          )}
          
          {metrics.cartAbandonment > 70 && (
            <p>
              ⚠️ Alto tasso di abbandono carrello ({metrics.cartAbandonment.toFixed(1)}%). 
              Considera di implementare email di recupero.
            </p>
          )}
          
          {metrics.averageMargin < 20 && (
            <p>
              ⚠️ Il margine medio è basso ({metrics.averageMargin.toFixed(1)}%). 
              Valuta la struttura dei costi.
            </p>
          )}
          
          <p>
            📊 In media, ogni cliente effettua un acquisto ogni {metrics.averageDaysBetweenOrders.toFixed(1)} giorni
            con {metrics.productsPerOrder.toFixed(1)} prodotti per ordine.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdvancedMetrics;