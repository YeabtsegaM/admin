export interface ShopOwner {
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

export interface ShopOwnerFormData {
  firstName: string;
  lastName: string;
  username: string;
  password?: string;
}

export interface ToastState {
  message: string;
  type: 'success' | 'error' | 'warning';
  isVisible: boolean;
} 