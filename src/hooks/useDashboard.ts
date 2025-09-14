'use client';

import { useState, useEffect } from 'react';

interface GameStats {
  totalGames: number;
  activeGames: number;
  totalPlayers: number;
  totalRevenue: number;
}

export function useDashboard() {
  const [stats, setStats] = useState<GameStats>({
    totalGames: 0,
    activeGames: 0,
    totalPlayers: 0,
    totalRevenue: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: Replace with actual API call
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalGames: 156,
        activeGames: 3,
        totalPlayers: 1247,
        totalRevenue: 45600
      });
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const refreshData = () => {
    loadDashboardData();
  };

  return {
    stats,
    isLoading,
    error,
    refreshData
  };
} 