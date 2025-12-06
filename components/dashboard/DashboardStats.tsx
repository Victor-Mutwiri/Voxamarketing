import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface Stat {
  label: string;
  value: string;
  change: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}

interface DashboardStatsProps {
  stats: Stat[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              {stat.change} <ArrowUpRight className="w-3 h-3 ml-1" />
            </span>
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;