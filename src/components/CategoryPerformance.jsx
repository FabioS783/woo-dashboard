import React from 'react';

const CategoryPerformance = ({ categories }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Performance Categorie</h2>
      <div className="space-y-4">
        {categories.map((category, index) => (
          <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-900">{category.name}</h3>
              <span className="text-sm font-semibold text-blue-600">
                €{category.revenue.toLocaleString('it-IT', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{category.orders} ordini</span>
              <span>{category.products} prodotti venduti</span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{
                  width: `${(category.revenue / categories[0].revenue) * 100}%`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPerformance;