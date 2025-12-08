
import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, Filter } from 'lucide-react';

interface MetricsFilterProps {
  joinedAt: string;
  onFilterChange: (startDate: Date, endDate: Date) => void;
}

type FilterType = 'monthly' | 'quarterly' | 'yearly';

const MetricsFilter: React.FC<MetricsFilterProps> = ({ joinedAt, onFilterChange }) => {
  const joinDate = new Date(joinedAt);
  const currentYear = new Date().getFullYear();
  const joinYear = joinDate.getFullYear();
  
  // Generate array of available years
  const availableYears: number[] = [];
  for (let y = currentYear; y >= joinYear; y--) {
    availableYears.push(y);
  }

  const [filterType, setFilterType] = useState<FilterType>('monthly');
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedSubPeriod, setSelectedSubPeriod] = useState<number>(new Date().getMonth()); // 0-11 for Month, 0-3 for Quarter

  useEffect(() => {
    calculateDateRange();
  }, [filterType, selectedYear, selectedSubPeriod]);

  const calculateDateRange = () => {
    let start = new Date();
    let end = new Date();

    if (filterType === 'yearly') {
      start = new Date(selectedYear, 0, 1);
      end = new Date(selectedYear, 11, 31, 23, 59, 59);
    } 
    else if (filterType === 'quarterly') {
      // selectedSubPeriod 0 = Q1, 1 = Q2 ...
      const startMonth = selectedSubPeriod * 3;
      start = new Date(selectedYear, startMonth, 1);
      end = new Date(selectedYear, startMonth + 3, 0, 23, 59, 59);
    } 
    else if (filterType === 'monthly') {
      // selectedSubPeriod 0 = Jan, 1 = Feb ...
      start = new Date(selectedYear, selectedSubPeriod, 1);
      end = new Date(selectedYear, selectedSubPeriod + 1, 0, 23, 59, 59);
    }

    onFilterChange(start, end);
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const quarters = [
    'Q1 (Jan-Mar)', 'Q2 (Apr-Jun)', 'Q3 (Jul-Sep)', 'Q4 (Oct-Dec)'
  ];

  return (
    <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 inline-flex items-center gap-2 shadow-sm flex-wrap">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded text-sm text-slate-600 dark:text-slate-300 font-medium">
        <Filter className="w-3 h-3" />
        <span>Filter By:</span>
      </div>

      {/* Filter Type Selector */}
      <select 
        value={filterType}
        onChange={(e) => {
            setFilterType(e.target.value as FilterType);
            // Reset sub-period when changing types to avoid out of bounds (though not strictly necessary here)
            if (e.target.value === 'quarterly') setSelectedSubPeriod(0);
            if (e.target.value === 'monthly') setSelectedSubPeriod(new Date().getMonth());
        }}
        className="px-3 py-1.5 bg-transparent border-r border-slate-200 dark:border-slate-600 text-sm font-medium outline-none text-slate-800 dark:text-white cursor-pointer hover:text-voxa-gold"
      >
        <option value="monthly">Monthly</option>
        <option value="quarterly">Quarterly</option>
        <option value="yearly">Yearly</option>
      </select>

      {/* Year Selector */}
      <div className="relative">
        <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="pl-2 pr-6 py-1.5 bg-transparent text-sm font-bold outline-none text-slate-900 dark:text-white appearance-none cursor-pointer"
        >
            {availableYears.map(y => (
                <option key={y} value={y}>{y}</option>
            ))}
        </select>
        <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Sub Period Selector (Month or Quarter) */}
      {filterType !== 'yearly' && (
        <div className="relative border-l border-slate-200 dark:border-slate-600 pl-2">
            <select 
                value={selectedSubPeriod}
                onChange={(e) => setSelectedSubPeriod(parseInt(e.target.value))}
                className="pl-2 pr-6 py-1.5 bg-transparent text-sm font-bold outline-none text-slate-900 dark:text-white appearance-none cursor-pointer min-w-[120px]"
            >
                {filterType === 'monthly' && months.map((m, i) => (
                    <option key={m} value={i}>{m}</option>
                ))}
                {filterType === 'quarterly' && quarters.map((q, i) => (
                    <option key={q} value={i}>{q}</option>
                ))}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      )}
    </div>
  );
};

export default MetricsFilter;
