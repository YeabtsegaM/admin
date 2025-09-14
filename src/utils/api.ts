import { API_CONFIG } from '@/lib/constants';
import type { ApiResponse, LoginResponse, DashboardStats, Game, BalanceResponse, CashierDetail } from '@/types';

interface ShopOwner {
  _id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string; // For backward compatibility with existing data
  username: string;
  password?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = localStorage.getItem('adminToken');



    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();



      if (!response.ok) {
        // Handle specific HTTP status codes
        if (response.status === 401) {
          throw new Error('Invalid or expired token');
        } else if (response.status === 403) {
          throw new Error('Access denied');
        } else if (response.status === 404) {
          throw new Error('Resource not found');
        } else if (response.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
        }
      }

      return data;
    } catch (error: any) {
      console.error('API request failed:', error);
      
      // Handle network errors more gracefully
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Server is not available. Please check your connection.');
      }
      
      throw new Error(error.message || 'Network error');
    }
  }

  // Auth endpoints
  async login(username: string, password: string): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.request<void>('/api/auth/logout', {
      method: 'POST',
    });
  }

  async verifyToken(): Promise<ApiResponse<any>> {
    return this.request<any>('/api/auth/verify');
  }

  // Dashboard endpoints
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.request<DashboardStats>('/api/dashboard/stats');
  }

  async getRecentActivity(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/api/dashboard/activity');
  }

  // Shop Owners endpoints
  async getShopOwners(): Promise<ApiResponse<ShopOwner[]>> {
    return this.request<ShopOwner[]>('/api/shop-owners');
  }

  async createShopOwner(shopOwnerData: { firstName: string; lastName: string; username: string; password?: string }): Promise<ApiResponse<ShopOwner>> {
    return this.request<ShopOwner>('/api/shop-owners', {
      method: 'POST',
      body: JSON.stringify(shopOwnerData),
    });
  }

  async updateShopOwner(shopOwnerId: string, shopOwnerData: { firstName: string; lastName: string; username: string; password?: string }): Promise<ApiResponse<ShopOwner>> {
    return this.request<ShopOwner>(`/api/shop-owners/${shopOwnerId}`, {
      method: 'PUT',
      body: JSON.stringify(shopOwnerData),
    });
  }

  async deleteShopOwner(shopOwnerId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/shop-owners/${shopOwnerId}`, {
      method: 'DELETE',
    });
  }

  async toggleShopOwnerStatus(shopOwnerId: string): Promise<ApiResponse<ShopOwner>> {
    return this.request<ShopOwner>(`/api/shop-owners/${shopOwnerId}/toggle-status`, {
      method: 'PATCH',
    });
  }

  // Shops endpoints
  async getShops(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/api/shops');
  }

  async createShop(shopData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/api/shops', {
      method: 'POST',
      body: JSON.stringify(shopData),
    });
  }

  async updateShop(shopId: string, shopData: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/shops/${shopId}`, {
      method: 'PUT',
      body: JSON.stringify(shopData),
    });
  }

  async deleteShop(shopId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/shops/${shopId}`, {
      method: 'DELETE',
    });
  }

  async updateShopStatus(shopId: string, status: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/shops/${shopId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Game endpoints
  async getGames(): Promise<ApiResponse<Game[]>> {
    return this.request<Game[]>('/api/games');
  }

  async createGame(gameData: any): Promise<ApiResponse<Game>> {
    return this.request<Game>('/api/games', {
      method: 'POST',
      body: JSON.stringify(gameData),
    });
  }

  async updateGame(gameId: string, gameData: any): Promise<ApiResponse<Game>> {
    return this.request<Game>(`/api/games/${gameId}`, {
      method: 'PUT',
      body: JSON.stringify(gameData),
    });
  }

  async deleteGame(gameId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/games/${gameId}`, {
      method: 'DELETE',
    });
  }

  // Player endpoints
  async getPlayers(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/api/players');
  }

  // Revenue endpoints
  async getRevenue(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/api/revenue');
  }

  // Cashiers endpoints
  async getCashiers(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/api/cashiers');
  }

  async createCashier(cashierData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/api/cashiers', {
      method: 'POST',
      body: JSON.stringify(cashierData),
    });
  }

  async updateCashier(cashierId: string, cashierData: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/cashiers/${cashierId}`, {
      method: 'PUT',
      body: JSON.stringify(cashierData),
    });
  }

  async deleteCashier(cashierId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/cashiers/${cashierId}`, {
      method: 'DELETE',
    });
  }

  async toggleCashierStatus(cashierId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/cashiers/${cashierId}/status`, {
      method: 'PATCH',
    });
  }

  async getCashierBatFile(cashierId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/cashiers/${cashierId}/bat-file`);
  }

  async getCashierBatFileContent(cashierId: string): Promise<{ displayBatContent: string }> {
    const response = await fetch(`${this.baseUrl}/api/cashiers/${cashierId}/bat-file/content`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get BAT file content');
    }
    
    const data = await response.json();
    return {
      displayBatContent: data.data?.displayBatContent || data.displayBatContent || ''
    };
  }

  async regenerateCashierSession(cashierId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/cashiers/${cashierId}/regenerate-session`, {
      method: 'POST',
    });
  }

  async getGameResults(params: {
    shopId: string;
    cashierId?: string;
    date: string;
    time?: string;
    eventId: string;
  }): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/api/game-results/admin-search', {
      method: 'POST',
      body: JSON.stringify({
        shopId: params.shopId,
        cashierId: params.cashierId,
        date: params.date,
        eventId: params.eventId,
        ...(params.time && { time: params.time })
      }),
    });
  }

  async getSlipDetails(params: {
    shopId: string;
    cashierId?: string;
    date?: string;
    ticketNumber?: string;
    gameId?: string;
  }): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/api/slips/search', {
      method: 'POST',
      body: JSON.stringify({
        shopId: params.shopId,
        cashierId: params.cashierId,
        date: params.date,
        ticketNumber: params.ticketNumber,
        gameId: params.gameId
      }),
    });
  }

  // Balance endpoints
  async getBalanceData(params?: {
    shopId?: string;
    cashierId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<BalanceResponse>> {
    const queryParams = new URLSearchParams();
    if (params?.shopId) queryParams.append('shopId', params.shopId);
    if (params?.cashierId) queryParams.append('cashierId', params.cashierId);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    return this.request<BalanceResponse>(`/api/balance/data?${queryParams.toString()}`);
  }

  // Get cashier details for a specific shop
  async getCashierDetails(shopId: string, params?: {
    startDate?: string;
    endDate?: string;
    cashierId?: string;
  }): Promise<ApiResponse<CashierDetail[]>> {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.cashierId) queryParams.append('cashierId', params.cashierId);

    const queryString = queryParams.toString();
    const url = queryString ? `/api/balance/cashier-details/${shopId}?${queryString}` : `/api/balance/cashier-details/${shopId}`;
    
    return this.request<CashierDetail[]>(url);
  }

  // Users endpoints
  async getUsers(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/api/users');
  }

  async createUser(userData: { username: string; password: string; fullName: string; role: string }): Promise<ApiResponse<any>> {
    return this.request<any>('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUserStatus(userId: string, isActive: boolean): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
  }

  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async resetUserPassword(userId: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/api/users/${userId}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ newPassword }),
    });
  }
}

export const apiClient = new ApiClient(); 