interface StatCardProps {
  title: string;
  total: number;
  active: number;
  icon: React.ReactNode;
  color?: 'green' | 'blue' | 'purple' | 'orange' | 'indigo' | 'teal';
}

export default function StatCard({ title, total, active, icon, color = 'green' }: StatCardProps) {
  const colorConfig = {
    green: {
      bg: 'bg-gray-100',
      border: 'border-green-200',
      iconBg: 'bg-green-500',
      activeText: 'text-green-600',
      progress: 'bg-green-500',
      title: 'text-green-700',
      iconColor: 'text-white'
    },
    blue: {
      bg: 'bg-gradient-to-br from-blue-50 to-sky-50',
      border: 'border-blue-200',
      iconBg: 'bg-blue-500',
      activeText: 'text-blue-600',
      progress: 'bg-blue-500',
      title: 'text-blue-700',
      iconColor: 'text-white'
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-50 to-violet-50',
      border: 'border-purple-200',
      iconBg: 'bg-purple-500',
      activeText: 'text-purple-600',
      progress: 'bg-purple-500',
      title: 'text-purple-700',
      iconColor: 'text-white'
    },
    orange: {
      bg: 'bg-gradient-to-br from-orange-50 to-amber-50',
      border: 'border-orange-200',
      iconBg: 'bg-orange-500',
      activeText: 'text-orange-600',
      progress: 'bg-orange-500',
      title: 'text-orange-700',
      iconColor: 'text-white'
    },
    indigo: {
      bg: 'bg-gradient-to-br from-indigo-50 to-blue-50',
      border: 'border-indigo-200',
      iconBg: 'bg-indigo-500',
      activeText: 'text-indigo-600',
      progress: 'bg-indigo-500',
      title: 'text-indigo-700',
      iconColor: 'text-white'
    },
    teal: {
      bg: 'bg-gradient-to-br from-teal-50 to-cyan-50',
      border: 'border-teal-200',
      iconBg: 'bg-teal-500',
      activeText: 'text-teal-600',
      progress: 'bg-teal-500',
      title: 'text-teal-700',
      iconColor: 'text-white'
    }
  };

  const config = colorConfig[color];
  const percentage = total > 0 ? Math.round((active / total) * 100) : 0;

  return (
    <div className={`rounded-xl shadow-sm border ${config.bg} ${config.border} p-4 transition-all duration-300 hover:shadow-md hover:scale-102`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-sm font-semibold ${config.title}`}>{title}</h3>
        <div className={`p-2 rounded-lg ${config.iconBg} ${config.iconColor} shadow-sm`}>
          {icon}
        </div>
      </div>
      
      {/* Stats */}
      <div className="space-y-2">
        {/* Total and Active Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Total</div>
              <div className="text-xl font-bold text-gray-900">{total}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Active</div>
              <div className={`text-lg font-bold ${config.activeText}`}>{active}</div>
            </div>
          </div>
          <div className={`text-xs font-semibold ${config.activeText} bg-white/70 px-2 py-1 rounded-full border border-${color}-200`}>
            {percentage}%
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 ease-out ${config.progress} shadow-sm`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
} 