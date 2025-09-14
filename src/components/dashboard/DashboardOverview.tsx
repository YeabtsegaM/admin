'use client';

import { useState, forwardRef, useImperativeHandle } from 'react';
import { useAdminSocket } from '@/hooks/useAdminSocket';
import LoadingSpinner from '../ui/LoadingSpinner';
import Toast from '../ui/Toast';
import ConnectionStatus from './ConnectionStatus';
import StatsGrid from './StatsGrid';
import { RecentActivityGrid } from './RecentActivityGrid';
import RefreshSection from './RefreshSection';

export interface DashboardOverviewRef {
  requestUpdate: () => void;
}

const DashboardOverview = forwardRef<DashboardOverviewRef>((props, ref) => {
  const { isConnected, dashboardData, requestUpdate, error } = useAdminSocket();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Expose requestUpdate method to parent
  useImperativeHandle(ref, () => ({
    requestUpdate: () => {
      if (isConnected) {
        requestUpdate();
      }
    }
  }));

  const handleRefresh = async () => {
    if (!isConnected) {
      setToastMessage('Not connected to server');
      setToastType('error');
      setShowToast(true);
      return;
    }

    setIsRefreshing(true);
    setToastMessage('Refreshing dashboard data...');
    setToastType('success');
    setShowToast(true);

    try {
      // Simulate a small delay to show the rotation animation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Request update from socket
      requestUpdate();
      
      // Update last refresh time
      setLastRefreshTime(new Date());
      
      setToastMessage('Dashboard data refreshed successfully!');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      setToastMessage('Failed to refresh data');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Real-time connection error
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {error}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  const { stats, recentShopOwners, recentShops, recentCashiers } = dashboardData;

  return (
    <div className="p-6 bg-gray-100 min-h-full">
      {/* Connection Status */}
      <ConnectionStatus isConnected={isConnected} />

      {/* Stats Grid */}
      <StatsGrid stats={stats} />

      {/* Recent Activity Grid */}
      <RecentActivityGrid 
        recentShopOwners={recentShopOwners}
        recentShops={recentShops}
        recentCashiers={recentCashiers}
      />

      {/* Refresh Section */}
      <RefreshSection
        isConnected={isConnected}
        isRefreshing={isRefreshing}
        lastRefreshTime={lastRefreshTime}
        onRefresh={handleRefresh}
      />

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          isVisible={showToast}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
});

DashboardOverview.displayName = 'DashboardOverview';

export default DashboardOverview; 