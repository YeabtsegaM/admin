import { ReactNode } from 'react';
import { DataTableHeader } from './DataTableHeader';
import { DataTableSearch } from './DataTableSearch';
import { DataTableContent } from './DataTableContent';
import { EmptyState } from './EmptyState';

export interface Column<T> {
  key: string;
  header: string;
  render: (item: T, index: number) => ReactNode;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddClick?: () => void;
  addButtonText?: string;
  title: string;
  loading?: boolean;
  searchPlaceholder?: string;
  emptyStateMessage?: string;
  noDataMessage?: string;
  className?: string;
  // NEW: Shop filter props
  shopFilter?: {
    selectedShop: string;
    onShopFilterChange: (shopId: string) => void;
    shops: Array<{ _id: string; shopName: string }>;
  };
}

export function DataTable<T>({
  data,
  columns,
  searchTerm,
  onSearchChange,
  onAddClick,
  addButtonText = "Add New",
  title,
  loading = false,
  searchPlaceholder = "Search...",
  emptyStateMessage = "No results found",
  noDataMessage = "No data yet",
  className = "",
  shopFilter
}: DataTableProps<T>) {
  return (
    <div className={`p-6 bg-gray-100 transition-colors duration-300 ${className}`}>
      <div className="bg-gray-100 rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header Section */}
        <div className="px-6 py-4 border-b border-gray-200">
          <DataTableHeader 
            title={title}
            onAddClick={onAddClick}
            addButtonText={addButtonText}
          />
        </div>
        
        {/* Search Section */}
        <div className="px-6 py-4 border-b border-gray-200">
          <DataTableSearch 
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            resultCount={data.length}
            placeholder={searchPlaceholder}
            shopFilter={shopFilter}
          />
        </div>

        {/* Table Section */}
        <div className="overflow-hidden">
          <DataTableContent
            data={data}
            columns={columns}
            searchTerm={searchTerm}
            emptyStateMessage={emptyStateMessage}
            noDataMessage={noDataMessage}
          />
        </div>
      </div>
    </div>
  );
} 