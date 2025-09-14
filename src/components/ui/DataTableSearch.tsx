import { CustomDropdown } from './CustomDropdown';

interface DataTableSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  resultCount: number;
  placeholder?: string;
  // NEW: Shop filter props
  shopFilter?: {
    selectedShop: string;
    onShopFilterChange: (shopId: string) => void;
    shops: Array<{ _id: string; shopName: string }>;
    totalCount?: number; // Total count before filtering
  };
}

export function DataTableSearch({ 
  searchTerm, 
  onSearchChange, 
  resultCount, 
  placeholder = "Search...",
  shopFilter
}: DataTableSearchProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-10 text-gray-900 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
            placeholder={placeholder}
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Shop Filter Dropdown */}
        {shopFilter && (
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Filter by Shop:
            </label>
            <CustomDropdown
              options={[
                { value: 'all', label: 'All Shops' },
                ...shopFilter.shops.map(shop => ({
                  value: shop._id,
                  label: shop.shopName
                }))
              ]}
              value={shopFilter.selectedShop}
              onChange={shopFilter.onShopFilterChange}
              placeholder="Select shop..."
              className="min-w-[150px]"
            />
          </div>
        )}
      </div>

      {/* Results count and filter info */}
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        {searchTerm && (
          <div className="text-sm text-gray-700 font-medium">
            Found {resultCount} result{resultCount !== 1 ? 's' : ''}
          </div>
        )}
        
        {/* Show total count when no filter is applied */}
        {shopFilter && shopFilter.selectedShop === 'all' && (
          <div className="text-sm text-gray-700 font-medium">
            Total cashiers: <span className="font-semibold text-gray-900">{resultCount}</span>
          </div>
        )}
      </div>
    </div>
  );
} 