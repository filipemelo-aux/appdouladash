
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  growthIndicator?: string;
  featured?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, growthIndicator, featured = false }) => {
  const containerClasses = `relative bg-white rounded-xl shadow-sm p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border ${
    featured
      ? 'border-brand-200'
      : 'border-gray-100'
  }`;
  
  return (
    <div className={containerClasses}>
      <div className="absolute top-6 right-6 text-gray-300">
        {icon}
      </div>
      <div>
        <h3 className="text-xs font-medium text-brand-500 tracking-wider uppercase">
          {title}
        </h3>
        <p className="mt-2 text-4xl font-semibold text-brand-900">
          {value}
        </p>
        {growthIndicator && (
          <p className="mt-2 text-sm text-green-600 flex items-center font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
            </svg>
            <span>{growthIndicator}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
