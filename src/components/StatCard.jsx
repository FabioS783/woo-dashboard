import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, isCurrency = true, trend = null }) => {
  const formattedValue = (() => {
    if (typeof value !== 'number') return value;
    
    if (isCurrency) {
      return value.toLocaleString('it-IT', { 
        style: 'currency', 
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
      });
    }
    
    return value.toLocaleString('it-IT');
  })();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {Icon && <Icon className="h-4 w-4 text-gray-500" />}
      </div>
      <div className="mt-2">
        <div className="text-2xl font-bold">{formattedValue}</div>
        {trend !== null && (
          <div className="flex items-center mt-2">
            {trend > 0 ? (
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {Math.abs(trend)}% rispetto al periodo precedente
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;