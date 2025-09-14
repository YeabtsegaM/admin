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
}

interface RecentItemCardProps {
  title: string;
  items: RecentItem[];
  avatarColor: string;
  avatarTextColor: string;
  getInitial: (item: RecentItem) => string;
  getPrimaryText: (item: RecentItem) => string;
  getSecondaryText: (item: RecentItem) => string;
  getStatus?: (item: RecentItem) => string;
  getStatusColor?: (item: RecentItem) => string;
}

export default function RecentItemCard({
  title,
  items,
  avatarColor,
  avatarTextColor,
  getInitial,
  getPrimaryText,
  getSecondaryText,
  getStatus,
  getStatusColor
}: RecentItemCardProps) {
  return (
    <div className="bg-gray-100 rounded-lg shadow-sm border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
      </div>
      <div className="p-4">
        {items && items.length > 0 ? (
          <div className="space-y-3">
            {items.slice(0, 3).map((item, index) => {
              const status = getStatus ? getStatus(item) : (item.isActive ? 'Active' : 'Inactive');
              const statusColor = getStatusColor ? getStatusColor(item) : (
                item.isActive 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-red-100 text-red-700 border border-red-200'
              );
              
              return (
                <div key={item._id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 ${avatarColor} rounded-full flex items-center justify-center shadow-sm`}>
                        <span className={`${avatarTextColor} text-sm font-medium`}>
                          {getInitial(item)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {getPrimaryText(item)}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {getSecondaryText(item)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                      {status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="text-gray-400 text-sm">No items found</div>
          </div>
        )}
      </div>
    </div>
  );
} 