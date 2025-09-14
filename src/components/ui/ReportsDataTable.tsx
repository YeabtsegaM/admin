'use client';

import React from 'react';

export interface Column<T = any> {
  key: string;
  label: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
}

export interface DataTableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  className?: string;
  onRowClick?: (row: T) => void;
  sortable?: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
}

export default function DataTable<T = any>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "No data found",
  emptyIcon,
  className = "",
  onRowClick,
  sortable = false,
  onSort,
  sortKey,
  sortDirection
}: DataTableProps<T>) {
  const handleSort = (key: string) => {
    if (!sortable || !onSort) return;
    
    const direction = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(key, direction);
  };

  const renderSortIcon = (key: string) => {
    if (!sortable || !onSort) return null;
    
    if (sortKey === key) {
      return sortDirection === 'asc' ? (
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      );
    }
    
    return (
      <svg className="w-4 h-4 ml-1 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-gray-100 rounded-lg shadow-md border border-gray-200">
        <div className="bg-white flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg shadow-md border border-gray-200">
        <div className="bg-white p-8 text-center">
          {emptyIcon && <div className="mb-4 flex justify-center">{emptyIcon}</div>}
          <p className="text-lg font-medium text-gray-900 mb-2">{emptyMessage}</p>
          <p className="text-gray-500">No data available to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 rounded-lg shadow-md border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    sortable && column.sortable ? 'cursor-pointer hover:bg-gray-100 transition-colors duration-200' : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.label}
                    {column.sortable && renderSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => {
              const rowData = row as any;
              const rowKey = (rowData.id as string) || (rowData._id as string) || index.toString();
              return (
                <tr key={rowKey} className="hover:bg-gray-50 transition-colors">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                      {column.render ? column.render(rowData[column.key], row) : String(rowData[column.key] || '')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
