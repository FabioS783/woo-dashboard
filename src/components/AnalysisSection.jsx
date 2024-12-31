import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Package, Calendar, DollarSign } from 'lucide-react';

// Componente per il testo in grassetto
const Bold = ({ children }) => <span className="font-semibold">{children}</span>;

const AnalysisSection = ({ data, dateRange }) => {
  const {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    totalProductsSold,
    customerMetrics,
    advancedMetrics,
    revenueData,
    topProducts
  } = data;

  // Trova il giorno con più vendite
  const bestDay = revenueData.reduce((max, current) => {
    return current.value > max.value ? current : max;
  }, revenueData[0]);

  const generateInsights = () => {
    const insights = [];

    // Insight sul fatturato e ordini
    insights.push({
      type: 'revenue',
      icon: <DollarSign className="h-5 w-5 text-green-500" />,
      title: 'Performance del Periodo',
      content: (
        <>
          Nel periodo selezionato hai generato <Bold>
            {totalRevenue.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
          </Bold> da <Bold>{totalOrders}</Bold> ordini
          {totalOrders > 0 && (
            <>, con una media di <Bold>
              {averageOrderValue.toLocaleString('it-IT', { 
                style: 'currency', 
                currency: 'EUR',
                minimumFractionDigits: 2 
              })}
            </Bold> per ordine</>
          )}.
        </>
      )
    });

    // Miglior giorno
    if (bestDay) {
      insights.push({
        type: 'bestDay',
        icon: <Calendar className="h-5 w-5 text-blue-500" />,
        title: 'Giorno Migliore',
        content: (
          <>
            Il giorno con le vendite più alte è stato <Bold>{bestDay.name}</Bold> con <Bold>
              {bestDay.value.toLocaleString('it-IT', { 
                style: 'currency', 
                currency: 'EUR',
                minimumFractionDigits: 2 
              })}
            </Bold> di fatturato.
          </>
        )
      });
    }

    // Prodotto più venduto
    if (topProducts && topProducts.length > 0) {
      const bestProduct = topProducts[0];
      insights.push({
        type: 'topProduct',
        icon: <Package className="h-5 w-5 text-indigo-500" />,
        title: 'Prodotto Più Venduto',
        content: (
          <>
            <Bold>"{bestProduct.name}"</Bold> è il più venduto con <Bold>{bestProduct.quantity}</Bold> unità 
            vendute e un fatturato di <Bold>
              {bestProduct.revenue.toLocaleString('it-IT', { 
                style: 'currency', 
                currency: 'EUR',
                minimumFractionDigits: 2 
              })}
            </Bold>.
          </>
        )
      });
    }

    // Insight sui clienti
    if (customerMetrics.repeat > 0) {
      const repeatRate = ((customerMetrics.repeat / customerMetrics.total) * 100).toFixed(1);
      insights.push({
        type: 'customers',
        icon: repeatRate > 20 ? 
          <TrendingUp className="h-5 w-5 text-green-500" /> : 
          <TrendingDown className="h-5 w-5 text-yellow-500" />,
        title: 'Analisi Clienti',
        content: (
          <>
            Il <Bold>{repeatRate}%</Bold> dei tuoi clienti sono acquirenti ricorrenti. 
            {repeatRate < 20 ? (
              <> Potresti considerare strategie di fidelizzazione per aumentare questo valore.</>
            ) : (
              <> Ottimo lavoro sulla fidelizzazione dei clienti!</>
            )}
          </>
        )
      });
    }

    // Analisi del carrello medio
    const avgProductsPerOrder = (totalProductsSold / totalOrders).toFixed(1);
    insights.push({
      type: 'cart',
      icon: avgProductsPerOrder > 2 ? 
        <TrendingUp className="h-5 w-5 text-green-500" /> : 
        <TrendingDown className="h-5 w-5 text-yellow-500" />,
      title: 'Analisi Carrello',
      content: (
        <>
          In media vengono acquistati <Bold>{avgProductsPerOrder}</Bold> prodotti per ordine. 
          {avgProductsPerOrder < 2 ? (
            <> Potresti implementare strategie di cross-selling per aumentare questo valore.</>
          ) : (
            <> Le strategie di cross-selling stanno funzionando bene!</>
          )}
        </>
      )
    });

    // Suggerimenti stagionali o basati sul periodo
    if (advancedMetrics.topCategories && advancedMetrics.topCategories.length > 0) {
      const topCategory = advancedMetrics.topCategories[0];
      const categoryShare = ((topCategory.revenue / totalRevenue) * 100).toFixed(1);
      
      if (categoryShare > 50) {
        insights.push({
          type: 'warning',
          icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
          title: 'Diversificazione',
          content: (
            <>
              Il <Bold>{categoryShare}%</Bold> del fatturato proviene dalla categoria "<Bold>{topCategory.name}</Bold>". 
              Considera di diversificare l'offerta per ridurre i rischi.
            </>
          )
        });
      }
    }

    // Performance giornaliera media
    if (totalOrders > 0) {
      const daysInPeriod = revenueData.length;
      const avgDailyRevenue = totalRevenue / daysInPeriod;
      const avgDailyOrders = totalOrders / daysInPeriod;

      insights.push({
        type: 'averages',
        icon: <TrendingUp className="h-5 w-5 text-purple-500" />,
        title: 'Medie Giornaliere',
        content: (
          <>
            In media, ogni giorno generi <Bold>
              {avgDailyRevenue.toLocaleString('it-IT', { 
                style: 'currency', 
                currency: 'EUR',
                minimumFractionDigits: 2 
              })}
            </Bold> da <Bold>{avgDailyOrders.toFixed(1)}</Bold> ordini.
          </>
        )
      });
    }

    return insights;
  };

  const insights = generateInsights();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Note e Analisi</h2>
      <div className="grid gap-6">
        {insights.map((insight, index) => (
          <div 
            key={index} 
            className="p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3 mb-2">
              {insight.icon}
              <h3 className="font-semibold text-gray-900">{insight.title}</h3>
            </div>
            <div className="text-gray-700 ml-8">
              {insight.content}
            </div>
          </div>
        ))}

        {insights.length === 0 && (
          <p className="text-gray-500 text-center">
            Seleziona un periodo per visualizzare l'analisi dei dati
          </p>
        )}
      </div>
    </div>
  );
};

export default AnalysisSection;