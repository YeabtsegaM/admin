'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface DashboardData {
  stats: {
    totalShopOwners: { value: number };
    activeShopOwners: { value: number };
    totalShops: { value: number };
    activeShops: { value: number };
    totalCashiers: { value: number };
    activeCashiers: { value: number };
  };
  recentShopOwners: any[];
  recentShops: any[];
  recentCashiers: any[];
}

interface UseAdminSocketReturn {
  isConnected: boolean;
  dashboardData: DashboardData | null;
  requestUpdate: () => void;
  error: string | null;
}

export function useAdminSocket(
  onCashierConnectionUpdate?: (cashierId: string, isConnected: boolean) => void,
  onGameSessionUpdate?: (gameSession: any) => void,
  onActiveGamesUpdate?: (activeGames: any[]) => void
): UseAdminSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // Stabilize callbacks to prevent infinite reconnections
  const stableOnCashierConnectionUpdate = useCallback(
    (cashierId: string, isConnected: boolean) => {
      if (onCashierConnectionUpdate) {
        onCashierConnectionUpdate(cashierId, isConnected);
      }
    },
    [onCashierConnectionUpdate]
  );

  const stableOnGameSessionUpdate = useCallback(
    (gameSession: any) => {
      if (onGameSessionUpdate) {
        onGameSessionUpdate(gameSession);
      }
    },
    [onGameSessionUpdate]
  );

  const stableOnActiveGamesUpdate = useCallback(
    (activeGames: any[]) => {
      if (onActiveGamesUpdate) {
        onActiveGamesUpdate(activeGames);
      }
    },
    [onActiveGamesUpdate]
  );

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    
    console.log('🔌 Admin socket hook: Initializing...');
    console.log('🔌 Admin socket hook: Token exists:', !!token);
    
    if (!token) {
      console.log('❌ Admin socket hook: No authentication token found');
      setError('No authentication token found');
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
    console.log('🔌 Admin socket hook: Connecting to:', apiUrl);

    // Connect to admin socket namespace
    const socket = io(apiUrl, {
      query: {
        type: 'admin',
        token: token
      },
      transports: ['websocket', 'polling']
    });

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('✅ Admin socket connected successfully');
      setIsConnected(true);
      setError(null);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Admin socket disconnected:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Admin socket connection error:', err);
      setError('Failed to connect to real-time updates');
      setIsConnected(false);
    });

    // Dashboard update events
    socket.on('dashboard_update', (data) => {
      console.log('📊 Admin socket: Dashboard update received:', data);
      if (data.success) {
        setDashboardData(data.data);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch dashboard data');
      }
    });

    // Cashier connection status updates
    socket.on('cashier_connection_update', (data) => {
      console.log('👤 Admin socket: Cashier connection update:', data);
      if (data.cashierId) {
        stableOnCashierConnectionUpdate(data.cashierId, data.isConnected);
      }
    });

    // Game session updates
    socket.on('game_session_created', (data) => {
      console.log('🎮 Admin socket: Game session created:', data);
      stableOnGameSessionUpdate(data);
    });

    socket.on('game_session_disconnected', (data) => {
      console.log('🎮 Admin socket: Game session disconnected:', data);
      stableOnGameSessionUpdate({ ...data, isConnected: false });
    });

    socket.on('game_status_updated', (data) => {
      console.log('🎮 Admin socket: Game status updated:', data);
      stableOnGameSessionUpdate(data);
    });

    // Active games updates
    socket.on('active_games_update', (data) => {
      console.log('🎮 Admin socket: Active games update:', data);
      stableOnActiveGamesUpdate(data);
    });

    // Shop updates
    socket.on('shop:updated', (data) => {
      console.log('🏪 Admin socket: Shop update received:', data);
      // Trigger a refresh of shop data
      requestUpdate();
    });

    // Shop owner updates
    socket.on('shopOwner:updated', (data) => {
      console.log('👤 Admin socket: Shop owner update received:', data);
      // Trigger a refresh of shop owner data
      requestUpdate();
    });

    // Cleanup on unmount
    return () => {
      console.log('🔌 Admin socket hook: Cleaning up...');
      if (socket) {
        socket.disconnect();
      }
    };
  }, []); // Remove callback dependencies to prevent infinite reconnections

  const requestUpdate = () => {
    console.log('📊 Admin socket: Requesting dashboard update...');
    if (socketRef.current && isConnected) {
      socketRef.current.emit('request_dashboard_update');
    } else {
      console.log('❌ Admin socket: Cannot request update - not connected');
    }
  };

  return {
    isConnected,
    dashboardData,
    requestUpdate,
    error
  };
} 