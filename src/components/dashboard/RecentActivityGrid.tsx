import RecentItemCard from './RecentItemCard';

interface RecentItem {
  _id?: string;
  fullName?: string;
  username?: string;
  name?: string;
  address?: string;
  shopName?: string;
  location?: string;
  status?: string;
  isActive?: boolean;
  firstName?: string;
  lastName?: string;
  shop?: {
    _id: string;
    shopName: string;
  };
  createdAt?: string;
}

interface RecentActivityGridProps {
  recentShopOwners: RecentItem[];
  recentShops: RecentItem[];
  recentCashiers: RecentItem[];
}

export function RecentActivityGrid({ 
  recentShopOwners, 
  recentShops, 
  recentCashiers 
}: RecentActivityGridProps) {
  const getInitial = (item: RecentItem) => {
    if (item.fullName) {
      return item.fullName.charAt(0);
    }
    if (item.shopName) {
      return item.shopName.charAt(0);
    }
    if (item.username) {
      return item.username.charAt(0);
    }
    return 'U';
  };

  const getPrimaryText = (item: RecentItem) => {
    if (item.fullName) {
      return item.fullName;
    }
    if (item.shopName) {
      return item.shopName;
    }
    if (item.username) {
      return item.username;
    }
    return 'Unknown';
  };

  const getSecondaryText = (item: RecentItem) => {
    if (item.username && !item.shopName) {
      return `@${item.username}`;
    }
    if (item.location) {
      return item.location;
    }
    if (item.shop?.shopName) {
      return item.shop.shopName;
    }
    return '';
  };

  const getStatus = (item: RecentItem) => {
    if (item.isActive !== undefined) {
      return item.isActive ? 'Active' : 'Inactive';
    }
    if (item.status) {
      return item.status;
    }
    return 'Unknown';
  };

  const getStatusColor = (item: RecentItem) => {
    if (item.isActive !== undefined) {
      return item.isActive ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200';
    }
    if (item.status) {
      return item.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <RecentItemCard
        title="Recent Shop Owners"
        items={recentShopOwners}
        avatarColor="bg-green-100"
        avatarTextColor="text-green-600"
        getInitial={getInitial}
        getPrimaryText={getPrimaryText}
        getSecondaryText={getSecondaryText}
        getStatus={getStatus}
        getStatusColor={getStatusColor}
      />
      <RecentItemCard
        title="Recent Shops"
        items={recentShops}
        avatarColor="bg-green-100"
        avatarTextColor="text-green-600"
        getInitial={getInitial}
        getPrimaryText={getPrimaryText}
        getSecondaryText={getSecondaryText}
        getStatus={getStatus}
        getStatusColor={getStatusColor}
      />
      <RecentItemCard
        title="Recent Cashiers"
        items={recentCashiers}
        avatarColor="bg-green-100"
        avatarTextColor="text-green-600"
        getInitial={getInitial}
        getPrimaryText={getPrimaryText}
        getSecondaryText={getSecondaryText}
        getStatus={getStatus}
        getStatusColor={getStatusColor}
      />
    </div>
  );
} 