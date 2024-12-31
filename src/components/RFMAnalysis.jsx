import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = {
  'Champions': '#22c55e',     // Verde
  'Loyal': '#3b82f6',        // Blu
  'Potential': '#a855f7',    // Viola
  'New': '#eab308',         // Giallo
  'At Risk': '#f97316',     // Arancione
  'Lost': '#ef4444',        // Rosso
};

const RFM_DESCRIPTIONS = {
  'Champions': 'Clienti di alto valore che acquistano regolarmente',
  'Loyal': 'Clienti fedeli con buona frequenza di acquisto',
  'Potential': 'Clienti con potenziale di crescita',
  'New': 'Nuovi clienti con pochi acquisti',
  'At Risk': 'Clienti che non acquistano da tempo',
  'Lost': 'Clienti inattivi da molto tempo'
};

const SEGMENT_CRITERIA = {
  'Champions': 'R ≥ 4, F ≥ 4, M ≥ 4',
  'Loyal': 'R ≥ 3, F ≥ 3, M ≥ 3',
  'Potential': 'R ≥ 3, F ≥ 1, M ≥ 2',
  'New': 'R ≥ 4, F = 1',
  'At Risk': 'R = 2, F ≥ 2',
  'Lost': 'R = 1'
};

const RFMAnalysis = ({ data }) => {
  const [selectedSegment, setSelectedSegment] = useState(null);

  // Prepara i dati per il grafico a torta
  const pieData = Object.entries(data.segments).map(([name, count]) => ({
    name,
    value: count,
    percentage: ((count / data.totalCustomers) * 100).toFixed(1)
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value, percentage } = payload[0].payload;
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border">
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-gray-600">{value} clienti ({percentage}%)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Grafico a torta */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Distribuzione Segmenti RFM</h3>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={({ name, percentage }) => `${name} ${percentage}%`}
                onClick={(data) => setSelectedSegment(data.name)}
              >
                {pieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[entry.name]}
                    style={{ cursor: 'pointer' }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dettagli segmenti */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Dettaglio Segmenti</h3>
        </div>
        <div className="space-y-4">
          {Object.entries(data.segments).map(([segment, count]) => (
            <div
              key={segment}
              className={`p-4 rounded-lg border ${
                selectedSegment === segment ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => setSelectedSegment(segment)}
              style={{ cursor: 'pointer' }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[segment] }}
                  />
                  <h3 className="font-semibold">{segment}</h3>
                </div>
                <span className="text-sm text-gray-500">
                  {count} clienti ({((count / data.totalCustomers) * 100).toFixed(1)}%)
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{RFM_DESCRIPTIONS[segment]}</p>
              <div className="text-xs bg-gray-100 p-2 rounded">
                <span className="font-medium">Criteri: </span>
                {SEGMENT_CRITERIA[segment]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Metriche dettagliate */}
      <div className="bg-white p-6 rounded-lg shadow-sm md:col-span-2">
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Metriche RFM</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Recency</h3>
            <p className="text-sm text-gray-600">
              Media: {data.metrics.averageRecency.toFixed(1)} giorni
              <br />
              Range: {data.metrics.recencyRange.min} - {data.metrics.recencyRange.max} giorni
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Frequency</h3>
            <p className="text-sm text-gray-600">
              Media: {data.metrics.averageFrequency.toFixed(1)} ordini
              <br />
              Range: {data.metrics.frequencyRange.min} - {data.metrics.frequencyRange.max} ordini
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Monetary</h3>
            <p className="text-sm text-gray-600">
              Media: €{data.metrics.averageMonetary.toFixed(2)}
              <br />
              Range: €{data.metrics.monetaryRange.min.toFixed(2)} - €{data.metrics.monetaryRange.max.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RFMAnalysis;