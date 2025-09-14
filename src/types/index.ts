// Admin User Types
export interface AdminUser {
  id: string;
  username: string;
  fullName: string;
  role: 'systemadmin' | 'admin' | 'shopadmin' | 'superagent';
  createdAt: string;
  lastLogin: string;
}

// Game Types
export interface Game {
  id: string;
  gameId: string;
  eventId: string;
  status: GameStatus;
  calledNumbers: number[];
  totalPlayers: number;
  totalRevenue: number;
  createdAt: string;
  startedAt?: string;
  endedAt?: string;
}

export type GameStatus = 'waiting' | 'active' | 'paused' | 'finished' | 'completed' | 'cancelled';

// Dashboard Stats
export interface DashboardStats {
  totalGames: number;
  activeGames: number;
  totalPlayers: number;
  totalRevenue: number;
  todayGames: number;
  todayRevenue: number;
  todayPlayers: number;
}

// Player Types
export interface Player {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  totalGames: number;
  totalWins: number;
  totalSpent: number;
  joinedAt: string;
  lastPlayed: string;
}

// Revenue Types
export interface Revenue {
  id: string;
  gameId: string;
  amount: number;
  type: 'entry_fee' | 'prize_pool' | 'commission';
  createdAt: string;
}

// Activity Types
export interface Activity {
  id: string;
  type: 'game_started' | 'game_ended' | 'player_joined' | 'revenue_generated';
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginResponse {
  token: string;
  user: AdminUser;
}

// Form Types
export interface LoginForm {
  username: string;
  password: string;
}

export interface CreateGameForm {
  eventId: string;
  maxPlayers: number;
  entryFee: number;
  prizePool: number;
}

// Balance Types
export interface BalanceData {
  shopId: string;
  shopName: string;
  tickets: number;
  bets: number;
  unclaimed: number;
  unclaimedCount: number;
  redeemed: number;
  redeemCount: number;
  ggr: number;
  netBalance: number;
  lastUpdated: string;
}

export interface CashierDetail {
  cashierId: string;
  cashierName: string;
  tickets: number;
  bets: number;
  unclaimed: number;
  unclaimedCount: number;
  redeemed: number;
  redeemCount: number;
  ggr: number;
  netBalance: number;
  status: 'active' | 'inactive';
}

export interface BalanceResponse {
  balanceData: BalanceData[];
  shops: Shop[];
  cashiers: Cashier[];
}

export interface Shop {
  _id: string;
  shopName: string;
  status: 'active' | 'inactive';
}

export interface Cashier {
  _id: string;
  fullName: string;
  username: string;
  shop: {
    _id: string;
    shopName: string;
  };
  isActive: boolean;
} 