'use client';

interface ReportTabsProps {
  activeTab: 'shop' | 'cashier';
  onTabChange: (tab: 'shop' | 'cashier') => void;
}

export default function ReportTabs({ activeTab, onTabChange }: ReportTabsProps) {
  return (
    <div className="mb-6 border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        <button
          onClick={() => onTabChange('shop')}
          className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'shop'
              ? 'border-green-500 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Shops Report
        </button>
        <button
          onClick={() => onTabChange('cashier')}
          className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'cashier'
              ? 'border-green-500 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Cashiers Report
        </button>
      </nav>
    </div>
  );
}
