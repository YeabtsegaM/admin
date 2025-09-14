interface RefreshSectionProps {
  isConnected: boolean;
  isRefreshing: boolean;
  lastRefreshTime: Date | null;
  onRefresh: () => void;
}

export default function RefreshSection({ 
  isConnected, 
  isRefreshing, 
  lastRefreshTime, 
  onRefresh 
}: RefreshSectionProps) {
  const formatLastRefreshTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Last Refresh Time */}
      {lastRefreshTime && (
        <div className="text-sm text-gray-500">
          Last refreshed: {formatLastRefreshTime(lastRefreshTime)}
        </div>
      )}
      
      {/* Refresh Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          disabled={!isConnected || isRefreshing}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <svg 
            className={`w-4 h-4 mr-2 transition-transform duration-1000 ${
              isRefreshing ? 'animate-spin' : ''
            }`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>
    </div>
  );
} 