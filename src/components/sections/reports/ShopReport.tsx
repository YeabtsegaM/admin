'use client';

import React from 'react';
import DataTable, { Column } from '@/components/ui/ReportsDataTable';
import { BalanceData } from '../../../types';
import { exportToExcel, ExcelColumn } from '../../../utils/excelExport';

interface ShopReportProps {
  balanceData: BalanceData[];
  loading: boolean;
  sortable?: boolean;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  dateRange?: string;
  startDate?: string;
  endDate?: string;
}

export default function ShopReport({ balanceData, loading, sortable = false, sortKey = '', sortDirection = 'asc', onSort, dateRange = '30', startDate = '', endDate = '' }: ShopReportProps) {
  
  const handleDownloadExcel = () => {
    if (balanceData.length === 0) return;
    
    // Generate filename with date information
    const getDateString = () => {
      if (dateRange === 'custom' && startDate && endDate) {
        return `${startDate}_to_${endDate}`;
      } else if (dateRange === '7') {
        return 'Last_7_Days';
      } else if (dateRange === '30') {
        return 'Last_30_Days';
      } else if (dateRange === '90') {
        return 'Last_90_Days';
      }
      return 'Last_30_Days';
    };
    
         const excelColumns: ExcelColumn[] = [
       { key: 'rowIndex', label: 'NO.', render: (value) => String(value || '') },
       { key: 'shopName', label: 'SHOP' },
       { key: 'tickets', label: 'TICKETS' },
       { key: 'bets', label: 'BETS' },
       { key: 'unclaimed', label: 'UNCLAIMED' },
       { key: 'unclaimedCount', label: 'UNCLAIMED COUNT' },
       { key: 'redeemed', label: 'REDEEMED' },
       { key: 'redeemCount', label: 'REDEEM COUNT' },
       { key: 'ggr', label: 'GGR' },
       { key: 'netBalance', label: 'NET BALANCE' }
     ];
    
    const filename = `Retail_Report_${getDateString()}`;
    exportToExcel(balanceData, excelColumns, filename);
  };

     const columns: Column<BalanceData>[] = [
     {
       key: 'index',
       label: 'NO.',
       sortable: false,
       render: (value: unknown, row: BalanceData) => (
         <div className="text-sm text-gray-500">
           {(row as any).rowIndex !== undefined ? (row as any).rowIndex + 1 : ''}
         </div>
       )
     },
     {
       key: 'shopName',
       label: 'SHOP',
       sortable: true,
       render: (value: unknown, row: BalanceData) => (
         <div className="text-sm font-medium text-gray-900">
           {row.shopName || 'Unknown Shop'}
         </div>
       )
     },
    {
      key: 'tickets',
      label: 'TICKETS',
      sortable: true,
      render: (value: unknown) => {
        const numValue = Number(value) || 0;
        return (
          <div className="text-sm text-gray-900">{numValue.toLocaleString()}</div>
        );
      }
    },
    {
      key: 'bets',
      label: 'BETS',
      sortable: true,
      render: (value: unknown) => {
        const numValue = Number(value) || 0;
        return (
          <div className="text-sm text-gray-900">Br. {numValue.toLocaleString()}</div>
        );
      }
    },
    {
      key: 'unclaimed',
      label: 'UNCLAIMED',
      sortable: true,
      render: (value: unknown) => {
        const numValue = Number(value) || 0;
        return (
          <div className="text-sm text-gray-900">Br. {numValue.toLocaleString()}</div>
        );
      }
    },
    {
      key: 'unclaimedCount',
      label: 'UNCLAIMED COUNT',
      sortable: true,
      render: (value: unknown) => {
        const numValue = Number(value) || 0;
        return (
          <div className="text-sm text-gray-900">{numValue.toLocaleString()}</div>
        );
      }
    },
    {
      key: 'redeemed',
      label: 'REDEEMED',
      sortable: true,
      render: (value: unknown) => {
        const numValue = Number(value) || 0;
        return (
          <div className="text-sm text-gray-900">Br. {numValue.toLocaleString()}</div>
        );
      }
    },
    {
      key: 'redeemCount',
      label: 'REDEEM COUNT',
      sortable: true,
      render: (value: unknown) => {
        const numValue = Number(value) || 0;
        return (
          <div className="text-sm text-gray-900">{numValue.toLocaleString()}</div>
        );
      }
    },
    {
      key: 'ggr',
      label: 'GGR',
      sortable: true,
      render: (value: unknown) => {
        const numValue = Number(value) || 0;
        return (
          <div className={`text-sm font-medium px-2 py-1 rounded-lg border-2 ${
            numValue >= 0 
              ? 'text-green-700 bg-green-50 border-green-200' 
              : 'text-red-700 bg-red-50 border-red-200'
          }`}>
            Br. {numValue.toLocaleString()}</div>
        );
      }
    },
    {
      key: 'netBalance',
      label: 'NET BALANCE',
      sortable: true,
      render: (value: unknown) => {
        const numValue = Number(value) || 0;
        return (
          <div className={`text-sm font-medium px-2 py-1 rounded-lg border-2 ${
            numValue >= 0 
              ? 'text-green-700 bg-green-50 border-green-200' 
              : 'text-red-700 bg-red-50 border-red-200'
          }`}>
            Br. {numValue.toLocaleString()}</div>
        );
      }
    },

  ];

  if (loading) {
  return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (balanceData.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <div className="mb-6">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="text-lg font-medium text-gray-500 mb-2">No shop data available</h3>
          <p className="text-sm text-gray-400">Try adjusting your filters or refreshing the data</p>
        </div>
                  </div>
    );
  }

    return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header with Download Button */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-400">...</h3>
                 <button
           onClick={handleDownloadExcel}
           disabled={balanceData.length === 0}
           className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 text-sm"
         >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
          Download Excel
        </button>
      </div>
      
      <DataTable<BalanceData>
        columns={columns}
        data={balanceData}
        isLoading={loading}
        emptyMessage="No shop data found for the selected criteria"
        sortable={sortable}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={onSort}
      />
    </div>
  );
}
