import React from 'react';
import { Users, UserPlus, Repeat } from 'lucide-react';

const MetricBox = ({ title, value, icon: Icon, subtitle }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        )}
      </div>
      <div className="p-3 bg-blue-50 rounded-full">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
    </div>
  </div>
);

const CustomerMetrics = ({ metrics }) => {
  const { new: newCustomers, repeat, total } = metrics;
  const repeatRate = total > 0 ? ((repeat / total) * 100).toFixed(1) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricBox
        title="Clienti Totali"
        value={total}
        icon={Users}
        subtitle="Nel periodo selezionato"
      />
      <MetricBox
        title="Nuovi Clienti"
        value={newCustomers}
        icon={UserPlus}
        subtitle="Prime visite"
      />
      <MetricBox
        title="Clienti Ricorrenti"
        value={repeat}
        icon={Repeat}
        subtitle={`${repeatRate}% del totale`}
      />
    </div>
  );
};

export default CustomerMetrics;