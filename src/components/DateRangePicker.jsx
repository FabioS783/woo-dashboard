import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

const DateRangePicker = ({ onRangeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('last5days');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showCustomDates, setShowCustomDates] = useState(false);
  const dropdownRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
  }, []);

  const presets = [
    { label: 'Scegli Periodo', value: '' },
    { label: 'Ultimi 5 giorni', value: 'last5days' },
    { label: 'Oggi', value: 'today' },
    { label: 'Ieri', value: 'yesterday' },
    { label: 'Ultimi 7 giorni', value: 'last7days' },
    { label: 'Questo mese', value: 'thisMonth' },
    { label: 'Mese scorso', value: 'lastMonth' },
    { label: 'Ultimi 3 mesi', value: 'last3months' },
    { label: "Quest'anno", value: 'thisYear' },
    { label: 'Personalizzato', value: 'custom' }
  ];

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset.value);
    if (preset.value === 'custom') {
      setShowCustomDates(true);
    } else {
      setShowCustomDates(false);
      onRangeChange({ type: preset.value });
      setIsOpen(false);
    }
  };

  const handleCustomDateSubmit = () => {
    if (startDate && endDate) {
      onRangeChange({
        type: 'custom',
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      });
      setIsOpen(false);
    }
  };

  const getSelectedLabel = () => {
    // Se è il primo render, mostra "Periodo"
    if (isFirstRender.current) {
      return 'Scegli Periodo';
    }
    // Altrimenti mostra il periodo selezionato
    const preset = presets.find(p => p.value === selectedPreset);
    return preset ? preset.label : 'Scegli Periodo';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Calendar className="h-4 w-4 text-gray-500" />
        <span className="text-gray-700">{getSelectedLabel()}</span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
          <div className="p-2">
            {presets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => handlePresetSelect(preset)}
                className={`w-full text-left px-4 py-2 rounded-md ${
                  selectedPreset === preset.value
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {showCustomDates && (
            <div className="border-t border-gray-200 p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data inizio
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data fine
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleCustomDateSubmit}
                  disabled={!startDate || !endDate}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
                >
                  Applica
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;